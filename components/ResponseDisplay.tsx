"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface ResponseDisplayProps {
  responses: string[];
  loading: boolean;
}

export default function ResponseDisplay({ responses, loading }: ResponseDisplayProps) {
  if (loading) {
    return <LoadingWithProgress />;
  }
  
  if (responses.length === 0) {
    return null;
  }
  
  return (
    <AnimatePresence>
      <div className="space-y-4">
        {responses.map((response, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-md flex items-center">
                  <MessageCircle className="h-4 w-4 mr-2 text-[#07C160]" />
                  回击方案 {index + 1}
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4">
                <p className="whitespace-pre-line">{response}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
}

function LoadingWithProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95; // 不要到100%，保持加载状态
        return prev + Math.random() * 15;
      });
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="p-6">
      <div className="flex flex-col items-center space-y-6">
        {/* 张嘴闭嘴动画图标 */}
        <motion.div
          animate={{
            scaleY: [1, 0.6, 1],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-[#07C160] to-[#06AE56] rounded-full flex items-center justify-center">
            <motion.div
              animate={{
                scaleY: [1, 0.3, 1],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-8 h-4 bg-white rounded-full"
            />
          </div>
          {/* 说话气泡效果 */}
          <motion.div
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-[#07C160] rounded-full opacity-30"
          />
        </motion.div>

        {/* 进度条和文字 */}
        <div className="w-full space-y-3">
          <div className="text-center">
            <motion.h3
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-lg font-semibold text-[#07C160]"
            >
              回怼之神正在蓄力
            </motion.h3>
            <p className="text-sm text-muted-foreground mt-1">
              正在生成犀利回击...
            </p>
          </div>
          
          <Progress 
            value={progress} 
            className="w-full h-2"
          />
          
          <div className="text-center text-xs text-muted-foreground">
            {Math.round(progress)}%
          </div>
        </div>
      </div>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-[140px]" />
      </CardHeader>
      <Separator />
      <CardContent className="pt-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[95%]" />
        <Skeleton className="h-4 w-[85%]" />
      </CardContent>
    </Card>
  );
}