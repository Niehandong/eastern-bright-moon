/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { api, resolveAssetUrl } from '../services/api';

export const AboutSection: React.FC = () => {
  const [bio, setBio] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBio()
      .then(data => {
        // 字段平滑适配：将后端的 snake_case 自动映射为前端期待的 camelCase
        setBio({
          name: data.name,
          nameEn: data.name_en,
          title: data.title,
          motto: data.motto,
          introParagraphs: data.intro_paragraphs || [],
          coverImage: data.cover_image
        });
      })
      .catch(err => console.error('获取自述数据失败：', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center font-serif text-brand-dark/60 tracking-widest text-sm pt-32">
        <span>漫步中...</span>
      </div>
    );
  }

  if (!bio) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center font-serif text-brand-dark/60 tracking-widest text-sm pt-32">
        <span>暂无内容</span>
      </div>
    );
  }

  return (
    <section className="relative w-full min-h-screen bg-transparent text-brand-dark pt-32 pb-24 overflow-hidden font-serif">
      {/* Decorative wash texture on background */}
      <div className="absolute top-0 right-0 w-[40%] h-[70%] opacity-10 bg-radial-[circle_at_center,rgba(197,168,128,0.35)_0%,transparent_70%] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] opacity-15 bg-radial-[circle_at_center,rgba(234,220,211,0.5)_0%,transparent_80%] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section header: Fine Art Gallery Catalog Style */}
        <div className="flex flex-col gap-2 mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-light tracking-[0.2em] text-[#2c2722] leading-none">
            关于我
          </h2>
          <span className="font-sans font-light text-xs tracking-[0.25em] text-[#8c8273]/80 uppercase">
            About Me
          </span>
        </div>

        {/* Dynamic Bento & Columns Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Column 1: Portrait / Big Atmospheric Image (4 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="lg:col-span-5 relative w-full h-[350px] md:h-[500px]"
          >
            {/* Elegant multi-layer frame */}
            <div className="absolute inset-4 border border-brand-gold/20 z-10" />
            <div className="absolute inset-0 border border-brand-gold/10 -translate-x-3 translate-y-3 pointer-events-none" />
            
            <img
              src={resolveAssetUrl(bio.coverImage)}
              alt={bio.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter brightness-[0.85] saturation-75 shadow-zen"
            />
            
            {/* Float Badge */}
            <div className="absolute bottom-8 right-8 bg-brand-dark/95 backdrop-blur-md text-brand-cream border border-brand-gold/30 px-6 py-4 flex flex-col items-center justify-center pointer-events-none shadow-zen">
              <span className="font-songti text-lg tracking-[0.3em] font-light">{bio.name}</span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-brand-gold/80 mt-1">{bio.nameEn}</span>
            </div>
          </motion.div>

          {/* Column 2: Profile descriptions, Philosophy and details (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            
            {/* Header / Motto Quote Box */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="p-8 border-l-4 border-brand-gold bg-brand-clay/35 relative"
            >
              {/* Giant quote mark sign */}
              <span className="absolute right-6 top-2 font-serif text-8xl text-brand-gold/10 pointer-events-none font-semibold select-none leading-none">“</span>
              <h3 className="text-xl md:text-2xl font-light text-brand-dark leading-relaxed font-serif tracking-widest pl-1">
                「 {bio.motto} 」
              </h3>
              <p className="font-mono text-xs text-brand-gold/80 uppercase tracking-widest mt-3 pl-1">
                {bio.title}
              </p>
            </motion.div>

            {/* Prose biography paragraphs */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="flex flex-col gap-8 text-[#4a4238] text-sm md:text-base font-serif pl-6 border-l-2 border-brand-gold/30 md:pl-8"
            >
              {bio.introParagraphs.map((para: string, idx: number) => (
                <p 
                  key={idx} 
                  className="font-light leading-relaxed tracking-wider text-justify whitespace-pre-line"
                >
                  {para}
                </p>
              ))}
            </motion.div>

            {/* Aesthetic stamp with horizontal calligraphy styling */}
            <div className="mt-8 flex justify-end">
              <div className="flex flex-col items-center border border-brand-gold/40 p-3 rounded-none bg-brand-cream/40">
                <span className="font-serif text-xs tracking-[0.4em] font-semibold text-brand-gold">永恒的精神</span>
                <span className="font-mono text-[8px] text-brand-dark/40 tracking-[0.2em] transform scale-90 mt-1">MEMORABILIA</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
