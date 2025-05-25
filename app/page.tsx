"use client";

import { useState } from "react";

export default function Home() {
  const [test, setTest] = useState("Hello World");

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* 深蓝夜空渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-blue-950/50 via-transparent to-slate-800/30"></div>
      
      {/* 星空背景 */}
      <div className="absolute inset-0">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>
      
      {/* 内容区域 */}
      <div className="relative z-10">
        <div className="container max-w-md mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-center mb-6 text-white drop-shadow-lg">吵架包赢</h1>
          <p className="text-center text-gray-300 mb-8 drop-shadow">
            输入对方的话，选择语气强度，获取完美回击
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white text-center">
            <p>应用正在优化中...</p>
            <p className="text-sm mt-2 opacity-75">即将为您提供最强回击功能</p>
          </div>
        </div>
      </div>
    </main>
  );
}