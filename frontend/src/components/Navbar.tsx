/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
      .catch(err => console.error('同步导航栏 Logo 失败:', err));
  }, []);

  // 正规化的 4 大内容板块路由路径定义
  const navItems = [
    { path: '/about', label: 'About', subLabel: '简介' },
    { path: '/article', label: 'Article', subLabel: '文章' },
    { path: '/picture', label: 'Picture', subLabel: '光影' },
    { path: '/moon', label: 'Moon', subLabel: '月之谕' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-brand-cream/80 backdrop-blur-md border-b border-brand-clay/40 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        {/* Brand Logo - 点击通过标准的 SPA 路由返回落地首屏 (/) */}
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <span className="font-songti font-semibold tracking-[0.2em] text-brand-dark text-lg transition-colors group-hover:text-brand-gold">
            {brandName}
          </span>
          <span className="w-[1px] h-3.5 bg-brand-gold/30 self-center hidden sm:inline-block" />
          <span className="font-mono text-[9px] tracking-[0.15em] text-brand-gold font-light uppercase hidden sm:inline-block mt-0.5">
            {brandEn}
          </span>
        </div>

        {/* Navigation Items - 采用正规的 React Router 驱动 */}
        <div className="flex items-center gap-2 md:gap-8">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative px-3 py-2 flex flex-col items-center transition-all duration-500 group cursor-pointer"
              >
                {/* Horizontal line indicator on hover/active */}
                <span className={`absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-brand-gold transition-all duration-500 origin-center ${isActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-60'}`} />

                {/* English label first, Serif Chinese on hover/active */}
                <span className={`font-mono text-xs tracking-wider uppercase font-medium ${isActive ? 'text-brand-gold' : 'text-brand-dark/50 group-hover:text-brand-dark/80'}`}>
                  {item.label}
                </span>

                <span className={`font-serif text-[10px] tracking-widest mt-0.5 font-light ${isActive ? 'text-brand-dark font-medium' : 'text-brand-dark/30 group-hover:text-brand-dark/60'}`}>
                  {item.subLabel}
                </span>
                
                {/* Subtle under-glow dot */}
                {isActive && (
                  <span className="w-1 h-1 bg-brand-gold rounded-full absolute -bottom-1" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Small decorative status */}
        <div className="hidden lg:flex items-center gap-3 select-none">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-ping opacity-75" />
          <span className="font-mono text-[10px] text-brand-gold/80 font-light tracking-widest uppercase">
            RESONANCE &middot; 静默生生
          </span>
        </div>
      </div>
    </nav>
  );
};
