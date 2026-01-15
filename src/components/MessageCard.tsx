"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, RotateCcw } from "lucide-react";

interface MessageCardProps {
  text: string;
  url: string;
  onClose: () => void;
}

export function MessageCard({ text, url, onClose }: MessageCardProps) {
  const handleOpenPost = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      // Используем openLink для корректного открытия в Telegram
      tg.openLink(url);
      // Закрываем Mini App
      tg.close();
      // Предотвращаем стандартное поведение ссылки
      e.preventDefault();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
      transition={{ type: "spring", damping: 15, stiffness: 100 }}
      className="w-full max-w-sm mx-auto perspective-1000"
    >
      <div className="glass-card p-6 md:p-10 shadow-2xl relative group">
        {/* Декоративные внутренние элементы */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-magic-gold/5 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-magic-lavender/10 rounded-full blur-3xl -ml-16 -mb-16" />
        
        <div className="relative z-10 flex flex-col items-center">
          <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="flex justify-center mb-8"
          >
            <Sparkles 
              strokeWidth={1.2}
              className="w-12 h-12 text-magic-gold animate-star drop-shadow-[0_0_10px_rgba(197,160,89,0.3)]" 
            />
          </motion.div>

          <div className="space-y-6 text-center w-full">
            <p className="text-2xl md:text-3xl text-magic-deep font-serif font-light leading-relaxed italic">
              «{text}»
            </p>
            <div className="flex flex-col items-center gap-2">
              <div className="h-px w-12 bg-magic-gold/30" />
              <span className="text-magic-gold font-sans text-[10px] tracking-[0.2em] uppercase font-medium">
                Послание Вселенной
              </span>
            </div>
          </div>

          <div className="pt-4 flex flex-col items-center gap-4 w-full">
            <motion.a
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              href={url}
              onClick={handleOpenPost}
              className="flex items-center justify-center gap-3 w-full max-w-[280px] py-5 px-8 bg-magic-deep text-white rounded-[24px] font-sans font-medium hover:shadow-xl hover:shadow-magic-deep/20 transition-all"
            >
              Открыть пост
              <ArrowRight className="w-4 h-4 text-magic-gold" />
            </motion.a>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="flex items-center justify-center gap-3 w-full max-w-[280px] py-5 px-8 border border-magic-deep/10 text-magic-deep/60 rounded-[24px] font-sans text-sm hover:bg-magic-deep/5 transition-all whitespace-nowrap"
            >
              <RotateCcw className="w-4 h-4" />
              Попробовать еще раз
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
