"use client";

import { useEffect, useState } from "react";

const AnimatedBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 主要动态渐变背景 */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.6) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(147, 51, 234, 0.5) 0%, transparent 40%),
            radial-gradient(circle at 40% 90%, rgba(16, 185, 129, 0.4) 0%, transparent 40%),
            radial-gradient(circle at 90% 20%, rgba(239, 68, 68, 0.3) 0%, transparent 40%)
          `,
          animation: 'backgroundMove 12s ease-in-out infinite'
        }}
      />
      
      {/* 快速移动的光点 */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 8 + 4 + 'px',
              height: Math.random() * 8 + 4 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              background: `rgba(${Math.random() * 255}, ${Math.random() * 255}, 255, 0.6)`,
              boxShadow: `0 0 ${Math.random() * 20 + 10}px rgba(255, 255, 255, 0.5)`,
              animation: `sparkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: Math.random() * 5 + 's'
            }}
          />
        ))}
      </div>

      {/* 流动的条纹 */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 20px,
              rgba(59, 130, 246, 0.1) 20px,
              rgba(59, 130, 246, 0.1) 40px
            )
          `,
          animation: 'stripeMove 8s linear infinite'
        }}
      />

      {/* 脉冲圆环 */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border-2 border-white/20"
            style={{
              width: `${(i + 1) * 100}px`,
              height: `${(i + 1) * 100}px`,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              animation: `pulse ${3 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* 旋转的星星 */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white/30 text-2xl"
            style={{
              left: Math.random() * 90 + 5 + '%',
              top: Math.random() * 90 + 5 + '%',
              animation: `rotate ${Math.random() * 10 + 5}s linear infinite`,
              animationDelay: Math.random() * 3 + 's'
            }}
          >
            ✦
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes backgroundMove {
          0% { 
            transform: translate(0, 0) scale(1);
            filter: hue-rotate(0deg);
          }
          25% { 
            transform: translate(-20px, -30px) scale(1.1);
            filter: hue-rotate(90deg);
          }
          50% { 
            transform: translate(30px, -20px) scale(0.9);
            filter: hue-rotate(180deg);
          }
          75% { 
            transform: translate(-10px, 40px) scale(1.05);
            filter: hue-rotate(270deg);
          }
          100% { 
            transform: translate(0, 0) scale(1);
            filter: hue-rotate(360deg);
          }
        }
        
        @keyframes sparkle {
          0%, 100% { 
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% { 
            opacity: 1;
            transform: scale(1.2);
          }
        }
        
        @keyframes stripeMove {
          0% { transform: translateX(-100px); }
          100% { transform: translateX(100px); }
        }
        
        @keyframes pulse {
          0% { 
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.8);
          }
          50% { 
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(1.2);
          }
          100% { 
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.8);
          }
        }
        
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground; 