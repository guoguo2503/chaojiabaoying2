"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { generateResponses } from "@/lib/api";
import { saveArgument, getRecentArguments } from "@/lib/storage";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ArgumentFormProps {
  onResponsesGenerated: (responses: string[]) => void;
  setLoading: (loading: boolean) => void;
}

export default function ArgumentForm({ onResponsesGenerated, setLoading }: ArgumentFormProps) {
  const [opponentWords, setOpponentWords] = useState("");
  const [intensity, setIntensity] = useState([5]);
  const [recentArguments, setRecentArguments] = useState<string[]>([]);
  const [selectedRecent, setSelectedRecent] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        const recent = getRecentArguments();
        setRecentArguments(recent);
      } catch (error) {
        console.error("Error loading recent arguments:", error);
        setRecentArguments([]);
      }
    }
  }, [mounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!opponentWords.trim()) {
      toast.error("请输入对方的话");
      return;
    }

    setLoading(true);
    
    try {
      const responses = await generateResponses(opponentWords, intensity[0]);
      onResponsesGenerated(responses);
      
      if (mounted) {
        try {
          saveArgument(opponentWords);
          const recent = getRecentArguments();
          setRecentArguments(recent);
        } catch (error) {
          console.error("Error saving argument:", error);
        }
      }
    } catch (error) {
      console.error("Error generating responses:", error);
      toast.error("生成回复失败，请重试");
      onResponsesGenerated([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecent = (value: string) => {
    setSelectedRecent(value);
    setOpponentWords(value);
  };

  if (!mounted) {
    return (
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {recentArguments.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="recent">最近的吵架</Label>
              <Select value={selectedRecent} onValueChange={handleSelectRecent}>
                <SelectTrigger id="recent">
                  <SelectValue placeholder="选择最近的吵架内容" />
                </SelectTrigger>
                <SelectContent>
                  {recentArguments.map((arg, index) => (
                    <SelectItem key={index} value={arg}>
                      {arg.length > 30 ? `${arg.substring(0, 30)}...` : arg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="opponentWords">对方的话</Label>
            <Textarea
              id="opponentWords"
              placeholder="输入对方说的话..."
              value={opponentWords}
              onChange={(e) => setOpponentWords(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="intensity">语气强烈程度</Label>
              <span className="text-lg font-bold">{intensity[0]}</span>
            </div>
            <Slider
              id="intensity"
              min={1}
              max={10}
              step={1}
              value={intensity}
              onValueChange={setIntensity}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>温和</span>
              <span>强烈</span>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-[#07C160] hover:bg-[#06AE56] text-white"
          >
            开始吵架
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}