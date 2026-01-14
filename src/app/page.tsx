"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MagicButton } from "@/components/MagicButton";
import { MessageCard } from "@/components/MessageCard";
import { Sparkles } from "lucide-react";

interface Post {
  url: string;
  text: string;
}

export default function Home() {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      tg.ready();
      tg.expand();
      tg.setHeaderColor('#FFFDF0');
    }
  }, []);

  const handleShuffle = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching from /api/shuffle...");
      const initData = (window as any).Telegram?.WebApp?.initData || "";
      const timestamp = new Date().getTime();
      const res = await fetch(`/api/shuffle?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
          "x-telegram-init-data": initData,
        },
      });
      
      console.log("Response status:", res.status);
      const contentType = res.headers.get("content-type");
      console.log("Content-Type:", contentType);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error text:", errorText);
        throw new Error(`Server returned ${res.status}: ${errorText}`);
      }
      
      const data = await res.json();
      console.log("API Data received:", data);
      
      if (data.url) {
        setPost(data);
        if ((window as any).Telegram?.WebApp?.HapticFeedback) {
          (window as any).Telegram.WebApp.HapticFeedback.impactOccurred("medium");
        }
      }
      if (data.error) throw new Error(data.error);
    } catch (err: any) {
      console.error("Full fetch error:", err);
      setError("Не удалось получить послание. Попробуйте еще раз.");
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 selection:bg-magic-lavender/30">
      {/* Магический фон и паттерн */}
      <div className="magic-bg" />
      <div className="magic-pattern" />

      {/* Декоративные анимированные пятна */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="magic-glow top-[-10%] left-[-10%] w-[70%] h-[70%] bg-magic-lavender/40"
      />
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        className="magic-glow bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-magic-gold/10"
      />

      {/* Контент */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center gap-12 text-center">
        
        {/* Заголовок */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <div className="flex items-center justify-center mb-10">
            <Sparkles 
              strokeWidth={1.2}
              className="w-16 h-16 text-magic-gold animate-star drop-shadow-[0_0_15px_rgba(197,160,89,0.4)]" 
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-light text-magic-deep leading-tight tracking-tight">
            Твоё послание<br/>от МИРа!💖🪄
          </h1>
          <div className="flex items-center justify-center gap-4 opacity-60">
            <div className="h-px w-6 bg-magic-gold/40" />
            <p className="text-[10px] uppercase tracking-[0.3em] font-light">
              Магия момента
            </p>
            <div className="h-px w-6 bg-magic-gold/40" />
          </div>
        </motion.div>

        {/* Интерактивная область */}
        <div className="w-full flex flex-col items-center min-h-[400px] justify-center gap-6">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="glass-card px-6 py-4 text-sm text-magic-deep/70 z-20 mb-4"
              >
                {error}
              </motion.div>
            )}

            {!post ? (
              <motion.div
                key="shuffle-action"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                className="flex flex-col items-center gap-8"
              >
                <p className="text-magic-deep/70 text-lg md:text-xl font-serif italic tracking-wide">
                  Закрой глаза, сделай вдох...<br/>выдох... и нажми
                </p>
                <MagicButton onClick={handleShuffle} isLoading={loading} />
              </motion.div>
            ) : (
              <MessageCard 
                key="message-card"
                text={post.text} 
                url={post.url} 
                onClose={() => setPost(null)} 
              />
            )}
          </AnimatePresence>
        </div>

        {/* Футер */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          className="absolute bottom-[-60px] text-[9px] uppercase tracking-[0.4em] font-light"
        >
          Mindfulness • Magic
        </motion.div>
      </div>
    </main>
  );
}
