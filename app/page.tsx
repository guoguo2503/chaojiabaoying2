"use client";

import { useState } from "react";

export default function Home() {
  const [opponentWords, setOpponentWords] = useState("");
  const [intensity, setIntensity] = useState(5);
  const [responses, setResponses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!opponentWords.trim()) {
      setError("请输入对方的话");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      // 简化的API调用
      const API_KEY = "sk-hmnwfcnixfotejkfstpbxetstoukbuicttfqsshlmznwlxne";
      const API_URL = "https://api.siliconflow.cn/v1/chat/completions";
      
      const prompt = `对方说了这句话："${opponentWords}"

请根据这句话，生成3种不同的回击方案。语气强度为${intensity}（1-10的范围）。

请直接给出3个回复，每个回复之间用 "---" 分隔。不要有序号，不要加双引号。`;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "Pro/deepseek-ai/DeepSeek-V3",
          messages: [
            {
              role: "system",
              content: "你是一个专业的吵架助手，擅长针对对方的话给出犀利有力的回击。",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API错误: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || "";
      
      // 简单解析响应
      const parts = content.split("---").map((p: string) => p.trim()).filter((p: string) => p);
      setResponses(parts.length > 0 ? parts : [content]);
      
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "生成失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950">
      <div className="container max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">吵架包赢</h1>
          <p className="text-gray-300">AI智能回击，让你在争论中占据上风</p>
        </div>

        {/* 表单 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                对方的话
              </label>
              <textarea
                value={opponentWords}
                onChange={(e) => setOpponentWords(e.target.value)}
                placeholder="输入对方说的话..."
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:border-white/50 focus:outline-none"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                语气强度: {intensity}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-300 mt-1">
                <span>温和</span>
                <span>强烈</span>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {loading ? "生成中..." : "开始吵架"}
            </button>
          </form>
          
          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* 结果显示 */}
        {responses.length > 0 && (
          <div className="space-y-4">
            {responses.map((response, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="text-green-400 font-medium mb-2">
                  回击方案 {index + 1}
                </h3>
                <p className="text-white whitespace-pre-line">{response}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}