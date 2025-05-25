"use client";

import { useState } from "react";

export default function Home() {
  const [test, setTest] = useState("Hello World");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">吵架包赢</h1>
        <p className="text-xl mb-8">AI智能回击系统</p>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md">
          <p className="mb-4">状态: {test}</p>
          <button 
            onClick={() => setTest("系统正常运行")}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            测试按钮
          </button>
        </div>
        <p className="mt-4 text-sm text-gray-300">
          如果你能看到这个页面并且按钮可以点击，说明基础功能正常
        </p>
      </div>
    </div>
  );
}