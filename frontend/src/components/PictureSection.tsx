/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../services/api';
import { PhotoItem } from '../types';
import { MapPin, Calendar, Heart, ZoomIn, Sparkles, X, Globe, Play, Pause } from 'lucide-react';
import { ChinaConstellationMap } from './ChinaConstellationMap';
import { Modal } from 'antd';

interface FootprintItem {
  id: string;
  city: string;
  cityEn: string;
  country: string;
  location: string;
  date: string;
  imageUrl: string;
  description: string;
  region: string;
  x: number; // 经度 -> 复位为平面百分比 X
  y: number; // 纬度 -> 复位为平面百分比 Y
}

export const PictureSection: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'gallery' | 'map'>('gallery');
  const [activeFilter, setActiveFilter] = useState<string>('全部');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Record<string, boolean>>({});

  const [photoItems, setPhotoItems] = useState<PhotoItem[]>([]);
  const [footprintItems, setFootprintItems] = useState<FootprintItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Trace map states
  const [selectedFootprint, setSelectedFootprint] = useState<FootprintItem | null>(null);
  const [mapRegionFilter, setMapRegionFilter] = useState<string>('全部');
  const [isPlayingTour, setIsPlayingTour] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    Promise.all([api.getPhotos(), api.getFootprints()])
      .then(([photosData, footprintsData]) => {
        const mappedPhotos: PhotoItem[] = photosData.map((p: any) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          location: p.location,
          date: p.date,
          imageUrl: p.image_url,
          description: p.description
        }));

        const mappedFootprints: FootprintItem[] = footprintsData.map((fp: any) => ({
          id: fp.id,
          city: fp.city,
          cityEn: fp.city_en,
          country: fp.country,
          location: fp.location,
          date: fp.date,
          imageUrl: fp.image_url,
          description: fp.description,
          region: fp.region,
          x: fp.x, // 将数据库里的 x 复位为平面百分比 X
          y: fp.y  // 将数据库里的 y 复位为平面百分比 Y
        }));

        setPhotoItems(mappedPhotos);
        setFootprintItems(mappedFootprints);
        if (mappedFootprints.length > 0) {
          setSelectedFootprint(mappedFootprints[0]);
        }
      })
      .catch(err => console.error('获取摄影与足迹数据失败：', err))
      .finally(() => setLoading(false));
  }, []);

  // Get unique categories for filtering
  const categories = ['全部', ...Array.from(new Set(photoItems.map(item => item.category)))];

  // Filter photos
  const filteredPhotos = activeFilter === '全部' 
    ? photoItems 
    : photoItems.filter(item => item.category === activeFilter);

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikedPhotos(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Autoplay slideshow tour
  useEffect(() => {
    let intervalId: any = null;
    if (isPlayingTour && selectedFootprint) {
      intervalId = setInterval(() => {
        setSelectedFootprint((current) => {
          if (!current) return null;
          const filteredItems = mapRegionFilter === '全部'
            ? footprintItems
            : footprintItems.filter(f => f.region === mapRegionFilter || f.country === mapRegionFilter);
          
          if (!filteredItems.length) return current;
          
          const currentIndex = filteredItems.findIndex(f => f.id === current.id);
          const nextIndex = currentIndex === -1 || currentIndex === filteredItems.length - 1 ? 0 : currentIndex + 1;
          const nextFp = filteredItems[nextIndex];
          setIsDetailModalOpen(true);
          return nextFp;
        });
      }, 5000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlayingTour, mapRegionFilter, selectedFootprint, footprintItems]);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center font-serif text-brand-dark/60 tracking-widest text-sm pt-32">
        <span>光影显影中...</span>
      </div>
    );
  }

  return (
    <section className="relative w-full min-h-screen bg-transparent text-brand-dark pt-32 pb-24 font-serif">
      {/* Decorative wash textures */}
      <div className="absolute top-10 left-10 w-64 h-64 opacity-5 bg-gradient-to-tr from-brand-gold to-transparent rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header: Fine Art Gallery Catalog Style */}
        <div className="flex flex-col gap-2 mb-16">
          <h2 className="text-3xl md:text-5xl font-light tracking-[0.2em] text-[#2c2722] leading-none">
            光影
          </h2>
          <span className="font-sans font-light text-xs tracking-[0.25em] text-[#8c8273]/80 uppercase">
            Gallery
          </span>
        </div>

        {/* Modern MUJI tabs to toggle between Gallery & Map Modes */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white/80 border border-[#e8e2d8] p-1 shadow-sm rounded-none">
            <button
              onClick={() => setActiveMode('gallery')}
              className={`px-6 py-2 text-xs tracking-[0.25em] transition-all cursor-pointer font-medium ${
                activeMode === 'gallery'
                  ? 'bg-brand-dark text-white font-semibold'
                  : 'text-[#8c8273] hover:text-brand-dark'
              }`}
            >
              镜头画廊 GALLERY
            </button>
            <button
              onClick={() => {
                setActiveMode('map');
                setIsPlayingTour(false);
              }}
              className={`px-6 py-2 text-xs tracking-[0.25em] transition-all cursor-pointer font-medium flex items-center gap-2 ${
                activeMode === 'map'
                  ? 'bg-brand-dark text-white font-semibold'
                  : 'text-[#8c8273] hover:text-brand-dark'
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> 寰宇足迹 TRACE MAP
            </button>
          </div>
        </div>

        {activeMode === 'gallery' ? (
          <>
            {/* Filter Buttons Section */}
            <div className="flex flex-wrap items-center gap-3 md:gap-4 justify-start border-b border-brand-clay pb-8 mb-12">
              <span className="font-mono text-[10px] tracking-widest text-[#8c8273] uppercase mr-2 font-medium">
                筛选 Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  id={`filter-btn-${cat}`}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-5 py-2 text-xs font-serif tracking-widest border transition-all duration-500 rounded-none cursor-pointer ${activeFilter === cat ? 'bg-brand-dark text-brand-cream border-brand-dark font-medium' : 'bg-transparent text-brand-dark/50 border-brand-clay hover:border-brand-dark hover:text-brand-dark'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Photography Grid Layout - Masonry / Grid */}
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredPhotos.map((photo) => {
                  const isLiked = !!likedPhotos[photo.id];
                  return (
                    <motion.div
                      key={photo.id}
                      id={`photo-card-${photo.id}`}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.6 }}
                      onClick={() => setSelectedPhoto(photo)}
                      className="group relative bg-brand-cream border border-brand-clay hover:border-brand-gold/40 transition-all duration-500 shadow-zen cursor-pointer overflow-hidden p-3 flex flex-col"
                    >
                      {/* Photo Window */}
                      <div className="relative w-full aspect-[4/3] bg-brand-dark overflow-hidden border border-brand-clay/35">
                        
                        {/* Hover subtle dark glaze & zoom icon */}
                        <div className="absolute inset-0 bg-brand-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-none bg-brand-cream/95 backdrop-blur-sm border border-brand-gold/30 flex items-center justify-center shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                            <ZoomIn className="w-5 h-5 text-brand-gold" />
                          </div>
                        </div>

                        <img 
                          src={photo.imageUrl} 
                          alt={photo.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-all duration-1000 grayscale-[25%] group-hover:grayscale-0 group-hover:scale-105"
                        />

                        {/* Tag badge */}
                        <span className="absolute top-4 left-4 z-20 bg-brand-dark/90 backdrop-blur-md px-3 py-1 border border-brand-gold/20 text-brand-cream text-[10px] font-serif tracking-widest pointer-events-none">
                          {photo.category}
                        </span>
                      </div>

                      {/* Descriptions block (Aesthetic frame label under photograph) */}
                      <div className="pt-4 pb-2 flex flex-col justify-between flex-1 gap-4">
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col gap-1">
                            <h3 className="font-serif text-base tracking-widest text-brand-dark group-hover:text-brand-gold transition-colors font-medium">
                              {photo.title}
                            </h3>
                            <p className="font-sans text-[10px] text-brand-dark/40 tracking-wider flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-brand-gold" /> {photo.location}
                            </p>
                          </div>

                          {/* Spark heart counts (Slight interactive element) */}
                          <button
                            id={`btn-like-${photo.id}`}
                            onClick={(e) => toggleLike(e, photo.id)}
                            className="p-2 -mr-2 text-brand-dark/40 hover:text-red-500 transition-colors cursor-pointer"
                            title="Like Photography"
                          >
                            <Heart className={`w-4 h-4 ${isLiked ? 'text-red-500 fill-red-500' : ''}`} />
                          </button>
                        </div>

                        {/* Short excerpt snippet */}
                        <p className="font-serif text-xs leading-relaxed text-brand-dark/60 tracking-wider font-light line-clamp-2">
                          {photo.description}
                        </p>

                        {/* Bottom strip */}
                        <div className="flex items-center justify-between border-t border-brand-clay/40 pt-3 text-[9px] font-mono font-light text-brand-dark/40">
                          <span>{photo.date}</span>
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 tracking-widest uppercase">
                            阅读感悟 View Details &rarr;
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </>
        ) : (
          <div className="flex flex-col gap-8">
            
            {/* Map Filter Sub-tabs */}
            <div className="flex flex-wrap items-center gap-2 justify-center mb-4">
              {['全部', '日本', '大湾区', '华东', '华北', '华中', '西北'].map((region) => {
                const count = region === '全部'
                  ? footprintItems.length
                  : footprintItems.filter(f => f.region === region || f.country === region).length;
                return (
                  <button
                    key={region}
                    onClick={() => {
                      setMapRegionFilter(region);
                      const matched = region === '全部'
                        ? footprintItems
                        : footprintItems.filter(f => f.region === region || f.country === region);
                      if (matched.length > 0) {
                        setSelectedFootprint(matched[0]);
                      }
                    }}
                    className={`px-4 py-1.5 text-xs text-center font-serif tracking-widest border transition-all duration-300 rounded-none cursor-pointer ${
                      mapRegionFilter === region
                        ? 'bg-brand-dark text-white border-brand-dark font-medium'
                        : 'bg-white text-[#8c8273] border-[#e8e2d8] hover:border-[#8c8273] hover:text-brand-dark'
                    }`}
                  >
                    {region} ({count})
                  </button>
                );
              })}
            </div>

            {/* Centered map panel with visual elements */}
            <div className="w-full max-w-4xl mx-auto bg-[#fcfbf9]/60 border border-[#e8e2d8] p-5 flex flex-col relative shadow-[0_6px_30px_rgba(40,35,30,0.03)] rounded-none">
              
              {/* Visual accessories inside container */}
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#e8e2d8] text-[#8c8273]">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-brand-dark/60" />
                  <span className="font-mono text-[10px] tracking-[0.25em] uppercase font-semibold text-brand-dark/80">
                    平面古舆图与星图 NAVIGATION CHART
                  </span>
                </div>
                
                {/* Slideshow controller button */}
                <button
                  onClick={() => setIsPlayingTour(!isPlayingTour)}
                  className={`flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono tracking-widest border transition-all cursor-pointer ${
                    isPlayingTour
                      ? 'bg-[#8c8273]/10 text-brand-dark border-[#8c8273] font-medium'
                      : 'bg-white hover:bg-[#faf8f5] text-[#8c8273] border-[#e8e2d8]'
                  }`}
                >
                  {isPlayingTour ? <Pause className="w-2.5 h-2.5 text-[#8c8273] animate-pulse" /> : <Play className="w-2.5 h-2.5" />}
                  {isPlayingTour ? '自动慢游中 OFF' : '自动慢游 ON'}
                </button>
              </div>

              {/* Map responsive container */}
              <div className="w-full">
                <ChinaConstellationMap>
                  {footprintItems
                    .filter((fp) => mapRegionFilter === '全部' || fp.region === mapRegionFilter || fp.country === mapRegionFilter)
                    .map((fp) => {
                      const isSelected = selectedFootprint?.id === fp.id;
                      
                      return (
                        <div
                          key={fp.id}
                          style={{
                            position: 'absolute',
                            left: `${fp.x}%`,
                            top: `${fp.y}%`,
                            transform: 'translate(-50%, -50%)',
                            zIndex: isSelected ? 30 : 20,
                          }}
                          className="group/marker"
                        >
                          {/* Clickable button anchor point */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFootprint(fp);
                              setIsDetailModalOpen(true);
                            }}
                            className="relative flex items-center justify-center w-6 h-6 focus:outline-none cursor-pointer"
                          >
                            {/* Pulsing ripple wave */}
                            <span className={`absolute inline-flex w-5 h-5 rounded-full bg-brand-gold/40 opacity-75 ${isSelected ? 'animate-ping scale-150' : 'group-hover/marker:animate-ping'}`} />
                            
                            {/* Inner glowing gold core */}
                            <span className={`relative inline-flex rounded-full w-2.5 h-2.5 shadow-[0_0_8px_#C5A880] transition-transform duration-300 ${isSelected ? 'bg-white scale-125' : 'bg-brand-gold'}`} />
                          </button>

                          {/* Micro-label for city name */}
                          <div className={`absolute left-1/2 -bottom-6 -translate-x-1/2 px-2 py-0.5 bg-brand-dark/90 text-brand-cream border text-[10px] font-sans rounded-sm shadow-md pointer-events-none transition-all duration-300 ${isSelected ? 'opacity-100 scale-100 border-brand-gold/60' : 'opacity-0 scale-90 group-hover/marker:opacity-100 group-hover/marker:scale-100 border-brand-gold/20'}`}>
                            <span className="whitespace-nowrap">{fp.city}</span>
                          </div>
                        </div>
                      );
                    })}
                </ChinaConstellationMap>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* ==================== CENTERING PARCHMENT MULTIMEDIA DETAIL MODAL ==================== */}
      <Modal
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={null}
        width={640}
        destroyOnHidden
        className="font-serif custom-parchment-modal text-[#2c2722]"
        styles={{
          content: {
            padding: 0,
            backgroundColor: '#fdfbf7',
            borderRadius: '2px',
            border: '1px solid #ebdcb9',
            boxShadow: '0 20px 50px rgba(40, 35, 30, 0.15)',
            overflow: 'hidden'
          }
        }}
        closeIcon={null}
      >
        {selectedFootprint && (
          <div className="relative p-6 text-[#2c2722] font-songti">
            {/* Dual inner golden borders for classical touch */}
            <div className="absolute inset-[8px] border border-brand-gold/20 pointer-events-none z-10" />
            <div className="absolute inset-[12px] border border-brand-gold/40 pointer-events-none z-10" />

            {/* Custom Close Button */}
            <button
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute top-4 right-4 z-40 p-2 text-[#8c8273]/60 hover:text-brand-gold transition-all duration-300 cursor-pointer"
              title="关闭 Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative z-20 flex flex-col gap-5 pt-4">
              {/* High-fidelity travel photo */}
              <div 
                onClick={() => {
                  const footprintAsPhoto: PhotoItem = {
                    id: selectedFootprint.id,
                    title: `${selectedFootprint.country} · ${selectedFootprint.city}`,
                    category: "寰宇足迹",
                    location: selectedFootprint.location,
                    date: selectedFootprint.date,
                    imageUrl: selectedFootprint.imageUrl,
                    description: selectedFootprint.description
                  };
                  setSelectedPhoto(footprintAsPhoto);
                  setIsDetailModalOpen(false);
                }}
                className="relative w-full aspect-[4/3] overflow-hidden bg-brand-dark cursor-pointer group shadow-[0_4px_20px_rgba(40,35,30,0.08)] border border-brand-gold/30 p-1"
              >
                <div className="absolute inset-0 border border-brand-gold/40 pointer-events-none z-10" />
                <div className="absolute inset-0 bg-brand-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex items-center justify-center">
                  <div className="w-10 h-10 bg-white/95 border border-brand-gold/30 flex items-center justify-center shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-all duration-500">
                    <ZoomIn className="w-5 h-5 text-brand-gold" />
                  </div>
                </div>
                <img
                  src={selectedFootprint.imageUrl}
                  alt={selectedFootprint.city}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-all duration-1000 grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105"
                />
              </div>

              {/* Typography: Large titles */}
              <div className="flex flex-col gap-1 px-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 text-[10px] font-mono tracking-[0.2em] font-semibold text-white bg-brand-gold select-none">
                    {selectedFootprint.region}
                  </span>
                  <span className="font-mono text-xs text-[#a09485] tracking-wider flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-gold" /> {selectedFootprint.date}
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-normal text-[#2c2722] tracking-[0.15em] leading-tight mt-1">
                  {selectedFootprint.city}
                  <span className="font-mono text-xs font-light text-[#8c8273] tracking-widest block mt-0.5 uppercase">
                    {selectedFootprint.cityEn} &middot; {selectedFootprint.country}
                  </span>
                </h3>

                <div className="flex items-center gap-1.5 text-[#8c8273] mt-2">
                  <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                  <span className="text-xs tracking-widest">{selectedFootprint.location}</span>
                </div>
              </div>

              {/* Blockquote with warm gold styling and large elegant Songti */}
              <blockquote className="bg-[#faf5ee] border-l-4 border-brand-gold p-5 font-songti text-base md:text-lg leading-relaxed text-[#2c2722]/90 shadow-[0_2px_12px_rgba(40,35,30,0.02)] text-justify tracking-wide whitespace-pre-line rounded-none">
                「 {selectedFootprint.description} 」
              </blockquote>
            </div>
          </div>
        )}
      </Modal>

      {/* ==================== PHOTO LIGHTBOX / IMMERSIVE POEM VIEW ==================== */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 bg-brand-dark/95 z-50 flex items-center justify-center p-4 md:p-8 backdrop-blur-sm overflow-y-auto cursor-pointer"
          >
            {/* Dark abstract overlay */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 220, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl bg-brand-cream border border-brand-gold/30 rounded-none shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] cursor-default"
            >
              
              {/* Close Button top-right absolute */}
              <button
                id="btn-close-photo-modal-x"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 z-40 p-3 bg-brand-dark/90 text-brand-cream hover:bg-brand-gold hover:text-brand-dark border border-brand-gold/20 transition-all rounded-none cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Photo Area (Takes 3/5 width) */}
              <div className="w-full md:w-3/5 relative bg-black flex items-center justify-center h-80 md:h-auto min-h-[400px]">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover max-h-[85vh]"
                />
                
                {/* Floating tags */}
                <div className="absolute bottom-6 left-6 z-20 bg-brand-dark/85 backdrop-blur-md px-4 py-2 border border-brand-gold/20 text-brand-cream text-xs font-mono tracking-widest font-light pointer-events-none">
                  LOC: {selectedPhoto.location}
                </div>
              </div>

              {/* Prose Poem Reading Area (Takes 2/5 width) */}
              <div className="w-full md:w-2/5 p-8 md:p-10 overflow-y-auto flex flex-col justify-between gap-8 h-[45vh] md:h-auto max-h-[90vh]">
                
                {/* Poetry Details */}
                <div className="flex flex-col gap-6 text-brand-dark">
                  <div className="flex items-center justify-between border-b border-brand-clay pb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-brand-gold" />
                      <span className="font-mono text-[10px] text-brand-gold tracking-[0.2em] uppercase font-light">
                        {selectedPhoto.category} &middot; Series
                      </span>
                    </div>
                    <span className="font-mono text-xs text-brand-dark/40 font-light">{selectedPhoto.date}</span>
                  </div>

                  <h3 className="font-serif text-2xl font-light text-brand-dark tracking-widest mt-2 border-l-2 border-brand-gold pl-4">
                    {selectedPhoto.title}
                  </h3>

                  {/* Main poetic analysis text box */}
                  <div className="font-serif text-sm md:text-base leading-relaxed tracking-wider text-justify text-brand-dark/80 whitespace-pre-line font-light py-4 italic text-justify-vertical bg-gradient-to-b from-brand-clay/10 to-brand-clay/35 p-6 border-l-4 border-brand-clay border-dashed">
                    「 {selectedPhoto.description} 」
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-end border-t border-brand-clay pt-6">
                  <button
                    id="btn-close-photo-modal"
                    onClick={() => setSelectedPhoto(null)}
                    className="font-serif text-xs text-brand-dark border-b border-brand-dark hover:text-brand-gold hover:border-brand-gold pb-0.5 tracking-widest transition-colors cursor-pointer font-medium"
                  >
                    返回观赏 Close
                  </button>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};
