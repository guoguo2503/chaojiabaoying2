import { toast } from "sonner";

interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  system_fingerprint: string;
}

export async function generateResponses(
  opponentWords: string,
  intensity: number
): Promise<string[]> {
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "sk-hmnwfcnixfotejkfstpbxetstoukbuicttfqsshlmznwlxne";
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.siliconflow.cn/v1/chat/completions";

  // Create a prompt that guides the model to generate appropriate responses
  const prompt = createPrompt(opponentWords, intensity);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.NEXT_PUBLIC_MODEL_NAME || "Pro/deepseek-ai/DeepSeek-V3",
        messages: [
          {
            role: "system",
            content: "你是一个专业的吵架助手，擅长针对对方的话给出犀利有力的回击。",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(`API错误: ${errorData.message || '未知错误'}`);
    }

    const data: DeepSeekResponse = await response.json();
    const content = data.choices[0]?.message?.content || "";

    // Parse the content to extract the three responses
    return parseResponses(content);
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    toast.error(error instanceof Error ? error.message : "调用API失败，请重试");
    throw error;
  }
}

function createPrompt(opponentWords: string, intensity: number): string {
  return `对方说了这句话："${opponentWords}"

请根据这句话，生成3种不同的回击方案。语气强度为${intensity}（1-10的范围，${intensity}表示非常强烈）。

请直接给出3个回复，每个回复之间用 "---" 分隔。不要有序号，不要加双引号，不要有额外的解释，直接给出回复内容。

回复需要针对性强，犀利有力，能够让对方无法反驳。根据强度${intensity}，调整语言的强硬程度和攻击性。`;
}

function parseResponses(content: string): string[] {
  // Clean up the content by removing quotes and trimming
  const cleanContent = content.replace(/^["']|["']$/g, '').trim();
  
  // Split by separator and filter out empty strings
  const parts = cleanContent.split("---").map(p => {
    // Remove quotes, numbers, and extra whitespace
    return p.replace(/^["']|["']$/g, '')
           .replace(/^\d+[\.\)]\s*/, '')
           .trim();
  }).filter(p => p);
  
  // If we don't have exactly 3 parts, try other parsing methods
  if (parts.length !== 3) {
    // Try to find numbered responses (1. 2. 3.) and clean them
    const numberedRegex = /[1-3][\.\)]\s*([\s\S]+?)(?=(?:[1-3][\.\)]|$))/g;
    const numberedMatches = Array.from(cleanContent.matchAll(numberedRegex));
    
    if (numberedMatches.length === 3) {
      return numberedMatches.map(match => 
        match[1].replace(/^["']|["']$/g, '').trim()
      );
    }
    
    // If we can't parse properly, split the content into roughly 3 equal parts
    if (parts.length === 0) {
      const paragraphs = cleanContent.split("\n\n").filter(p => p.trim());
      if (paragraphs.length >= 3) {
        return [
          paragraphs[0].replace(/^["']|["']$/g, '').trim(),
          paragraphs[1].replace(/^["']|["']$/g, '').trim(),
          paragraphs.slice(2).join("\n\n").replace(/^["']|["']$/g, '').trim()
        ];
      }
      
      // Last resort: just return the whole content as one response
      return [cleanContent];
    }
  }
  
  // Return what we have, up to 3 responses
  return parts.slice(0, 3);
}