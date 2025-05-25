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
  // 确保在客户端环境中运行
  if (typeof window === "undefined") {
    throw new Error("此函数只能在客户端运行");
  }

  const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "sk-hmnwfcnixfotejkfstpbxetstoukbuicttfqsshlmznwlxne";
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.siliconflow.cn/v1/chat/completions";
  const MODEL_NAME = process.env.NEXT_PUBLIC_MODEL_NAME || "Pro/deepseek-ai/DeepSeek-V3";

  // 验证必要的配置
  if (!API_KEY || !API_URL) {
    throw new Error("API配置不完整");
  }

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
        model: MODEL_NAME,
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
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error?.message || errorMessage;
      } catch (e) {
        // 如果无法解析错误响应，使用默认错误信息
      }
      console.error("API Error:", errorMessage);
      throw new Error(`API错误: ${errorMessage}`);
    }

    const data: DeepSeekResponse = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error("API返回数据格式错误");
    }

    const content = data.choices[0]?.message?.content || "";
    
    if (!content.trim()) {
      throw new Error("API返回内容为空");
    }

    // Parse the content to extract the three responses
    return parseResponses(content);
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    
    // 根据错误类型提供更友好的错误信息
    let userMessage = "生成回复失败，请重试";
    if (error instanceof Error) {
      if (error.message.includes("网络")) {
        userMessage = "网络连接失败，请检查网络后重试";
      } else if (error.message.includes("API")) {
        userMessage = "服务暂时不可用，请稍后重试";
      } else if (error.message.includes("配置")) {
        userMessage = "服务配置错误，请联系管理员";
      }
    }
    
    toast.error(userMessage);
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
  try {
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
  } catch (error) {
    console.error("Error parsing responses:", error);
    return ["解析回复时出现错误，请重试"];
  }
}