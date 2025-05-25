"use client";

import { useState, Suspense, useEffect } from "react";
import { Toaster } from "sonner";
import dynamic from "next/dynamic";
import { ThemeProvider } from "@/components/ThemeProvider";

// 动态导入组件，禁用服务端渲染
const ArgumentForm = dynamic(() => import("@/components/ArgumentForm"), {
  ssr: false,
  loading: () => (
    <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  )
});

const ResponseDisplay = dynamic(() => import("@/components/ResponseDisplay"), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
    </div>
  )
});

function MainContent() {
  const [responses, setResponses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 flex items-center justify-center">
        <div className="text-white text-xl">加载中...</div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-center mb-6 text-white">
            吵架包赢
          </h1>
          <p className="text-center text-gray-300 mb-8">
            AI智能回击，让你在争论中占据上风
          </p>
          
          <ArgumentForm 
            onResponsesGenerated={setResponses} 
            setLoading={setLoading} 
          />
          
          <ResponseDisplay responses={responses} loading={loading} />
        </div>
      </div>
      
      <Toaster position="top-center" />
      
      <style jsx>{`
        .stars {
          width: 1px;
          height: 1px;
          background: transparent;
          box-shadow: 
            1541px 1847px #fff, 1651px 1980px #fff, 1831px 1495px #fff,
            1176px 659px #fff, 1948px 1274px #fff, 1583px 1297px #fff,
            1846px 1805px #fff, 1980px 1847px #fff, 1716px 1113px #fff,
            1678px 1945px #fff, 1695px 1815px #fff, 1525px 1554px #fff,
            1462px 1696px #fff, 1924px 1823px #fff, 1869px 1613px #fff,
            1777px 1695px #fff, 1823px 1113px #fff, 1980px 1274px #fff,
            1176px 1945px #fff, 1831px 1297px #fff, 1583px 1495px #fff,
            1651px 1847px #fff, 1541px 1980px #fff, 1948px 659px #fff,
            1846px 1274px #fff, 1980px 1805px #fff, 1716px 1847px #fff,
            1678px 1113px #fff, 1695px 1945px #fff, 1525px 1815px #fff,
            1462px 1554px #fff, 1924px 1696px #fff, 1869px 1823px #fff,
            1777px 1613px #fff, 1823px 1695px #fff, 1980px 1113px #fff,
            1176px 1274px #fff, 1831px 1945px #fff, 1583px 1297px #fff,
            1651px 1495px #fff, 1541px 1847px #fff, 1948px 1980px #fff;
          animation: animStar 50s linear infinite;
        }
        
        .stars2 {
          width: 2px;
          height: 2px;
          background: transparent;
          box-shadow: 
            700px 400px #e0f2fe, 400px 400px #f0f9ff, 1100px 300px #dbeafe,
            300px 300px #e0f2fe, 800px 300px #f0f9ff, 550px 100px #dbeafe,
            250px 800px #e0f2fe, 450px 800px #f0f9ff, 750px 800px #dbeafe,
            350px 200px #e0f2fe, 650px 200px #f0f9ff, 950px 200px #dbeafe,
            150px 600px #e0f2fe, 850px 600px #f0f9ff, 1050px 600px #dbeafe,
            500px 700px #e0f2fe, 200px 900px #f0f9ff, 600px 900px #dbeafe,
            900px 900px #e0f2fe, 1200px 900px #f0f9ff, 100px 500px #dbeafe,
            1300px 500px #e0f2fe, 1000px 100px #f0f9ff, 1400px 100px #dbeafe;
          animation: animStar 100s linear infinite;
        }
        
        .stars3 {
          width: 3px;
          height: 3px;
          background: transparent;
          box-shadow: 
            1200px 700px #fff, 300px 600px #fff, 1600px 400px #fff,
            700px 200px #fff, 1100px 800px #fff, 500px 500px #fff,
            1500px 300px #fff, 900px 900px #fff, 200px 100px #fff,
            1300px 600px #fff, 600px 700px #fff, 1000px 200px #fff,
            400px 800px #fff, 800px 400px #fff, 1400px 500px #fff;
          animation: animStar 150s linear infinite;
        }
        
        @keyframes animStar {
          from {
            transform: translateY(0px);
          }
          to {
            transform: translateY(-2000px);
          }
        }
      `}</style>
    </main>
  );
}

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <MainContent />
    </ThemeProvider>
  );
}