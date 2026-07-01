/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { api, resolveAssetUrl } from '../services/api';
import { ColumnIssue, ExhibitionReview } from '../types';
import { BookOpen, ExternalLink, ArrowRight, Eye, Calendar, Sparkles, MapPin, Feather, ChevronLeft, ChevronRight } from 'lucide-react';

export const ArticleSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'world' | 'space'>('world');
  const [selectedIssue, setSelectedIssue] = useState<ColumnIssue | null>(null);
  const [selectedReview, setSelectedReview] = useState<ExhibitionReview | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const [columnIssues, setColumnIssues] = useState<ColumnIssue[]>([]);
  const [exhibitionReviews, setExhibitionReviews] = useState<ExhibitionReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getIssues(), api.getExhibitions()])
      .then(([issuesData, reviewsData]) => {
        const mappedIssues: ColumnIssue[] = issuesData.map((issue: any) => ({
          id: issue.id,
          title: issue.title,
          issueNo: issue.issue_no,
          issueTitle: issue.issue_title,
          subtitle: issue.subtitle,
          date: issue.date,
          mainImage: issue.main_image,
          summary: issue.summary,
          textContent: issue.text_content,
          wechatLink: issue.wechat_link,
          tags: issue.tags || [],
          articles: (issue.articles || []).map((art: any) => ({
            id: art.id,
            title: art.title,
            subtitle: art.subtitle,
            date: art.date,
            content: art.content,
            sortOrder: art.sort_order
          }))
        }));

        const mappedReviews: ExhibitionReview[] = reviewsData.map((rev: any) => ({
          id: rev.id,
          title: rev.title,
          subtitle: rev.subtitle,
          artist: rev.artist,
          galleryName: rev.gallery_name,
          date: rev.date,
          rating: rev.rating,
          reviewText: rev.review_text,
          posterUrl: rev.poster_url
        }));

        setColumnIssues(mappedIssues);
        setExhibitionReviews(mappedReviews);
      })
      .catch(err => console.error('获取文章数据失败：', err))
      .finally(() => setLoading(false));
  }, []);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      // Scroll by roughly 1 card width (approx 340px - 400px plus gap)
      const scrollAmount = clientWidth > 640 ? 420 : 320;
      scrollContainerRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center font-serif text-brand-dark/60 tracking-widest text-sm pt-32">
        <span>慢阅读中...</span>
      </div>
    );
  }

  return (
    <section className="relative w-full min-h-screen bg-transparent text-brand-dark pt-32 pb-24 font-serif">
      {/* Decorative abstract elements */}
      <div className="absolute inset-x-0 top-32 h-[1px] bg-brand-gold/15" />
      <div className="absolute top-1/3 left-10 w-[30vw] h-[30vw] opacity-5 bg-radial-[circle_at_center,rgba(0,0,0,0.4)_0%,transparent_70%] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header: Fine Art Gallery Catalog Style */}
        <div className="flex flex-col gap-2 mb-16">
          <h2 className="text-3xl md:text-5xl font-light tracking-[0.2em] text-[#2c2722] leading-none">
            文章
          </h2>
          <span className="font-sans font-light text-xs tracking-[0.25em] text-[#8c8273]/80 uppercase">
            Articles
          </span>
        </div>

        {/* Tab Switchers */}
        <div className="flex justify-center md:justify-start gap-12 border-b border-brand-clay/50 pb-4 mb-16">
          <button
            id="tab-article-world"
            onClick={() => { setActiveTab('world'); setSelectedIssue(null); }}
            className={`relative pb-4 font-serif text-lg tracking-[0.2em] transition-all duration-300 cursor-pointer ${activeTab === 'world' ? 'text-brand-dark font-medium' : 'text-brand-dark/40 hover:text-brand-dark/70'}`}
          >
            遇见世界 &middot; 文化人物
            {activeTab === 'world' && (
              <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-gold" />
            )}
          </button>
          
          <button
            id="tab-article-space"
            onClick={() => { setActiveTab('space'); setSelectedReview(null); }}
            className={`relative pb-4 font-serif text-lg tracking-[0.2em] transition-all duration-300 cursor-pointer ${activeTab === 'space' ? 'text-brand-dark font-medium' : 'text-brand-dark/40 hover:text-brand-dark/70'}`}
          >
            空间 &middot; 展评分享
            {activeTab === 'space' && (
              <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-gold" />
            )}
          </button>
        </div>

        {/* ==================== TAB 1: 遇见世界 Column List ==================== */}
        {activeTab === 'world' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {columnIssues.map((issue) => (
              <motion.div
                key={issue.id}
                id={`card-issue-${issue.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                onClick={() => { setSelectedIssue(issue); setSelectedArticleId(null); }}
                className="group flex flex-col bg-brand-cream border border-brand-clay hover:border-brand-gold/40 transition-all duration-500 overflow-hidden shadow-zen cursor-pointer"
              >
                {/* Poster image container with slow zoom on hover */}
                <div className="relative w-full aspect-[16/10] overflow-hidden">
                  <div className="absolute inset-0 bg-brand-dark/15 z-10 pointer-events-none group-hover:bg-brand-dark/5 transition-all duration-500" />
                  <img
                    src={resolveAssetUrl(issue.mainImage)}
                    alt={issue.issueTitle}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-[2s] ease-out scale-100 group-hover:scale-105"
                  />
                  {/* Absolute Badge */}
                  <div className="absolute top-6 left-6 z-20 bg-brand-dark/90 backdrop-blur-md px-4 py-2 border border-brand-gold/20 text-brand-cream text-xs font-mono tracking-widest pointer-events-none">
                    {issue.issueNo}
                  </div>
                  <div className="absolute bottom-6 right-6 z-20 bg-brand-cream/95 backdrop-blur-md px-3 py-1 border border-brand-clay text-brand-dark text-xs font-mono tracking-wider pointer-events-none">
                    {issue.date}
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-8 flex flex-col flex-1 gap-6">
                  <div className="flex flex-col gap-2">
                    <span className="font-mono text-[10px] tracking-widest text-brand-gold uppercase font-light">
                      {issue.title} &middot; Series
                    </span>
                    <h3 className="text-2xl font-light tracking-widest text-brand-dark flex items-center gap-3">
                      {issue.issueNo} &middot; <span className="font-semibold text-brand-gold text-2xl">{issue.issueTitle}</span>
                    </h3>
                    <p className="text-brand-dark/40 font-serif italic text-xs tracking-wider">
                      {issue.subtitle}
                    </p>
                  </div>

                  {/* Summary */}
                  <p className="text-brand-dark/70 text-sm leading-relaxed tracking-wider text-justify font-light min-h-[70px]">
                    {issue.summary}
                  </p>

                  {/* Badges / Tags */}
                  <div className="flex flex-wrap gap-2">
                    {issue.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[10px] tracking-widest font-serif px-2.5 py-1 border border-brand-clay text-brand-dark/50 bg-brand-clay/10">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Dynamic actions bottom panel */}
                  <div className="flex items-center justify-between border-t border-brand-clay/40 pt-6 mt-2">
                    {/* Immersive in-app reading */}
                    <button
                      id={`btn-read-issue-${issue.id}`}
                      onClick={() => { setSelectedIssue(issue); setSelectedArticleId(null); }}
                      className="flex items-center gap-2 font-serif text-xs text-brand-dark hover:text-brand-gold tracking-[0.2em] transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4 text-brand-gold" />
                      阅读文章 &nbsp;Read
                    </button>

                    {/* Official WeChat Link Warning or Redirection */}
                    <a
                      id={`link-wechat-issue-${issue.id}`}
                      href="https://mp.weixin.qq.com" // Placeholder standard path
                      onClick={(e) => e.stopPropagation()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 font-mono text-[10px] text-brand-dark/40 hover:text-brand-dark/80 tracking-widest uppercase transition-colors"
                    >
                      WeChat
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ==================== TAB 2: 空&间 Exhibition Review Poster Wall ==================== */}
        {activeTab === 'space' && (
          <div className="flex flex-col gap-12">
            
            {/* Description intro of the Art Wall */}
            <div className="pb-2">
              <h4 className="text-sm font-semibold tracking-widest uppercase text-brand-gold font-serif flex items-center gap-2">
                <Feather className="w-4 h-4" /> 空间印迹 · 展评分享
              </h4>
            </div>

            {/* Poster slider mimics a physical MUJI-style warm design space gallery wall */}
            <div className="relative bg-[#fcfaf7] pt-12 pb-10 border-t border-b border-[#e8e2d8]/60 shadow-[inset_0_2px_8px_rgba(40,35,30,0.02)] overflow-hidden select-none">
              {/* Floor ambient line shadow mimic */}
              <div className="absolute bottom-0 inset-x-0 h-4 bg-brand-dark/5 blur-sm" />

              {/* Slider wrapper container */}
              <div id="exhibition-slide-container" className="relative group/carousel px-4 md:px-12">
                
                {/* Left Arrow Button */}
                <button
                  onClick={() => handleScroll('left')}
                  className="absolute left-4 md:left-6 top-[40%] -translate-y-1/2 z-30 p-2.5 rounded-full bg-white/95 border border-[#e8e2d8] text-[#8c8273] shadow-sm hover:shadow-md hover:bg-[#faf8f5] hover:text-brand-dark transition-all opacity-100 sm:opacity-0 sm:group-hover/carousel:opacity-100 focus:opacity-100 cursor-pointer"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div
                  ref={scrollContainerRef}
                  className="flex items-stretch gap-12 md:gap-20 overflow-x-auto pb-10 pt-4 px-2 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                  {exhibitionReviews.map((review, idx) => (
                    <div
                      key={review.id}
                      onClick={() => setSelectedReview(review)}
                      className="w-[280px] sm:w-[320px] md:w-[340px] shrink-0 snap-center flex flex-col items-center cursor-pointer"
                    >
                      {/* MUJI Custom Minimalist Fine Art Frame: warm timber-ash tone frame with fine double mat board detail */}
                      <motion.div
                        id={`poster-frame-${review.id}`}
                        whileHover={{ y: -8, scale: 1.01, boxShadow: "0 20px 45px -10px rgba(40,35,30,0.08)" }}
                        transition={{ type: "spring", stiffness: 180, damping: 28 }}
                        onClick={() => setSelectedReview(review)}
                        className="relative w-full aspect-[3/4] bg-[#f9f8f5] p-5 border-[10px] border-[#e8e2d8] shadow-[0_8px_30px_-5px_rgba(40,35,30,0.06)] cursor-pointer group flex flex-col overflow-hidden"
                      >
                        {/* Shadow underneath poster frame */}
                        <div className="absolute inset-0 bg-brand-dark/5 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
                        
                        {/* Inner delicate mat bevel outline */}
                        <div className="absolute inset-[4px] border border-[#d8d1c5]/40 pointer-events-none md:inset-[6px]" />

                        {/* Core image */}
                        <div className="w-full h-full bg-[#fcfbfa] overflow-hidden border border-[#e8e2d8]/50 relative">
                          <img
                            src={resolveAssetUrl(review.posterUrl)}
                            alt={review.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-103 grayscale-[15%] group-hover:grayscale-0 brightness-[99%]"
                          />
                        </div>
                      </motion.div>

                      {/* Visual Plaque beneath the frame - clean, timeless and understated MUJI labeling */}
                      <div className="text-center mt-6 max-w-[260px] select-none">
                        <p className="font-mono text-[9px] text-[#8c8273] tracking-[0.2em] uppercase font-semibold">
                          EXHIBITION &middot; 0{idx + 1}
                        </p>
                        <h4 className="font-serif text-sm tracking-widest font-normal text-brand-dark/90 mt-1 leading-snug">
                          {review.title.split('：')[0]}
                        </h4>
                        <p className="font-serif text-[10px] text-[#a09485] tracking-widest mt-1">
                          {review.artist}
                        </p>

                        <button
                          id={`btn-view-review-${review.id}`}
                          onClick={() => setSelectedReview(review)}
                          className="mt-4 inline-flex items-center gap-1 font-serif text-[10px] tracking-[0.25em] uppercase text-[#8c8273] hover:text-brand-dark transition-colors font-medium border-b border-[#e8e2d8] hover:border-brand-dark/50 pb-1 cursor-pointer"
                        >
                          阅读点评 VIEW &rarr;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Arrow Button */}
                <button
                  onClick={() => handleScroll('right')}
                  className="absolute right-4 md:right-6 top-[40%] -translate-y-1/2 z-30 p-2.5 rounded-full bg-white/95 border border-[#e8e2d8] text-[#8c8273] shadow-sm hover:shadow-md hover:bg-[#faf8f5] hover:text-brand-dark transition-all opacity-100 sm:opacity-0 sm:group-hover/carousel:opacity-100 focus:opacity-100 cursor-pointer"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

              </div>

              {/* Slider hints */}
              <div className="text-center mt-4">
                <span className="font-mono text-[9px] text-[#8c8273]/60 tracking-[0.3em] uppercase font-light">
                  &larr; WORK CAROUSEL. SWIPE / SCROLL TO OBSERVE &rarr;
                </span>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ==================== MODAL 1: Immersive Column Issue Reading ==================== */}
      <AnimatePresence>
        {selectedIssue && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => { setSelectedIssue(null); setSelectedArticleId(null); }}
            className="fixed inset-0 bg-brand-dark/95 z-50 flex items-center justify-center p-4 md:p-8 backdrop-blur-sm overflow-y-auto cursor-pointer"
          >
            {/* Ink wash decorative elements on Modal overlay */}
            <div className="absolute inset-0 opacity-4 bg-cover bg-center mix-blend-color-dodge pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80')` }} />

            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 220, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-brand-cream border border-brand-gold/30 rounded-none shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] cursor-default"
            >
              
              {/* Left Column of Modal: Big Image with specs */}
              <div className="w-full md:w-2/5 relative h-64 md:h-auto bg-brand-ink min-h-[300px]">
                <img
                  src={resolveAssetUrl(selectedIssue.mainImage)}
                  alt={selectedIssue.issueTitle}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover brightness-75 saturation-75"
                />
                
                {/* Overlay details */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/30 to-transparent flex flex-col justify-end p-8 text-brand-cream">
                  <span className="font-mono text-xs text-brand-gold tracking-[0.2em] font-light uppercase">
                    {selectedIssue.title}
                  </span>
                  <h4 className="font-serif text-3xl font-light tracking-[0.1em] mt-1 text-white">
                    {selectedIssue.issueNo} &middot; {selectedIssue.issueTitle}
                  </h4>
                  <p className="font-serif text-[11px] text-brand-cream/60 tracking-wider mt-2 italic border-t border-brand-gold/20 pt-3">
                    {selectedIssue.subtitle}
                  </p>
                </div>
              </div>

              {/* Right Column of Modal: Reading text */}
              <div 
                id="issue-modal-right-col"
                className="w-full md:w-3/5 p-8 md:p-12 overflow-y-auto flex flex-col justify-between gap-8 h-[55vh] md:h-auto max-h-[90vh]"
              >
                
                {selectedArticleId === null ? (
                  /* Standard Mode: Show Issue description + Articles index list */
                  <div className="flex flex-col gap-6 text-brand-dark">
                    <div className="flex items-center justify-between border-b border-brand-clay pb-4">
                      <span className="font-mono text-xs text-brand-gold tracking-widest">{selectedIssue.date}</span>
                      <span className="font-serif text-[10px] text-brand-dark/40 tracking-[0.3em] uppercase">EASTERN BRIGHT MOON ORIGINAL</span>
                    </div>

                    {/* Poetic prose */}
                    <div className="font-serif text-sm md:text-base leading-relaxed tracking-wider text-justify whitespace-pre-line text-brand-dark/90 font-light">
                      {selectedIssue.textContent}
                    </div>

                    {/* Sub-articles directory */}
                    {selectedIssue.articles && selectedIssue.articles.length > 0 && (
                      <div className="mt-8 flex flex-col gap-4">
                        <div className="flex items-center gap-3 border-b border-brand-gold/20 pb-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                          <h4 className="font-serif text-xs tracking-[0.2em] uppercase text-brand-gold font-medium">
                            本期目录 &middot; ARTICLES
                          </h4>
                        </div>
                        
                        <div className="flex flex-col divide-y divide-brand-clay/30">
                          {selectedIssue.articles.map((article, index) => (
                            <div 
                              key={article.id}
                              id={`article-item-${article.id}`}
                              onClick={() => {
                                setSelectedArticleId(article.id);
                                const modalRightCol = document.getElementById("issue-modal-right-col");
                                if (modalRightCol) modalRightCol.scrollTop = 0;
                              }}
                              className="group/item py-4 flex items-start justify-between gap-4 cursor-pointer hover:bg-brand-gold/5 px-2 transition-all duration-300"
                            >
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-[10px] text-brand-gold font-light">{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
                                  <h5 className="font-serif text-sm font-medium tracking-wide text-brand-dark group-hover/item:text-brand-gold transition-colors">
                                    {article.title}
                                  </h5>
                                </div>
                                {article.subtitle && (
                                  <p className="font-serif text-xs text-brand-dark/45 pl-7">
                                    {article.subtitle}
                                  </p>
                                )}
                              </div>
                              <span className="font-serif text-[10px] text-brand-dark/40 group-hover/item:text-brand-gold transition-colors shrink-0 flex items-center gap-1 font-medium">
                                阅读 Read &rarr;
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Reading Mode: Show Sub-article content details */
                  <div className="flex flex-col gap-6 text-brand-dark">
                    <div className="flex items-center justify-between border-b border-brand-clay pb-4">
                      <button 
                        id="btn-return-to-directory"
                        onClick={() => setSelectedArticleId(null)}
                        className="font-serif text-[11px] text-brand-gold hover:text-brand-dark tracking-widest cursor-pointer uppercase transition-colors flex items-center gap-1 font-medium"
                      >
                        &larr; 返回目录 Directory
                      </button>
                      <span className="font-serif text-[10px] text-brand-dark/40 tracking-[0.3em] uppercase">ARTICLE DETAIL</span>
                    </div>

                    {/* Active sub-article readable detail */}
                    {(() => {
                      const currentArticle = selectedIssue.articles?.find(art => art.id === selectedArticleId);
                      if (!currentArticle) return null;
                      return (
                        <div className="flex flex-col gap-6">
                          <div className="flex flex-col gap-2">
                            <span className="font-mono text-[10px] text-brand-gold tracking-widest">{currentArticle.date || selectedIssue.date}</span>
                            <h4 className="font-serif text-xl md:text-2xl font-light text-brand-dark tracking-wide leading-snug">
                              {currentArticle.title}
                            </h4>
                            {currentArticle.subtitle && (
                              <p className="font-serif italic text-xs md:text-sm text-brand-dark/45 leading-relaxed">
                                {currentArticle.subtitle}
                              </p>
                            )}
                          </div>

                          <div className="w-12 h-[1px] bg-brand-gold/30 mt-2 mb-4" />

                          {/* Article Text Content */}
                          <div className="font-serif text-sm md:text-base leading-relaxed tracking-wider text-justify whitespace-pre-line text-brand-dark/90 font-light">
                            {currentArticle.content}
                          </div>
                          
                          <div className="flex justify-between items-center mt-12 pt-6 border-t border-brand-clay/40">
                            <button 
                              id="btn-bottom-return-dir"
                              onClick={() => {
                                setSelectedArticleId(null);
                                const modalRightCol = document.getElementById("issue-modal-right-col");
                                if (modalRightCol) modalRightCol.scrollTop = 0;
                              }}
                              className="font-serif text-xs text-brand-gold hover:text-brand-dark tracking-widest transition-colors cursor-pointer font-medium uppercase"
                            >
                              &larr; 返回本期目录 Directory
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Footer buttons of modal */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-brand-clay">
                  <div className="flex flex-wrap gap-1.5">
                    {selectedIssue.tags.map((tag, tagI) => (
                      <span key={tagI} className="text-[9px] font-mono tracking-widest bg-brand-clay/35 px-2 py-0.5 text-brand-dark/60">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-6">
                    <button
                      id="btn-close-issue-modal"
                      onClick={() => setSelectedIssue(null)}
                      className="font-serif text-xs text-brand-dark/40 hover:text-brand-dark tracking-widest cursor-pointer uppercase py-1 border-b border-transparent hover:border-brand-dark/40 transition-all font-medium"
                    >
                      返回 Close
                    </button>
                    
                    <a
                      id="btn-link-wechat-direct"
                      href={selectedIssue.wechatLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-brand-dark text-brand-cream px-5 py-2 hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 border border-brand-gold/30 font-medium font-serif text-xs tracking-widest flex items-center gap-2"
                    >
                      公众号阅读 &nbsp;<ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== MODAL 2: Reading Exhibition Reviews ==================== */}
      <AnimatePresence>
        {selectedReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setSelectedReview(null)}
            className="fixed inset-0 bg-brand-dark/95 z-50 flex items-center justify-center p-4 md:p-8 backdrop-blur-sm overflow-y-auto cursor-pointer"
          >
            <motion.div
              initial={{ opacity: 0, y: 55, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 220, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-brand-cream border border-brand-gold/40 rounded-none shadow-2xl p-8 md:p-12 flex flex-col gap-8 text-brand-dark cursor-default"
            >
              
              {/* Top border line & header decorations */}
              <div className="flex items-center justify-between border-b border-brand-clay pb-4">
                <span className="font-mono text-xs text-brand-gold tracking-widest">{selectedReview.date}</span>
                <span className="font-serif text-xs text-brand-dark/40 tracking-widest uppercase">空间记录 &middot; 点评印迹</span>
              </div>

              {/* Main review content block */}
              <div className="flex flex-col gap-4">
                <h3 className="font-serif text-2xl md:text-3xl font-light text-brand-dark tracking-wide leading-tight">
                  {selectedReview.title}
                </h3>
                <p className="font-serif italic text-xs md:text-sm text-brand-dark/40 tracking-wider">
                  {selectedReview.subtitle}
                </p>

                {/* Meta details */}
                <div className="grid grid-cols-2 gap-4 bg-brand-clay/20 p-4 border border-brand-clay/50 mt-4 text-xs font-serif leading-relaxed font-light">
                  <div className="flex flex-col gap-1">
                    <span className="text-brand-dark/40 uppercase font-mono text-[9px] tracking-widest">艺术家 Artist</span>
                    <span className="text-brand-dark/85 font-medium">{selectedReview.artist}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-brand-dark/40 uppercase font-mono text-[9px] tracking-widest">艺术展厅 Gallery</span>
                    <span className="text-brand-dark/85 font-medium flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-gold inline" /> {selectedReview.galleryName}
                    </span>
                  </div>
                </div>

                {/* Review poetic textual analysis */}
                <div className="mt-6 text-sm md:text-base leading-relaxed text-brand-dark/90 tracking-wider text-justify font-light indent-8">
                  {selectedReview.reviewText}
                </div>
              </div>

              {/* Stars rating visual */}
              <div className="flex items-center gap-2 border-t border-brand-clay/40 pt-6">
                <span className="text-brand-dark/40 font-mono text-[9px] tracking-widest uppercase mr-2">推荐指数 Score:</span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Sparkles 
                      key={i} 
                      className={`w-3.5 h-3.5 ${i < Math.floor(selectedReview.rating) ? 'text-brand-gold fill-brand-gold/20' : 'text-brand-clay'}`} 
                    />
                  ))}
                </div>
                <span className="font-mono text-xs text-brand-dark font-medium ml-1">
                  {selectedReview.rating.toFixed(1)} / 5.0
                </span>
              </div>

              {/* Close & Action strip */}
              <div className="flex justify-end mt-4">
                <button
                  id="btn-close-review-modal"
                  onClick={() => setSelectedReview(null)}
                  className="bg-brand-dark text-brand-cream border border-brand-gold/20 hover:bg-brand-gold hover:text-brand-dark transition-all duration-500 rounded-none px-8 py-2.5 font-serif text-xs tracking-widest cursor-pointer text-center font-medium"
                >
                  关闭观览 Close Window
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};
