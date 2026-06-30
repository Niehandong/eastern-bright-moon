import React, { useRef } from 'react';

interface ChinaConstellationMapProps {
  onMapClick?: (x: number, y: number) => void;
  children?: React.ReactNode;
}

export const ChinaConstellationMap: React.FC<ChinaConstellationMapProps> = ({
  onMapClick,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onMapClick) return;
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const pctX = Number(((clickX / rect.width) * 100).toFixed(1));
    const pctY = Number(((clickY / rect.height) * 100).toFixed(1));

    // Bound values to range [0.0, 100.0]
    const boundedX = Math.max(0.0, Math.min(100.0, pctX));
    const boundedY = Math.max(0.0, Math.min(100.0, pctY));

    onMapClick(boundedX, boundedY);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[1000/650] border border-[#ebdcb9]/60 bg-[#fffdf6] cursor-crosshair select-none overflow-hidden shadow-inner rounded-sm"
      style={{ backgroundColor: '#fffdf6' }}
      onClick={handleMapClick}
    >
      {/* Classical Celestial/Grid Guidelines */}
      <svg viewBox="0 0 1000 650" className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
        <defs>
          <filter id="map-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#d4b572" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Latitude and Longitude Grid Lines */}
        <line x1="50" y1="150" x2="950" y2="150" stroke="#ebdcb9" strokeWidth="1" strokeDasharray="3 4" />
        <line x1="50" y1="325" x2="950" y2="325" stroke="#ebdcb9" strokeWidth="1" strokeDasharray="3 4" />
        <line x1="50" y1="500" x2="950" y2="500" stroke="#ebdcb9" strokeWidth="1" strokeDasharray="3 4" />
        <line x1="220" y1="50" x2="220" y2="600" stroke="#ebdcb9" strokeWidth="1" strokeDasharray="3 4" />
        <line x1="490" y1="50" x2="490" y2="600" stroke="#ebdcb9" strokeWidth="1" strokeDasharray="3 4" />
        <line x1="750" y1="50" x2="750" y2="600" stroke="#ebdcb9" strokeWidth="1" strokeDasharray="3 4" />

        {/* Authentic, Highly Recognizable Stylized China Mainland Outline (The Majestic Rooster Shape) */}
        <path
          d="M 720,240
             C 745,260 760,290 750,310
             C 740,330 710,345 720,380
             C 730,415 710,440 690,460
             C 670,480 645,495 620,510
             C 595,525 570,535 540,530
             C 510,525 480,500 450,515
             C 420,530 390,540 370,525
             C 350,510 340,485 315,475
             C 290,465 255,480 235,470
             C 215,460 210,435 190,415
             C 170,395 145,405 125,385
             C 105,365 80,355 85,335
             C 90,315 120,305 125,285
             C 130,265 110,235 120,215
             C 130,195 160,205 180,195
             C 200,185 220,155 250,175
             C 280,195 300,225 330,235
             C 360,245 390,215 420,235
             C 450,255 470,285 500,275
             C 530,265 550,225 580,235
             C 610,245 630,265 660,235
             C 690,205 750,145 820,135
             C 860,125 910,130 890,170
             C 870,210 830,225 850,255
             C 870,285 830,315 800,315
             C 770,315 750,295 730,315
             C 710,335 725,225 720,240 Z"
          fill="rgba(247, 243, 235, 0.95)"
          stroke="#d4b572"
          strokeWidth="1.8"
          filter="url(#map-shadow)"
        />

        {/* Taiwan Island */}
        <ellipse
          cx="780"
          cy="510"
          rx="10"
          ry="22"
          fill="rgba(247, 243, 235, 0.95)"
          stroke="#d4b572"
          strokeWidth="1.2"
          transform="rotate(-20 780 510)"
          filter="url(#map-shadow)"
        />
        {/* Taiwan Island Gold Star Marker & Text Label */}
        <circle cx="780" cy="510" r="3" fill="#d4b572" />
        <circle cx="780" cy="510" r="7" stroke="#d4b572" strokeWidth="0.8" fill="none" className="opacity-40 animate-pulse" />
        <text
          x="780"
          y="545"
          textAnchor="middle"
          className="font-serif text-[10px] font-bold fill-[#8c8273] select-none tracking-wider"
        >
          台湾岛
        </text>

        {/* Hong Kong Special Administrative Region Marker & Text Label */}
        <circle cx="615" cy="512" r="2.5" fill="#d4b572" />
        <circle cx="615" cy="512" r="5" stroke="#d4b572" strokeWidth="0.8" fill="none" className="opacity-40 animate-pulse" />
        <text
          x="615"
          y="528"
          textAnchor="middle"
          className="font-serif text-[9px] font-bold fill-[#8c8273] select-none tracking-wider"
        >
          香港
        </text>

        {/* Hainan Island */}
        <ellipse
          cx="525"
          cy="600"
          rx="16"
          ry="11"
          fill="rgba(247, 243, 235, 0.95)"
          stroke="#d4b572"
          strokeWidth="1.2"
          transform="rotate(-10 525 600)"
          filter="url(#map-shadow)"
        />
        {/* Hainan Island Gold Star Marker & Text Label */}
        <circle cx="525" cy="600" r="3" fill="#d4b572" />
        <circle cx="525" cy="600" r="7" stroke="#d4b572" strokeWidth="0.8" fill="none" className="opacity-40 animate-pulse" />
        <text
          x="525"
          y="628"
          textAnchor="middle"
          className="font-serif text-[10px] font-bold fill-[#8c8273] select-none tracking-wider"
        >
          海南岛
        </text>

        {/* South China Sea Islands Box & Boundary Lines */}
        <rect
          x="780"
          y="470"
          width="160"
          height="150"
          fill="rgba(247, 243, 235, 0.4)"
          stroke="#ebdcb9"
          strokeWidth="1"
          strokeDasharray="3 3"
          rx="4"
        />
        <text
          x="860"
          y="498"
          textAnchor="middle"
          className="font-serif text-xs font-bold fill-[#8c8273]/90 tracking-[0.2em] select-none"
        >
          南海诸岛
        </text>

        {/* Nine-dash lines */}
        <path d="M 810,515 L 811,525" stroke="#d4b572" strokeWidth="1.5" />
        <path d="M 805,540 L 808,550" stroke="#d4b572" strokeWidth="1.5" />
        <path d="M 815,565 L 823,573" stroke="#d4b572" strokeWidth="1.5" />
        <path d="M 835,585 L 845,590" stroke="#d4b572" strokeWidth="1.5" />
        <path d="M 865,595 L 878,595" stroke="#d4b572" strokeWidth="1.5" />
        <path d="M 900,590 L 910,582" stroke="#d4b572" strokeWidth="1.5" />
        <path d="M 922,568 L 925,555" stroke="#d4b572" strokeWidth="1.5" />
        <path d="M 927,540 L 925,528" stroke="#d4b572" strokeWidth="1.5" />
        <path d="M 918,512 L 912,502" stroke="#d4b572" strokeWidth="1.5" />

        {/* Island/reef small star points */}
        <circle cx="840" cy="525" r="1.5" fill="#d4b572" />
        <circle cx="850" cy="540" r="1.2" fill="#d4b572" />
        <circle cx="880" cy="530" r="1.5" fill="#d4b572" />
        <circle cx="865" cy="555" r="1" fill="#d4b572" />
        <circle cx="855" cy="570" r="1.5" fill="#d4b572" />
        <circle cx="890" cy="575" r="1.2" fill="#d4b572" />
        <circle cx="875" cy="585" r="1" fill="#d4b572" />

        {/* High-end Retro Compass Rose Wind Vane */}
        <g transform="translate(860, 110)" className="opacity-80">
          <circle cx="0" cy="0" r="32" stroke="#d4b572" strokeWidth="1" strokeDasharray="4 2" fill="none" />
          <circle cx="0" cy="0" r="28" stroke="#ebdcb9" strokeWidth="0.8" fill="none" />
          
          <line x1="0" y1="-32" x2="0" y2="32" stroke="#ebdcb9" strokeWidth="0.8" />
          <line x1="-32" y1="0" x2="32" y2="0" stroke="#ebdcb9" strokeWidth="0.8" />
          
          <line x1="-22.6" y1="-22.6" x2="22.6" y2="22.6" stroke="#ebdcb9" strokeWidth="0.5" strokeDasharray="1 2" />
          <line x1="22.6" y1="-22.6" x2="-22.6" y2="22.6" stroke="#ebdcb9" strokeWidth="0.5" strokeDasharray="1 2" />

          {/* Compass Points / Needles */}
          <polygon points="0,-36 6,-6 0,0" fill="#d4b572" stroke="#cfa358" strokeWidth="0.5" />
          <polygon points="0,-36 -6,-6 0,0" fill="#ebdcb9" stroke="#cfa358" strokeWidth="0.5" />
          
          <polygon points="0,30 -4,5 0,0" fill="#ebdcb9" stroke="#ebdcb9" strokeWidth="0.5" />
          <polygon points="0,30 4,5 0,0" fill="#d4b572" stroke="#ebdcb9" strokeWidth="0.5" />
          
          <polygon points="30,0 5,-4 0,0" fill="#d4b572" stroke="#ebdcb9" strokeWidth="0.5" />
          <polygon points="30,0 5,4 0,0" fill="#ebdcb9" stroke="#ebdcb9" strokeWidth="0.5" />
          
          <polygon points="-30,0 -5,4 0,0" fill="#d4b572" stroke="#ebdcb9" strokeWidth="0.5" />
          <polygon points="-30,0 -5,-4 0,0" fill="#ebdcb9" stroke="#ebdcb9" strokeWidth="0.5" />

          {/* Decorative center brass cap */}
          <circle cx="0" cy="0" r="4" fill="#cfa358" stroke="#ebdcb9" strokeWidth="1" />
          <circle cx="0" cy="0" r="1.5" fill="#fcfbf9" />

          {/* Elegant Labels */}
          <text x="0" y="-40" textAnchor="middle" className="font-serif text-[11px] font-bold fill-[#8c8273] select-none">N</text>
          <text x="0" y="40" textAnchor="middle" className="font-serif text-[8px] fill-[#8c8273] select-none">S</text>
          <text x="40" y="3" textAnchor="middle" className="font-serif text-[8px] fill-[#8c8273] select-none">E</text>
          <text x="-40" y="3" textAnchor="middle" className="font-serif text-[8px] fill-[#8c8273] select-none">W</text>
        </g>
      </svg>
      {children}
    </div>
  );
};

export default ChinaConstellationMap;
