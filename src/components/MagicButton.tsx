"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface MagicButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export function MagicButton({ onClick, isLoading }: MagicButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={isLoading}
      className="relative group px-12 py-6 rounded-[32px] bg-white shadow-[0_20px_40px_rgba(230,230,250,0.5)] overflow-hidden transition-all duration-500"
    >
      {/* Магический градиент при наведении */}
      <div className="absolute inset-0 bg-gradient-to-tr from-magic-lavender/40 via-transparent to-magic-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="relative z-10 flex items-center gap-4 text-magic-deep font-sans font-medium tracking-wide">
        {isLoading ? (
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-magic-gold/20 border-t-magic-gold rounded-full"
          />
        ) : (
          <motion.div
            animate={{ 
              rotate: [0, 15, -15, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="w-5 h-5 text-magic-gold fill-magic-gold/20" />
          </motion.div>
        )}
        <span className="text-lg">Вытянуть послание</span>
      </div>

      {/* Эффект магического блика */}
      <motion.div 
        className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-magic-gold/10 to-transparent"
        animate={{ left: ['-100%', '200%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
      />
    </motion.button>
  );
}
