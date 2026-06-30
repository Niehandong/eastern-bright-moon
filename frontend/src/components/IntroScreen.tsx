/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../services/api';

interface IntroScreenProps {
  onEnter: () => void;
}

const NATURE_BACKGROUNDS = [
  {
    url: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=1600&q=80",
    caption: "寂夜星空 · 璀璨",
  },
  {
    url: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1600&q=80",
    caption: "暖阳森野 · 曦光",
  },
  {
    url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80",
    caption: "金色田野 · 麦浪",
  },
  {
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80",
    caption: "晨雾湖光 · 潋滟",
  },
  {
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    caption: "浩瀚大海 · 蔚蓝",
  }
];

export const IntroScreen: React.FC<IntroScreenProps> = ({ onEnter }) => {
  const [index, setIndex] = useState(0);
  const [brandName, setBrandName] = useState('东方朗月');
  const [brandEn, setBrandEn] = useState('EASTERN BRIGHT MOON');

  useEffect(() => {
    api.getBio()
      .then(bio => {
        if (bio) {
          setBrandName(bio.name || '东方朗月');
          setBrandEn((bio.name_en || 'EASTERN BRIGHT MOON').toUpperCase());
        }
      })
      .catch(err => console.error('首屏动态同步标题失败:', err));
  }, []);

  // Background rotater: 5.5 seconds per image for standard organic pacing, matching Tawaraya Ryokan
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % NATURE_BACKGROUNDS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-screen bg-brand-dark overflow-hidden flex items-center justify-center font-serif text-brand-cream select-none">
      {/* Background Slideshow with extremely slow zoom (Ken Burns Effect) */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 0.9, scale: 1.02 }}
            exit={{ opacity: 0, scale: 1.0 }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${NATURE_BACKGROUNDS[index].url})` }}
          />
        </AnimatePresence>
        {/* Soft, dark gradient over background for perfect typography readability */}
        <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(18,18,18,0.05)_0%,rgba(18,18,18,0.45)_100%] pointer-events-none" />
        <div className="absolute inset-0 bg-brand-dark/15 pointer-events-none" />
      </div>

      {/* Main Content Card (Centered) */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-xl px-6 text-center select-none">
        
        {/* Celestial Moon centerpiece */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.2, ease: "easeOut" }}
          className="relative w-72 h-72 flex items-center justify-center mb-6 overflow-visible"
        >
          {/* 1. Deep Celestial Radiant Moon */}
          <motion.div
            animate={{ 
              scale: [1, 1.04, 1],
              opacity: [0.9, 1, 0.9]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-to-tr from-[#ffeebc] via-[#fdfbf7] to-[#ffffff] shadow-[0_0_80px_rgba(229,203,149,0.5),0_0_120px_rgba(255,255,255,0.35),inset_-4px_-4px_16px_rgba(229,203,149,0.3)] flex items-center justify-center"
          >
            {/* Subtle lunar surface texture detail */}
            <div className="absolute inset-0 rounded-full opacity-10 bg-[radial-gradient(circle_at_30%_30%,rgba(0,0,0,0.4)_0%,transparent_60%)] mix-blend-multiply" />
          </motion.div>

          {/* 2. Concentric Golden Astrolabe Ring encircling the Moon */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-dashed border-[#e5cb95]/25 pointer-events-none"
          />

          {/* 3. Floating Twinkle Stars & Glistening Points around the Moon */}
          <motion.div
            animate={{ 
              y: [-4, 4, -4],
              opacity: [0.4, 0.9, 0.4]
            }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] left-[20%] w-1.5 h-1.5 bg-brand-gold rounded-full filter blur-[0.5px]"
          />
          <motion.div
            animate={{ 
              y: [4, -4, 4],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            className="absolute top-[25%] right-[18%] w-1.5 h-1.5 bg-brand-gold/60 rounded-full filter blur-[0.5px]"
          />
          <motion.div
            animate={{ scale: [0.7, 1.2, 0.7], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[18%] left-[49%] w-[1.5px] h-3 bg-white/80"
          />
          <motion.div
            animate={{ scale: [1, 0.6, 1], opacity: [0.8, 0.3, 0.8] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            className="absolute top-[34%] left-[49%] w-3 h-[1.5px] bg-white/80"
          />
        </motion.div>

        {/* Huge, elegant typography name */}
        <motion.h1
          key={`name-${brandName}`}
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          animate={{ opacity: 1, letterSpacing: "0.4em" }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-light text-brand-cream leading-relaxed mb-1 font-songti mr-[-0.4em]"
        >
          {brandName}
        </motion.h1>

        {/* Simplified clean English subtitle */}
        <motion.p
          key={`en-${brandEn}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ duration: 2, delay: 0.3 }}
          className="text-xs tracking-[0.3em] font-light text-brand-cream/80 font-sans uppercase mb-16"
        >
          {brandEn}
        </motion.p>

        {/* Entrance Button */}
        <motion.button
          id="btn-entrance-enter"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, delay: 0.8 }}
          onClick={onEnter}
          className="relative px-8 py-2.5 bg-transparent border border-brand-gold/40 hover:border-brand-gold hover:bg-brand-gold/10 text-brand-cream rounded-none text-[10px] md:text-xs tracking-[0.5em] transition-all duration-700 cursor-pointer overflow-hidden group uppercase font-sans mr-[-0.5em] pointer-events-auto"
        >
          {/* Gentle glow effect behind */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-brand-cream/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          ENTER
        </motion.button>

        {/* Decorative thin gold line */}
        <motion.div 
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.3 }}
          transition={{ duration: 2, delay: 1 }}
          className="w-16 h-[1px] bg-brand-gold mt-16"
        />

        {/* Location / Current Scene index counter (extremely subtle) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          transition={{ delay: 1.5 }}
          className="mt-6 flex items-center gap-2 text-[10px] font-mono font-light text-brand-cream/50"
        >
          <span>{`0${index + 1}`}</span>
          <span className="w-5 h-[1px] bg-brand-gold/30 inline-block" />
          <span className="uppercase tracking-widest text-[9px]">{NATURE_BACKGROUNDS[index].caption}</span>
        </motion.div>
      </div>

      {/* Floating indicator: Scroll or explore hints */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none opacity-20">
        <span className="text-[9px] font-mono tracking-[0.2em] uppercase font-light">Wabi Sabi Artistry Space</span>
        <div className="w-[1px] h-4 bg-gradient-to-b from-brand-gold to-transparent" />
      </div>
    </div>
  );
};

