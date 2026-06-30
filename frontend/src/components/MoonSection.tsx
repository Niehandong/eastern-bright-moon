import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import mistyMoon from '../assets/images/misty_ink_moon_1780370719058.png';
import shuoMoon from '../assets/images/issue_shuo_moon_1780370736805.png';
import qingMoon from '../assets/images/issue_qing_azure_1780370749984.png';
import { api } from '../services/api';
import { 
  Sparkles, 
  Moon, 
  Sun, 
  CheckCircle2, 
  RotateCcw, 
  Send, 
  Info, 
  FileText, 
  Plus, 
  Calendar,
  Compass,
  Activity,
  Heart,
  BookOpen,
  ArrowRight,
  ClipboardCheck,
  Waves,
  Bookmark,
  Trash2,
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';

interface MoonPhaseData {
  id: string;
  name: string;
  keywords: string;
  suitable: string;
  tip: string;
  englishName: string;
  imageUrl: string;
}

const ALL_MOON_PHASES: MoonPhaseData[] = [
  {
    id: 'new-moon',
    name: '新月',
    englishName: 'New Moon',
    keywords: '开始、设定、种子',
    suitable: '写目标、定方向、整理愿望清单',
    tip: '新的周期不需要立刻热闹，先把真正重要的事情写下来。',
    imageUrl: mistyMoon
  },
  {
    id: 'waxing-crescent',
    name: '娥眉月',
    englishName: 'Waxing Crescent',
    keywords: '探索、尝试、萌芽',
    suitable: '小规模行动、测试新习惯、收集灵感',
    tip: '不用一下子做到完美，先让一个小行动发生。',
    imageUrl: shuoMoon
  },
  {
    id: 'first-quarter',
    name: '上弦月',
    englishName: 'First Quarter',
    keywords: '推进、选择、突破',
    suitable: '解决阻力、做决定、开始执行',
    tip: '当计划遇到阻力，正是你重新选择方向的时候。',
    imageUrl: shuoMoon
  },
  {
    id: 'waxing-gibbous',
    name: '盈凸月',
    englishName: 'Waxing Gibbous',
    keywords: '调整、优化、准备',
    suitable: '修改方案、补充资源、完善细节',
    tip: '真正的进展，常常来自一次耐心的微调。',
    imageUrl: qingMoon
  },
  {
    id: 'full-moon',
    name: '满月',
    englishName: 'Full Moon',
    keywords: '看见、完成、表达',
    suitable: '复盘成果、公开展示、庆祝完成',
    tip: '把已经完成的事情看见，也把自己的努力看见。',
    imageUrl: qingMoon
  },
  {
    id: 'waning-gibbous',
    name: '亏凸月',
    englishName: 'Waning Gibbous',
    keywords: '分享、沉淀、反馈',
    suitable: '总结经验、分享心得、收集反馈',
    tip: '成果不只属于完成的那一刻，也属于你愿意复盘的过程。',
    imageUrl: qingMoon
  },
  {
    id: 'third-quarter',
    name: '下弦月',
    englishName: 'Third Quarter',
    keywords: '清理、取舍、修正',
    suitable: '放弃无效计划、调整优先级、整理空间',
    tip: '不是所有计划都要坚持到底，有些放下也是前进。',
    imageUrl: shuoMoon
  },
  {
    id: 'waning-crescent',
    name: '残月',
    englishName: 'Waning Crescent',
    keywords: '休息、恢复、告别',
    suitable: '减少消耗、放慢节奏、为新周期留白',
    tip: '在重新开始之前，允许自己安静地恢复能量。',
    imageUrl: mistyMoon
  }
];

interface MoonBottle {
  language: string;
  text: string;
  translation: string;
  hint: string;
}

const moonBottleLibrary: MoonBottle[] = [
  {
    language: "中文",
    text: "月亮不催促花开，它只是安静地照着每一段生长。",
    translation: "",
    hint: "今天适合允许自己慢一点。"
  },
  {
    language: "中文",
    text: "你走过的暗处，也会成为光的一部分。",
    translation: "",
    hint: "把困难看作正在沉淀的力量。"
  },
  {
    language: "中文",
    text: "今晚的月光很轻，正好用来放下沉重的事。",
    translation: "",
    hint: "清理一个小负担，给自己留一点空间。"
  },
  {
    language: "中文",
    text: "不必圆满才值得被看见，月亮缺着的时候也很美。",
    translation: "",
    hint: "接纳未完成的自己。"
  },
  {
    language: "中文",
    text: "把愿望放进夜色里，明天就多一个出发的理由。",
    translation: "",
    hint: "写下一个小目标，然后行动。"
  },
  {
    language: "English",
    text: "The moon keeps its light even when the night grows quiet.",
    translation: "即使夜晚安静下来，月亮也依然保有自己的光。",
    hint: "保持自己的节奏，不必急着被所有人看见。"
  },
  {
    language: "English",
    text: "A small glow is still a beginning.",
    translation: "一点微光，也是一种开始。",
    hint: "先完成最小的一步。"
  },
  {
    language: "English",
    text: "Let the moon remind you that change can be gentle.",
    translation: "让月亮提醒你，改变也可以是温柔的。",
    hint: "用不伤害自己的方式改变。"
  },
  {
    language: "English",
    text: "You do not need to be full to be luminous.",
    translation: "你不必圆满，也可以发光。",
    hint: "今天适合肯定自己的不完美。"
  },
  {
    language: "English",
    text: "Tonight, the sky leaves room for your next dream.",
    translation: "今夜，天空为你的下一个梦想留了位置。",
    hint: "为新的计划留一点时间。"
  },
  {
    language: "Français",
    text: "La lune avance sans bruit, mais elle traverse toute la nuit.",
    translation: "月亮无声前行，却穿过了整片夜晚。",
    hint: "安静的坚持也有力量。"
  },
  {
    language: "Français",
    text: "Même une lumière douce peut guider un long chemin.",
    translation: "即使是柔和的光，也能照亮很长的路。",
    hint: "不要低估小小的进展。"
  },
  {
    language: "Español",
    text: "La luna no corre; aun así, llega a cada ventana.",
    translation: "月亮从不奔跑，却依然抵达每一扇窗。",
    hint: "慢慢来，也能抵达。"
  },
  {
    language: "Español",
    text: "Tu luz also merece una noche tranquila.",
    translation: "你的光，也值得拥有一个安静的夜晚。",
    hint: "今天适合休息和恢复。"
  },
  {
    language: "Deutsch",
    text: "Der Mond wächst leise, Schritt für Schritt.",
    translation: "月亮安静地生长，一步一步。",
    hint: "把目标拆成更小的行动。"
  },
  {
    language: "Deutsch",
    text: "Auch im Schatten bleibt dein Weg vorhanden.",
    translation: "即使在阴影里，你的路也依然存在。",
    hint: "迷茫时先确认方向，不急着抵达。"
  },
  {
    language: "Italiano",
    text: "La luna ascolta il buio e risponde con luce.",
    translation: "月亮聆听黑暗，并以光回应。",
    hint: "把压力转化成温柔的行动。"
  },
  {
    language: "Italiano",
    text: "Ogni fase porta una piccola promessa.",
    translation: "每一个阶段，都带着一个小小的承诺。",
    hint: "相信当下这个阶段的意义。"
  },
  {
    language: "日本語",
    text: "月は欠けても、空にいることをやめない。",
    translation: "月亮即使缺了，也不会离开天空。",
    hint: "状态不好时，也不要否定自己。"
  },
  {
    language: "日本語",
    text: "静かな光が、心の道を照らす。",
    translation: "安静的光，照亮心里的路。",
    hint: "今天适合听见自己的真实想法。"
  },
  {
    language: "한국어",
    text: "달빛은 천천히 와도 마음을 밝힌다.",
    translation: "月光即使慢慢到来，也会照亮内心。",
    hint: "给自己一点等待的耐心。"
  },
  {
    language: "한국어",
    text: "작은 빛도 긴 밤을 건널 수 있다.",
    translation: "小小的光，也能穿过漫长的夜。",
    hint: "不要忽视微小的希望。"
  },
  {
    language: "العربية",
    text: "يمشي القمر بهدوء، لكنه لا ينسى الطريق.",
    translation: "月亮安静地走着，却从不忘记道路。",
    hint: "安静前进，也是在前进。"
  },
  {
    language: "العربية",
    text: "في كل ليل فرصة لضوء جديد.",
    translation: "每一个夜晚，都有迎来新光的机会。",
    hint: "今天可以重新开始一件小事。"
  },
  {
    language: "Português",
    text: "A lua ensina que crescer também pode ser silencioso.",
    translation: "月亮教会我们，成长也可以是安静的。",
    hint: "不必把所有努力都展示出来。"
  },
  {
    language: "Português",
    text: "Mesmo pequena, sua luz encontra o caminho.",
    translation: "即使微小，你的光也会找到道路。",
    hint: "相信自己的小力量。"
  }
];

interface DynamicSeaCanvasProps {
  ripple: boolean;
  moonElevation: number;
}

const DynamicSeaCanvas: React.FC<DynamicSeaCanvasProps> = ({ ripple, moonElevation }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationValue = 0;
    let animationId: number;
    let width = 300;
    let height = 130;

    const scaleCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5); // Caps DPR slightly at 2.5 for high-perf rendering
      const rectWidth = canvas.parentElement?.clientWidth || 300;
      const rectHeight = canvas.parentElement?.clientHeight || 130;
      
      canvas.width = rectWidth * dpr;
      canvas.height = rectHeight * dpr;
      
      width = rectWidth;
      height = rectHeight;
      
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    };

    scaleCanvas();

    const handleResize = () => {
      scaleCanvas();
    };
    window.addEventListener('resize', handleResize);

    // Dynamic water particles & bioluminescent stardust
    interface Sparkle {
      x: number;
      y: number;
      size: number;
      val: number;
      speed: number;
      phase: number;
      driftSpeed: number;
      type: 'shimmer' | 'bioluminescence';
    }

    const sparklesCount = 70; // Richer density for heavenly visual elegance
    const sparkles: Sparkle[] = [];
    for (let i = 0; i < sparklesCount; i++) {
      const isBio = Math.random() > 0.6;
      sparkles.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.75 + height * 0.15,
        size: isBio ? Math.random() * 1.0 + 0.4 : Math.random() * 1.8 + 0.6,
        val: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.025 + 0.006,
        phase: Math.random() * Math.PI * 2,
        driftSpeed: (Math.random() * 0.15 + 0.05) * (Math.random() > 0.5 ? 1 : -1),
        type: isBio ? 'bioluminescence' : 'shimmer'
      });
    }

    // Ripple tracker
    let rippleRad = 0;
    const maxRippleRad = 195;
    const rippleSpeed = 1.6;

    const waveDraw = () => {
      ctx.clearRect(0, 0, width, height);
      
      const elevFactor = moonElevation / 100;

      // 1. Deep, mysterious artistic dark sea baseline gradient (slightly brightens with rising moon)
      const seaGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (elevFactor < 0.1) {
        seaGrad.addColorStop(0, '#020306');
        seaGrad.addColorStop(0.4, '#03050c');
        seaGrad.addColorStop(0.8, '#040715');
        seaGrad.addColorStop(1, '#010204');
      } else {
        seaGrad.addColorStop(0, '#020512');
        seaGrad.addColorStop(0.4, '#050a22');
        seaGrad.addColorStop(0.8, '#0a1740');
        seaGrad.addColorStop(1, '#02040c');
      }
      ctx.fillStyle = seaGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Wide, soft radiant underwater glow of moonlight sinking down (intensity depends on moon altitude)
      const reflectionCenter = width / 2;
      if (elevFactor > 0.02) {
        const radiantLightGlow = ctx.createRadialGradient(
          reflectionCenter, -10, 5,
          reflectionCenter, height * 0.5, width * (0.2 + elevFactor * 0.25)
        );
        radiantLightGlow.addColorStop(0, `rgba(235, 215, 170, ${0.05 + elevFactor * 0.18})`);
        radiantLightGlow.addColorStop(0.5, `rgba(212, 175, 100, ${elevFactor * 0.08})`);
        radiantLightGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = radiantLightGlow;
        ctx.fillRect(0, 0, width, height);
      }

      animationValue += 0.013; // silky slow frame evolution

      // 3. Multi-layer wave configs (each styled with custom colors and semi-transparency)
      const waveConfig = [
        { 
          y: height * 0.3, 
          len: 0.006, 
          amp: 6, 
          speedOtf: 0.7, 
          colorBegin: `rgba(6, 12, 34, ${0.4 + elevFactor * 0.15})`,
          colorEnd: 'rgba(10, 22, 54, 0.2)'
        },
        { 
          y: height * 0.48, 
          len: 0.011, 
          amp: 9, 
          speedOtf: -0.5, 
          colorBegin: `rgba(8, 20, 50, ${0.5 + elevFactor * 0.15})`,
          colorEnd: 'rgba(4, 10, 30, 0.3)'
        },
        { 
          y: height * 0.65, 
          len: 0.008, 
          amp: 12, 
          speedOtf: 0.95, 
          colorBegin: `rgba(14, 30, 70, ${0.6 + elevFactor * 0.15})`,
          colorEnd: 'rgba(6, 14, 38, 0.5)'
        },
        { 
          y: height * 0.82, 
          len: 0.014, 
          amp: 7, 
          speedOtf: -0.75, 
          colorBegin: 'rgba(10, 23, 56, 0.85)',
          colorEnd: 'rgba(3, 7, 20, 0.92)'
        }
      ];

      waveConfig.forEach((wv, layer) => {
        // Draw the wave polygon body
        ctx.beginPath();
        ctx.moveTo(0, height);

        for (let x = 0; x <= width; x += 2) { 
          const theta = x * wv.len + animationValue * wv.speedOtf;
          let shift = Math.sin(theta) * wv.amp;
          // superposition adding secondary harmonic for realistic organic swells
          shift += Math.cos(theta * 0.45 + animationValue * 0.2) * (wv.amp * 0.45);
          
          const y = wv.y + shift;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        // Wave surface gradient fills to give depth & gorgeous volume shading
        const waveGradient = ctx.createLinearGradient(0, wv.y - wv.amp, 0, height);
        waveGradient.addColorStop(0, wv.colorBegin);
        waveGradient.addColorStop(0.7, wv.colorEnd);
        ctx.fillStyle = waveGradient;
        ctx.fill();

        // 4. Highlight glistening reflection tracks on wave slopes (creating the shimmering path)
        if (layer >= 1 && elevFactor > 0.02) {
          ctx.beginPath();
          for (let x = 0; x <= width; x += 6) {
            const theta = x * wv.len + animationValue * wv.speedOtf;
            const shift = Math.sin(theta) * wv.amp + Math.cos(theta * 0.45 + animationValue * 0.2) * (wv.amp * 0.45);
            const y = wv.y + shift;

            // Distance to the central line of the moon
            const deltaX = Math.abs(x - reflectionCenter);
            const spreadWidth = width * (0.16 + elevFactor * 0.14);
            const intensity = Math.max(0, 1 - deltaX / spreadWidth); // Focused moonlight track width
            
            // Sparkling twinkling modulation
            const shimVal = Math.sin(animationValue * 5.0 + x * 0.08) * 0.5 + 0.5;

            if (intensity > 0) {
              const elevationFade = Math.min(1.0, elevFactor * 1.5);
              const alpha = intensity * shimVal * 0.85 * elevationFade;
              // Make waves lit up by pale gold and silver moonlight
              ctx.strokeStyle = `rgba(238, 218, 170, ${alpha})`;
              ctx.lineWidth = 1.35 * (0.7 + elevFactor * 0.5);
              ctx.beginPath();
              // Length stretches slightly more at the focal center path
              const lineLen = (2.5 + intensity * 6) * (0.6 + elevFactor * 0.5);
              ctx.moveTo(x - lineLen / 2, y);
              ctx.lineTo(x + lineLen / 2, y);
              ctx.stroke();
            }
          }
        }
      });

      // 5. Draw the Sparkles & Bioluminescence Particles
      sparkles.forEach(s => {
        s.phase += s.speed;
        const pulseAlpha = Math.sin(s.phase) * s.val;

        // Make particles gently drift horizontally
        s.x += s.driftSpeed * 0.6;
        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;

        // Calculate dynamic wave-bound height limits so sparkle belongs to the simulated ocean surface
        const baseWaveY = height * 0.52 + Math.sin(s.x * 0.012 + animationValue) * 7;
        
        // If s is out of bounds, reset safely
        if (s.y < baseWaveY - 15) {
          s.y = baseWaveY + (height - baseWaveY) * Math.random();
        }

        // Distance modulation
        const deltaX = Math.abs(s.x - reflectionCenter);
        
        if (s.type === 'shimmer') {
          if (elevFactor > 0.02) {
            // Shimmers are golden glistening glitter centered tightly on the moonbeam
            const spreadWidth = width * (0.2 + elevFactor * 0.15);
            const intensity = Math.max(0, 1 - deltaX / spreadWidth);
            const elevationFade = Math.min(1.0, elevFactor * 1.5);
            const finalAlpha = Math.max(0, pulseAlpha * intensity * 0.85 * elevationFade);

            if (finalAlpha > 0.02) {
              ctx.fillStyle = `rgba(235, 210, 160, ${finalAlpha})`;
              ctx.beginPath();
              // Draw glistening golden oval grains
              ctx.ellipse(s.x, s.y, s.size * 1.6 * intensity, s.size * 0.42 * (0.5 + elevFactor * 0.5), Math.PI / 12, 0, Math.PI * 2);
              ctx.fill();

              // Occasionally add extra specular star glint
              if (s.val > 0.85 && finalAlpha > 0.4) {
                ctx.fillStyle = `rgba(255, 255, 255, ${finalAlpha * 0.95})`;
                ctx.fillRect(s.x - 0.5, s.y - 1.5, 1, 3);
                ctx.fillRect(s.x - 1.5, s.y - 0.5, 3, 1);
              }
            }
          }
        } else {
          // Bioluminescence are dreamy, turquoise-pale-cyan floating stars dispersed wider
          // Floating slightly up like glowing deep-water plankton/phosphorus
          s.y -= 0.08; 
          const intensity = Math.max(0, 1 - deltaX / (width * 0.8)); // broad distribution
          const finalAlpha = Math.max(0, (Math.sin(s.phase * 0.7) * 0.5 + 0.5) * s.val * intensity * (0.35 + elevFactor * 0.35));

          if (finalAlpha > 0.01) {
            ctx.fillStyle = `rgba(147, 217, 253, ${finalAlpha})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size * 1.1, 0, Math.PI * 2);
            ctx.fill();
            
            // outer dreamy soft aura halo
            ctx.fillStyle = `rgba(180, 230, 255, ${finalAlpha * 0.35})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size * 2.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // 6. Draw interactive sacred water ripples expanding circularly with high fidelity
      if (ripple) {
        if (rippleRad === 0) {
          rippleRad = 2;
        }
        rippleRad += rippleSpeed;
        const ripAlpha = Math.max(0, 1 - (rippleRad / maxRippleRad));

        if (ripAlpha > 0) {
          // Multiple expanding concentric rings to make it look extremely natural and divine
          // Ring 1 (Gold, shimmering)
          ctx.strokeStyle = `rgba(235, 215, 170, ${ripAlpha * 1.0})`;
          ctx.lineWidth = 1.65;
          ctx.beginPath();
          ctx.ellipse(reflectionCenter, height * 0.6, rippleRad * 1.5, rippleRad * 0.4, 0, 0, Math.PI * 2);
          ctx.stroke();

          // Ring 2 (Dreamy pale blue, offset delay outer ring)
          if (rippleRad > 30) {
            const ring2Alpha = Math.max(0, 1 - ((rippleRad - 25) / maxRippleRad)) * 0.55;
            ctx.strokeStyle = `rgba(147, 217, 253, ${ring2Alpha})`;
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.ellipse(reflectionCenter, height * 0.6, (rippleRad - 25) * 1.65, (rippleRad - 25) * 0.44, 0, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Ring 3 (Inner tender soft aura)
          if (rippleRad < 100) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${ripAlpha * 0.45})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.ellipse(reflectionCenter, height * 0.6, rippleRad * 0.8, rippleRad * 0.22, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      } else {
        rippleRad = 0;
      }

      animationId = requestAnimationFrame(waveDraw);
    };

    waveDraw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [ripple, moonElevation]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10 block" />;
};

export const MoonSection: React.FC = () => {
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState<number>(0);
  const [moonPhases, setMoonPhases] = useState<MoonPhaseData[]>(ALL_MOON_PHASES);
  const [userGoal, setUserGoal] = useState('');
  const [userTask, setUserTask] = useState('');
  const [userRelease, setUserRelease] = useState('');
  const [userHabit, setUserHabit] = useState('');
  const [userReminder, setUserReminder] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState<{
    id: string;
    date: string;
    phaseName: string;
    goal: string;
    task: string;
    release: string;
    habit: string;
    reminder: string;
  } | null>(null);

  const todayCardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  
  // Add Moon Pool Ref
  const moonPoolRef = useRef<HTMLDivElement>(null);

  // Add Modal and Stepper States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'generate' | 'view'>('generate');
  const [activeStep, setActiveStep] = useState<number>(1);

  // Moon Pool States
  const [currentBottle, setCurrentBottle] = useState<MoonBottle | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [rippleActive, setRippleActive] = useState(false);
  const [savedSuccessFlag, setSavedSuccessFlag] = useState(false);
  const [savedBottles, setSavedBottles] = useState<MoonBottle[]>([]);
  const [lastDrawnIndex, setLastDrawnIndex] = useState<number | null>(null);

  // Interactive Moon Rising states (hashgraphvc style)
  const [moonElevation, setMoonElevation] = useState<number>(75);
  const [isAutoRising, setIsAutoRising] = useState<boolean>(false);
  const [showOrbitLines, setShowOrbitLines] = useState<boolean>(true);

  // Music Player States for Debussy's Clair de Lune
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.35);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<boolean>(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setAudioError(false);
      }).catch(err => {
        console.error("Audio playback was blocked or failed:", err);
        // Playback could be blocked by browser autoplay policy before user interactions
        setAudioError(true);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = parseFloat(e.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (newVol > 0) {
      setIsMuted(false);
    }
  };

  const formatMusicTime = (secs: number) => {
    if (isNaN(secs) || secs === Infinity) return "00:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const triggerScenicMoonrise = () => {
    if (isAutoRising) return;
    setIsAutoRising(true);
    setMoonElevation(0);
    setRippleActive(true);
    
    let currentElev = 0;
    const intervalTime = 30;
    const stepCount = 120; // ~3.6s
    const stepValue = 100 / stepCount;

    const timer = setInterval(() => {
      currentElev += stepValue;
      if (currentElev >= 100) {
        setMoonElevation(100);
        setIsAutoRising(false);
        clearInterval(timer);
      } else {
        setMoonElevation(Number(currentElev.toFixed(2)));
        if (Math.round(currentElev) % 35 === 0) {
          setRippleActive(true);
          setTimeout(() => setRippleActive(false), 800);
        }
      }
    }, intervalTime);
  };

  // Load saved bottles on mount
  useEffect(() => {
    const saved = localStorage.getItem('my_moonlight_collection');
    if (saved) {
      try {
        setSavedBottles(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved bottles', e);
      }
    }
  }, []);

  const handleDrawBottle = () => {
    if (isDrawing) return;
    setIsDrawing(true);
    setRippleActive(true);
    
    // Stop ripple after short duration
    setTimeout(() => setRippleActive(false), 2000);

    setTimeout(() => {
      let randomIndex = Math.floor(Math.random() * moonBottleLibrary.length);
      // Avoid consecutive duplicates
      if (lastDrawnIndex !== null && moonBottleLibrary.length > 1) {
        while (randomIndex === lastDrawnIndex) {
          randomIndex = Math.floor(Math.random() * moonBottleLibrary.length);
        }
      }
      setLastDrawnIndex(randomIndex);
      setCurrentBottle(moonBottleLibrary[randomIndex]);
      setIsDrawing(false);
    }, 1500); // 1.5 seconds gentle emergence animation
  };

  const handleSaveBottle = (bottle: MoonBottle) => {
    // Check if already saved
    const exists = savedBottles.some(b => b.text === bottle.text);
    if (exists) {
      setSavedSuccessFlag(true);
      setTimeout(() => setSavedSuccessFlag(false), 2000);
      return;
    }

    const updated = [bottle, ...savedBottles];
    setSavedBottles(updated);
    localStorage.setItem('my_moonlight_collection', JSON.stringify(updated));
    setSavedSuccessFlag(true);
    setTimeout(() => setSavedSuccessFlag(false), 2000);
  };

  const handleDeleteSavedBottle = (text: string) => {
    const updated = savedBottles.filter(b => b.text !== text);
    setSavedBottles(updated);
    localStorage.setItem('my_moonlight_collection', JSON.stringify(updated));
  };

  // Approximate moon phase calculation based on today's date
  useEffect(() => {
    // Reference New Moon: Jan 18, 2026
    const refNewMoon = new Date('2026-01-18T00:00:00Z').getTime();
    const today = new Date().getTime();
    const diffTime = today - refNewMoon;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    // Lunar cycle in days is ~29.53059
    const synodicMonth = 29.53059;
    const cycleAt = (diffDays % synodicMonth + synodicMonth) % synodicMonth;
    const cycleRatio = cycleAt / synodicMonth; // 0.0 to 1.0
    
    let calculatedIndex = 0;
    if (cycleRatio >= 0.96875 || cycleRatio < 0.03125) {
      calculatedIndex = 0; // 新月
    } else if (cycleRatio >= 0.03125 && cycleRatio < 0.21875) {
      calculatedIndex = 1; // 娥眉月
    } else if (cycleRatio >= 0.21875 && cycleRatio < 0.28125) {
      calculatedIndex = 2; // 上弦月
    } else if (cycleRatio >= 0.28125 && cycleRatio < 0.46875) {
      calculatedIndex = 3; // 盈凸月
    } else if (cycleRatio >= 0.46875 && cycleRatio < 0.53125) {
      calculatedIndex = 4; // 满月
    } else if (cycleRatio >= 0.53125 && cycleRatio < 0.71875) {
      calculatedIndex = 5; // 亏凸月
    } else if (cycleRatio >= 0.71875 && cycleRatio < 0.78125) {
      calculatedIndex = 6; // 下弦月
    } else {
      calculatedIndex = 7; // 残月
    }

    setSelectedPhaseIndex(calculatedIndex);

    // Load saved plan if any
    const saved = localStorage.getItem('eastern_moon_plan');
    if (saved) {
      try {
        setGeneratedPlan(JSON.parse(saved));
        setModalMode('view'); // Default to view if there's already a saved plan!
      } catch (e) {
        console.error('Failed to parse saved moon plan', e);
      }
    }

    // Load dynamic moon phases from database
    api.getMoonPhases()
      .then(data => {
        if (data && data.length > 0) {
          setMoonPhases(data.map((p: any) => ({
            id: p.id,
            name: p.name,
            englishName: p.english_name,
            keywords: p.keywords,
            suitable: p.suitable,
            tip: p.tip,
            imageUrl: p.image_url
          })));
        }
      })
      .catch(err => console.error('加载动态月相失败:', err));
  }, []);

  const handleGeneratePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPhase = moonPhases[selectedPhaseIndex] || ALL_MOON_PHASES[selectedPhaseIndex];
    const newPlan = {
      id: Math.random().toString(),
      date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }),
      phaseName: currentPhase.name,
      goal: userGoal.trim() || '保持内心定力与静默前行',
      task: userTask.trim() || '在今天完成一小时的深度阅读与专注整理',
      release: userRelease.trim() || '放下对外界评判的过度敏感与焦虑',
      habit: userHabit.trim() || '清晨饮一杯温水并静坐五分钟',
      reminder: userReminder.trim() || '跟随自己的核心节奏，不疾不徐。'
    };
    
    setGeneratedPlan(newPlan);
    localStorage.setItem('eastern_moon_plan', JSON.stringify(newPlan));
    
    // Smooth scroll to generated card
    setTimeout(() => {
      const el = document.getElementById('generated-plan-block');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleResetPlan = () => {
    localStorage.removeItem('eastern_moon_plan');
    setGeneratedPlan(null);
    setUserGoal('');
    setUserTask('');
    setUserRelease('');
    setUserHabit('');
    setUserReminder('');
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full min-h-screen text-[#4a453e]">
      {/* Background Classical Audio Element for Debussy's Clair de Lune */}
      <audio
        ref={audioRef}
        loop
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
      >
        <source 
          src="https://upload.wikimedia.org/wikipedia/commons/transcoded/1/10/Claude_Debussy_-_Suite_bergamasque_-_3._Clair_de_lune.ogg/Claude_Debussy_-_Suite_bergamasque_-_3._Clair_de_lune.ogg.mp3" 
          type="audio/mpeg" 
        />
        <source 
          src="https://upload.wikimedia.org/wikipedia/commons/1/10/Claude_Debussy_-_Suite_bergamasque_-_3._Clair_de_lune.ogg" 
          type="audio/ogg" 
        />
      </audio>
      
      {/* GLORIOUS CELESTIAL SACRED LIGHT THEME CONTAINER */}
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#FFFDF9] to-[#F5EFEB] pt-32 pb-24 font-serif">
        
        {/* Soft Sacred Glow Overlay / Sun & Moon Beams */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(197,168,128,0.06)_1.3px,transparent_0)] bg-[size:32px_32px] opacity-80 pointer-events-none" />
        <div className="absolute top-[5%] left-[20%] w-[55vw] h-[55vw] rounded-full bg-radial-[circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%] pointer-events-none filter blur-3xl animate-pulse" />
        <div className="absolute bottom-[20%] right-[15%] w-[45vw] h-[45vw] rounded-full bg-radial-[circle_at_center,rgba(243,212,121,0.07)_0%,transparent_70%] pointer-events-none filter blur-3xl" />
        
        {/* Top Divine Ray of Light effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[75vw] h-[350px] bg-gradient-to-b from-[#FFFDF3] via-transparent to-transparent opacity-80 pointer-events-none filter blur-2xl" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">
          
          {/* Subtle moon charm badge of sacred guidance */}
          <div className="mb-6 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#e5cb95]/40 bg-white/70 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-pulse" />
            <span className="font-mono text-[10px] text-[#8c7b5f] font-medium tracking-[0.2em] uppercase">
              Follow the Sacred Rhythm &middot; 寻心之旅
            </span>
          </div>

          {/* Hero Header Title - Radiant & Clean */}
          <h1 className="text-4xl md:text-7xl font-light tracking-[0.4em] text-[#2c2722] select-none relative mb-6">
            月之谕
          </h1>

          <p className="font-sans font-light text-xs md:text-sm text-[#8c7a5c] tracking-[0.3em] uppercase mb-10 max-w-lg">
            EASTERN LUNAR ORACLE &middot; SACRED GUIDANCE
          </p>

          <p className="max-w-3xl text-[#5c5346] text-xs md:text-sm leading-loose tracking-[0.25em] font-light mb-12 font-serif text-center px-4 md:px-8 flex flex-col gap-2">
            <span>月升月落，满盈缺损，宛如生命深处的一呼一吸。</span>
            <span>借一缕灵动清辉，临摹内心幽微的潜藏潮汐。</span>
            <span>不急不缓地，于纸页上拆解每段崭新旋律。</span>
            <span>将细碎如尘的日常，虔诚梳理、妥帖安置。</span>
            <span>在星轨般神圣笃定的秩序里，静候自我的圆满。</span>
          </p>

          {/* Minimalist Poetic Audio Controller (Inspired by Bianjing Hours) */}
          <div className="mb-14 flex flex-col items-center justify-center select-none gap-2">
            <motion.button
              onClick={togglePlay}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative flex items-center justify-center w-14 h-14 rounded-full border border-brand-gold/30 bg-[#fffdfa]/50 backdrop-blur-md cursor-pointer transition-all duration-500 hover:border-brand-gold focus:outline-none"
              title="德彪西《月光》 Debussy - Clair de Lune"
            >
              {/* Rotating outer ring representing orbit / spin */}
              <motion.div
                animate={isPlaying ? { rotate: 360 } : {}}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className={`absolute inset-0 rounded-full border border-dashed border-brand-gold/25 pointer-events-none transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
              />
              
              {/* Inner ambient glow pulse */}
              <div className={`absolute inset-2 rounded-full border border-[#ebdcb9]/40 bg-gradient-to-tr from-transparent to-[#fffcf7]/30 pointer-events-none transition-transform duration-700 ${isPlaying ? 'scale-110' : 'scale-100'}`} />

              {isPlaying ? (
                // Elegant Minimal Wave Indicator
                <div className="flex gap-[3px] items-end h-4 select-none pr-[1px]">
                  {[5, 9, 6].map((h, idx) => (
                    <motion.div
                      key={idx}
                      className="w-[1.2px] bg-brand-gold"
                      animate={{ height: ['25%', '100%', '25%'] }}
                      transition={{
                        duration: idx === 1 ? 0.9 : idx === 2 ? 1.2 : 1.0,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: idx * 0.15
                      }}
                      style={{ height: `${h * 10}%` }}
                    />
                  ))}
                </div>
              ) : (
                // Minimalist Delicate Play Icon
                <Play className="w-3.5 h-3.5 text-brand-gold/90 translate-x-[1px] fill-brand-gold/15 transition-colors duration-300 group-hover:text-brand-gold" />
              )}
            </motion.button>
            <div className="flex flex-col items-center text-center mt-1">
              <span className="font-mono text-[8px] tracking-[0.25em] text-brand-gold/80 uppercase">DEBUSSY &middot; CLAIR DE LUNE</span>
              <span className="text-[10px] tracking-[0.15em] text-[#8c7b5f] font-light mt-0.5">《月光曲》背景音乐</span>
            </div>
            
            {audioError && (
              <button 
                onClick={() => { setAudioError(false); togglePlay(); }}
                className="mt-2 px-3 py-1 bg-[#2c2722] text-[#fffcf9] text-[9px] tracking-widest cursor-pointer transition-all hover:bg-brand-gold hover:text-[#2c2722]"
              >
                重试加载 Play / Retry
              </button>
            )}
          </div>

          {/* Fixed Floating Ambient Audio Toggler (Inspired by Bianjing Hours) */}
          <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 select-none flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="flex items-center gap-2"
            >
              {isPlaying && (
                <span className="hidden md:inline-block font-mono text-[9px] text-[#8c7b5f] bg-[#fffdf9]/95 backdrop-blur-md px-2.5 py-1 border border-[#e5cb95]/20 tracking-widest uppercase shadow-sm">
                  Clair de Lune &middot; 月光
                </span>
              )}
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full border border-brand-gold/30 bg-[#fffdfa]/85 backdrop-blur-md flex items-center justify-center cursor-pointer hover:border-brand-gold shadow-sm transition-all duration-300 focus:outline-none hover:scale-105 active:scale-95"
                title="Debussy - Clair de Lune"
              >
                {isPlaying ? (
                  <div className="flex gap-[2px] items-end h-3 select-none pr-[0.5px]">
                    {[4, 8, 5].map((h, idx) => (
                      <motion.div
                        key={idx}
                        className="w-[1px] bg-brand-gold"
                        animate={{ height: ['20%', '100%', '20%'] }}
                        transition={{
                          duration: idx % 2 === 0 ? 0.9 : 1.3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: idx * 0.15
                        }}
                        style={{ height: `${h * 10}%` }}
                      />
                    ))}
                  </div>
                ) : (
                  <Music className="w-3.5 h-3.5 text-brand-gold/80" />
                )}
              </button>
            </motion.div>
          </div>

          {/* Glowing Divine Button Actions */}
          <div className="flex flex-col sm:flex-row gap-5 mb-28">
            <button
              onClick={() => scrollToSection(todayCardRef)}
              className="px-8 py-3.5 bg-[#2c2722] text-[#fffcf9] hover:bg-brand-gold hover:text-brand-dark rounded-none font-serif text-xs tracking-widest cursor-pointer transition-all duration-300 font-medium shadow-[0_10px_30px_rgba(44,39,34,0.15)] hover:shadow-[0_10px_30px_rgba(212,175,55,0.25)] flex items-center gap-2.5 justify-center uppercase"
            >
              <Moon className="w-4 h-4 text-brand-gold" />
              查看今日月相
            </button>
            <button
              onClick={() => scrollToSection(moonPoolRef)}
              className="px-8 py-3.5 border border-[#c1b39d]/60 bg-white/40 backdrop-blur-sm hover:bg-white hover:text-brand-dark hover:border-brand-gold rounded-none font-serif text-xs tracking-widest cursor-pointer transition-all duration-300 font-light text-[#5c5346] flex items-center gap-2.5 justify-center"
            >
              <Waves className="w-4 h-4 text-brand-gold" />
              月亮池
            </button>
          </div>

          {/* SECTION 2: 今日月相卡片 / Dynamic Focused Pearl and Gold Dashboard */}
          <div 
            ref={todayCardRef}
            className="w-full max-w-4xl bg-white/90 border border-[#e5cb95]/40 backdrop-blur-md p-8 md:p-12 mb-28 shadow-[0_20px_50px_rgba(197,168,128,0.15)] transition-all duration-500 hover:border-brand-gold/60 relative"
          >
            {/* Fine double border container mimicking museum exhibits */}
            <div className="absolute inset-2 border border-[#e5cb95]/20 pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
              
              {/* Detailed Moon Copy */}
              <div className="flex-1 text-left flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <div className="h-[1px] w-6 bg-brand-gold" />
                  <span className="font-mono text-[10px] text-brand-gold font-semibold tracking-[0.2em] uppercase">
                    今日月相 &middot; TODAY'S LUNAR PHASE
                  </span>
                </div>

                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mt-1">
                  <h2 className="text-2xl md:text-3xl font-normal text-[#2c2722] tracking-widest whitespace-nowrap">
                    {(moonPhases[selectedPhaseIndex] || ALL_MOON_PHASES[selectedPhaseIndex]).name}
                  </h2>
                  <span className="text-xs font-light font-sans tracking-widest text-[#8c7b5f] uppercase italic whitespace-nowrap">
                    {(moonPhases[selectedPhaseIndex] || ALL_MOON_PHASES[selectedPhaseIndex]).englishName}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {((moonPhases[selectedPhaseIndex] || ALL_MOON_PHASES[selectedPhaseIndex]).keywords || '').split('、').map((k, i) => (
                    <span 
                      key={i} 
                      className="text-xs px-3.5 py-1 bg-[#fdfaf5] text-[#5c5346] border border-[#e5cb95]/30 rounded-none tracking-widest font-serif font-medium"
                    >
                      {k}
                    </span>
                  ))}
                </div>

                <hr className="border-[#e5cb95]/20 my-2" />

                <div className="flex flex-col gap-2 font-serif text-[#5c5346]">
                  <span className="text-xs text-[#8c7b5f] tracking-widest font-mono font-medium">适合引导：</span>
                  <p className="text-[#2c2722] text-sm md:text-base leading-relaxed tracking-wider font-medium">
                    {(moonPhases[selectedPhaseIndex] || ALL_MOON_PHASES[selectedPhaseIndex]).suitable}
                  </p>
                </div>

                <div className="flex flex-col gap-2 font-serif mt-2">
                  <span className="text-xs text-[#8c7b5f] tracking-widest font-mono font-medium">智慧启示：</span>
                  <div className="border-l-2 border-brand-gold pl-4 py-1 italic text-[#6e5f49] text-sm leading-relaxed tracking-widest font-light">
                    “{(moonPhases[selectedPhaseIndex] || ALL_MOON_PHASES[selectedPhaseIndex]).tip}”
                  </div>
                </div>

                {/* Manual switch helper tools with premium gold layout */}
                <div className="mt-6">
                  <span className="text-[10px] text-[#8c7b5f] font-mono block mb-2.5 uppercase tracking-wider font-semibold">
                    点击下方月相词，体验自新月至残月的状态转化：
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {moonPhases.map((p, i) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPhaseIndex(i)}
                        className={`px-3 py-1.5 text-xs transition-all duration-300 font-serif cursor-pointer border flex items-center gap-2 ${
                          selectedPhaseIndex === i 
                            ? 'bg-[#2c2722] text-[#fffcf9] border-[#2c2722] font-semibold shadow-sm' 
                            : 'bg-white/60 hover:bg-white text-[#5c5346] border-[#ebdcb9]/60'
                        }`}
                      >
                        {p.imageUrl && (
                          <img 
                            src={p.imageUrl} 
                            alt={p.name} 
                            className="w-3.5 h-3.5 rounded-full object-cover border border-[#e5cb95]/30" 
                          />
                        )}
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Glowing Ivory/Golden Moon Representation */}
              <div className="flex-shrink-0 flex flex-col items-center justify-center p-6 relative">
                
                {/* Beautiful background gold aura */}
                <div className="absolute inset-0 w-full h-full bg-radial-[circle_at_center,rgba(212,175,55,0.18)_0%,transparent_75%] pointer-events-none filter blur-xl scale-125" />

                <div className="relative z-10 w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border border-[#e5cb95]/40 shadow-[0_15px_40px_rgba(229,203,149,0.3)] bg-gradient-to-br from-[#FFFDF9] via-[#FDF5E2] to-[#ebdcb9]/40 flex items-center justify-center">
                  {(moonPhases[selectedPhaseIndex] || ALL_MOON_PHASES[selectedPhaseIndex]).imageUrl ? (
                    <img
                      src={(moonPhases[selectedPhaseIndex] || ALL_MOON_PHASES[selectedPhaseIndex]).imageUrl}
                      alt={(moonPhases[selectedPhaseIndex] || ALL_MOON_PHASES[selectedPhaseIndex]).name}
                      className="w-full h-full object-cover transition-all duration-1000"
                    />
                  ) : (
                    <div className="text-[10px] text-[#8c7b5f]/40 font-mono">NO IMAGE</div>
                  )}
                </div>
                
                {/* Visual coordinate badge */}
                <div className="mt-5 font-mono text-[9px] text-[#8c7b5f] tracking-[0.25em] uppercase text-center relative z-10">
                  Lunar Age ~ {((selectedPhaseIndex * 29.53) / 8).toFixed(1)} Days &middot; Phase {selectedPhaseIndex + 1}/8
                </div>
              </div>

            </div>

            {/* Fine Divider */}
            <div className="border-t border-[#ebdcb9]/40 my-8 relative z-10" />

            {/* Buttons for Plan Triggering */}
            <div className="flex flex-wrap justify-center gap-4 relative z-10">
              <button
                type="button"
                onClick={() => {
                  setModalMode('generate');
                  setIsModalOpen(true);
                }}
                className="px-6 py-2.5 text-xs bg-[#2c2722] text-white hover:bg-brand-gold hover:text-brand-dark font-serif tracking-widest flex items-center gap-2 cursor-pointer transition-all duration-300 border border-[#2c2722]"
              >
                <Plus className="w-3.5 h-3.5 text-brand-gold" />
                生成月相计划
              </button>
              <button
                type="button"
                onClick={() => {
                  setModalMode('view');
                  setIsModalOpen(true);
                }}
                className="px-6 py-2.5 text-xs bg-white text-[#5c5346] border border-[#e5cb95]/40 hover:border-brand-gold/60 font-serif tracking-widest flex items-center gap-2 cursor-pointer transition-all duration-300"
              >
                <FileText className="w-3.5 h-3.5 text-brand-gold" />
                查看月相计划
              </button>
            </div>

          </div>



          {/* ========================================================= */}
          {/* SECTION: 「月亮池」寻觅明珠 / THE MOONWELL RITUAL */}
          {/* ========================================================= */}
          <div ref={moonPoolRef} className="w-full mb-32 text-left">
            
            <div className="flex flex-col items-center text-center gap-3 mb-16">
              <span className="font-mono text-xs text-brand-gold font-semibold tracking-[0.25em] uppercase">THE SACRED MOON POOL</span>
              <h3 className="text-2xl md:text-4xl font-light text-[#2c2722] tracking-[0.2em] font-serif">
                月亮池 &middot; 沧海拾珍
              </h3>
              <div className="w-12 h-[1px] bg-brand-gold/60 mt-1" />
              <p className="max-w-xl text-[#6e675b] text-[13px] tracking-widest font-light leading-relaxed mt-2">
                在清澈平静的蓝色月波中，拾起一颗璀璨晶莹、载满星辉的沧海明珠。<br />
                用温存的低语与远方的智慧之芒，消融此刻尘世生活的浮躁与疲惫。
              </p>
            </div>

            <div className="w-full max-w-4xl mx-auto border border-[#e5cb95]/40 bg-gradient-to-br from-[#0c142b] via-[#121c3c] to-[#1e2f5f] p-8 md:p-12 shadow-[0_25px_60px_rgba(12,20,43,0.22)] relative overflow-hidden text-white mb-20">
              {/* Double thin borders mimicking modern high-end museums */}
              <div className="absolute inset-2 border border-[#e5cb95]/20 pointer-events-none z-10" />
              
              {/* Classical Corner Ornamentations */}
              <svg className="absolute top-[10px] left-[10px] w-8 h-8 text-[#e5cb95]/45 pointer-events-none z-20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M2,2 H30 M2,2 V30" />
                <path d="M6,6 H20 M6,6 V20" />
                <circle cx="11" cy="11" r="1.5" fill="currentColor" />
                <path d="M12,2 H16 M2,12 V16" strokeWidth="0.8" opacity="0.6" />
              </svg>
              <svg className="absolute top-[10px] right-[10px] w-8 h-8 text-[#e5cb95]/45 pointer-events-none rotate-90 z-20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M2,2 H30 M2,2 V30" />
                <path d="M6,6 H20 M6,6 V20" />
                <circle cx="11" cy="11" r="1.5" fill="currentColor" />
                <path d="M12,2 H16 M2,12 V16" strokeWidth="0.8" opacity="0.6" />
              </svg>
              <svg className="absolute bottom-[10px] right-[10px] w-8 h-8 text-[#e5cb95]/45 pointer-events-none rotate-180 z-20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M2,2 H30 M2,2 V30" />
                <path d="M6,6 H20 M6,6 V20" />
                <circle cx="11" cy="11" r="1.5" fill="currentColor" />
                <path d="M12,2 H16 M2,12 V16" strokeWidth="0.8" opacity="0.6" />
              </svg>
              <svg className="absolute bottom-[10px] left-[10px] w-8 h-8 text-[#e5cb95]/45 pointer-events-none -rotate-90 z-20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M2,2 H30 M2,2 V30" />
                <path d="M6,6 H20 M6,6 V20" />
                <circle cx="11" cy="11" r="1.5" fill="currentColor" />
                <path d="M12,2 H16 M2,12 V16" strokeWidth="0.8" opacity="0.6" />
              </svg>

              {/* Classical Center Side Accents (Traditional Cloud Ornaments / Line Dividers) */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 opacity-30 select-none pointer-events-none z-10 font-mono text-[9px] text-[#e5cb95] tracking-[0.4em]">
                <span>❖</span>
                <span className="w-12 h-[0.5px] bg-[#e5cb95]" />
                <span>❖</span>
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 opacity-30 select-none pointer-events-none z-10 font-mono text-[9px] text-[#e5cb95] tracking-[0.4em]">
                <span>❖</span>
                <span className="w-12 h-[0.5px] bg-[#e5cb95]" />
                <span>❖</span>
              </div>
              
              {/* Glowing Aura Effect */}
              <div className="absolute top-[5%] left-[12%] w-[400px] h-[400px] rounded-full bg-radial-[circle_at_center,rgba(229,203,149,0.07)_0%,transparent_75%] pointer-events-none filter blur-2xl" />
              <div className="absolute bottom-[-15%] right-[-15%] w-[450px] h-[450px] rounded-full bg-radial-[circle_at_center,rgba(96,165,250,0.06)_0%,transparent_70%] pointer-events-none filter blur-2xl" />

              {/* Water ripple animated elements when active */}
              <AnimatePresence>
                {rippleActive && (
                  <>
                    <motion.div 
                      key="r1"
                      initial={{ scale: 0.2, opacity: 0.9 }}
                      animate={{ scale: 2.3, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 2.2, ease: "easeOut" }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-[#ebdcb9]/40 pointer-events-none z-15"
                    />
                    <motion.div 
                      key="r2"
                      initial={{ scale: 0.1, opacity: 0.7 }}
                      animate={{ scale: 2.9, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 3.2, ease: "easeOut", delay: 0.4 }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-blue-400/30 pointer-events-none z-15"
                    />
                  </>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-20">
                
                {/* Left: Beautiful scenic illustration - Moon hanging over a shimmering sea */}
                <div className="lg:col-span-5 flex flex-col">
                  <div className="relative w-full h-80 md:h-[350px] bg-gradient-to-b from-[#050814] via-[#0b1227] to-[#142146] border border-[#e5cb95]/40 shadow-[0_15px_35px_rgba(0,0,0,0.5)] overflow-hidden group select-none flex flex-col justify-between p-6">
                    
                    {/* Highly aesthetic drifting mist/clouds behind the moon */}
                    <motion.div 
                      animate={{ x: [-25, 25, -25], opacity: [0.3, 0.45, 0.3] }} 
                      transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-20 left-4 w-48 h-8 bg-gradient-to-r from-transparent via-white-[0.03] to-transparent rounded-full filter blur-xl pointer-events-none" 
                    />
                    <motion.div 
                      animate={{ x: [30, -30, 30], opacity: [0.2, 0.35, 0.2] }} 
                      transition={{ duration: 36, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-14 right-4 w-52 h-10 bg-gradient-to-r from-transparent via-[#ebdcb9]/4 to-transparent rounded-full filter blur-xl pointer-events-none" 
                    />

                    {/* Concentric Rotating Astrolabe Alignment Rings (hashgraphvc inspired) */}
                    {showOrbitLines && (
                      <div 
                        className="absolute pointer-events-none transition-all duration-300 left-1/2 -translate-x-1/2" 
                        style={{ 
                          top: `${195 - (moonElevation * 1.55) + 40}px`,
                          width: '150px', 
                          height: '150px' 
                        }}
                      >
                        {/* Outer dashed spinning orb ring */}
                        <div className="absolute inset-0 rounded-full border border-dashed border-[#e5cb95]/20 animate-[spin_40s_linear_infinite]" />
                        
                        {/* Inner faint tracker boundary line */}
                        <div className="absolute inset-[15px] rounded-full border border-[#ebdcb9]/8 animate-[spin_80s_linear_infinite] flex items-start justify-center">
                          <span className="text-[6px] font-mono tracking-widest text-[#ebdcb9]/20 -mt-1.5">ASCENSION CORRELATION</span>
                        </div>
                        
                        {/* Crosshairs target alignment axes with central tick */}
                        <div className="absolute top-1/2 left-[-10px] right-[-10px] h-[0.5px] bg-[#e5cb95]/15 pointer-events-none" />
                        <div className="absolute left-1/2 top-[-10px] bottom-[-10px] w-[0.5px] bg-[#e5cb95]/15 pointer-events-none" />
                        
                        {/* Tiny angle indicators */}
                        <span className="absolute top-2 right-2 text-[5px] font-mono text-[#e5cb95]/25">45°</span>
                        <span className="absolute bottom-2 left-2 text-[5px] font-mono text-[#e5cb95]/25">225°</span>
                      </div>
                    )}

                    {/* Sacred Radiant Moon hanging in the sky - Position scales with moonElevation */}
                    <div 
                      className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center transition-all duration-300"
                      style={{ 
                        top: `${195 - (moonElevation * 1.55)}px`,
                        opacity: moonElevation < 5 ? 0.35 : 1
                      }}
                    >
                      {/* Outer divine glow aura */}
                      <div 
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(229,203,149,0.3)_0%,transparent_70%)] filter blur-md animate-pulse" 
                        style={{ 
                          width: `${110 + moonElevation * 0.4}px`, 
                          height: `${110 + moonElevation * 0.4}px`,
                          opacity: Math.max(0.12, moonElevation / 100)
                        }}
                      />
                      
                      {/* Outer glowing halo ring */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-brand-gold/15 pointer-events-none" />

                      {/* The Lunar sphere */}
                      <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#FFFDF9] via-[#FDF5E2] to-[#E5CB95] shadow-[0_0_40px_rgba(229,203,149,0.5),inset_-3px_-3px_10px_rgba(180,140,80,0.2)] border border-[#E9D3A4]/30 overflow-hidden">
                        {/* Soft interior craters */}
                        <div className="absolute top-[20%] left-[30%] w-3 h-2 rounded-full bg-[#E5CB95]/30 filter blur-[0.5px]" />
                        <div className="absolute top-[50%] left-[60%] w-4 h-3 rounded-full bg-[#E5CB95]/40 filter blur-[1px]" />
                        <div className="absolute top-[65%] left-[25%] w-6 h-4 rounded-full bg-[#D4B572]/20 filter blur-[1px]" />
                      </div>
                    </div>

                    {/* Moonlight Path down the sky - floats and scales opacity with elevation */}
                    <div 
                      className="absolute left-1/2 -translate-x-1/2 w-32 bg-gradient-to-b from-[#e5cb95]/18 via-[#e5cb95]/4 to-transparent pointer-events-none filter blur-sm transition-all duration-300" 
                      style={{ 
                        top: `${215 - (moonElevation * 1.55)}px`,
                        height: `${85 + moonElevation * 0.7}px`,
                        opacity: Math.max(0, (moonElevation - 10) / 90)
                      }}
                    />

                    {/* Horizon line & Shimmering Sea at bottom */}
                    <div className="absolute top-[180px] md:top-[210px] inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#e5cb95]/40 to-transparent z-10" />

                    {/* Ocean water container with Dynamic Interactive HTML5 Canvas Waves */}
                    <div className="absolute bottom-0 inset-x-0 h-[100px] md:h-[130px] overflow-hidden">
                      <DynamicSeaCanvas ripple={rippleActive} moonElevation={moonElevation} />

                      {/* Small floating glowing Pearl - beautiful organic CSS render representing a mystical luminescent sea pearl */}
                      <motion.div
                        animate={{ 
                          y: [0, -5, 0], 
                          scale: [1, 1.05, 1] 
                        }}
                        transition={{ 
                          duration: 4.5, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                        className="absolute bottom-7 left-[50%] -translate-x-1/2 cursor-pointer flex flex-col items-center group/pearl z-20"
                        onClick={handleDrawBottle}
                      >
                        {/* 3D Glistening Pearl Orb */}
                        <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-[#dfc594] via-[#faf6ee] to-[#ffffff] shadow-[0_0_20px_rgba(255,255,255,0.85),0_4px_10px_rgba(229,203,149,0.35),inset_-2px_-2px_6px_rgba(180,140,80,0.35)] flex items-center justify-center border border-white/40 group-hover/pearl:scale-110 active:group-hover/pearl:scale-95 transition-transform duration-300">
                          {/* Inner soft specular highlight glint */}
                          <div className="absolute top-1 left-1.5 w-2 h-1.5 rounded-full bg-white/80 transform -rotate-12 filter blur-[0.3px]" />
                        </div>
                        
                        <span className="text-[8px] font-sans text-brand-gold bg-[#050815]/95 border border-[#e5cb95]/40 px-1.5 py-0.5 rounded-none whitespace-nowrap mt-1.5 scale-90 shadow-[0_2px_6px_rgba(0,0,0,0.5)] opacity-80 group-hover/pearl:opacity-100 transition-all">
                          寻觅夜光珠
                        </span>
                      </motion.div>
                    </div>

                    {/* Decorative content / Header of the micro-scenery */}
                    <div className="w-full flex justify-between items-start relative z-20 pointer-events-none">
                      <span className="text-[9px] font-mono tracking-[0.2em] text-[#ebdcb9]/60 uppercase">
                        SEANIGHT SCENERY
                      </span>
                      <span className="text-[9px] font-serif text-[#ebdcb9]/40 italic">
                        静影沉璧
                      </span>
                    </div>

                    {/* Bottom Well Action Button Container - floats gracefully on bottom level above water and reflections */}
                    <div className="w-full flex justify-center pb-2 relative z-30">
                      <button
                        onClick={handleDrawBottle}
                        disabled={isDrawing}
                        type="button"
                        className="px-6 py-2.5 bg-gradient-to-r from-[#ffeebc]/15 via-[#ebdcb9]/25 to-[#c5a880]/15 text-[#fdf5e2] hover:from-[#ffeebc]/25 hover:via-[#ebdcb9]/35 hover:to-[#c5a880]/25 backdrop-blur-md border border-[#e5cb95]/40 hover:scale-105 active:scale-95 disabled:scale-100 font-serif text-xs font-semibold tracking-widest uppercase cursor-pointer disabled:opacity-50 transition-all rounded-none shadow-[0_8px_20px_rgba(0,0,0,0.4)] flex items-center gap-1.5"
                      >
                        <Waves className={`w-3.5 h-3.5 ${isDrawing ? 'animate-spin' : ''}`} />
                        {isDrawing ? '在月波中寻觅...' : '拾明珠'}
                      </button>
                    </div>

                  </div>

                  {/* Astro Interactive Controller Panel underneath scenery (hashgraphvc style) */}
                  <div className="w-full mt-4 bg-[#090e1f]/85 border border-[#e5cb95]/25 p-4 rounded-none shadow-lg font-mono">
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#e5cb95]/15">
                      <span className="text-[9px] uppercase font-bold text-brand-gold tracking-widest flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-brand-gold/80 rounded-full animate-pulse" />
                        LUNAR ASTROLABE
                      </span>
                      <span className="text-[8px] text-[#ebdcb9]/40">
                        ZENITH: {moonElevation.toFixed(0)}% ALT
                      </span>
                    </div>

                    {/* Numerical real-time telemetry output dials */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-[9px] uppercase tracking-wider text-[#cbd7f9]/80 text-left">
                      <div className="bg-[#050814]/90 border border-[#e5cb95]/10 p-2">
                        <div className="text-[#ebdcb9]/50 text-[7px]">ORBIT ALTITUDE</div>
                        <div className="text-brand-gold text-[11px] font-semibold mt-0.5">
                          +{moonElevation.toFixed(1)}°
                        </div>
                      </div>
                      <div className="bg-[#050814]/90 border border-[#e5cb95]/10 p-2">
                        <div className="text-[#ebdcb9]/50 text-[7px]">SHIMMER INTENSITY</div>
                        <div className="text-white text-[11px] font-semibold mt-0.5">
                          {(415 + moonElevation * 2.85).toFixed(1)} THz
                        </div>
                      </div>
                    </div>

                    {/* Astrolabe Slider Controller */}
                    <div className="space-y-1 mb-4">
                      <div className="flex justify-between text-[8px] text-[#ebdcb9]/60 uppercase">
                        <span>Sea Sunk (0°)</span>
                        <span>Zenith (100°)</span>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        value={moonElevation}
                        onChange={(e) => setMoonElevation(Number(e.target.value))}
                        disabled={isAutoRising}
                        className="w-full h-1 bg-[#0c142a] border border-[#e5cb95]/20 accent-brand-gold cursor-ew-resize disabled:opacity-40 transition-opacity"
                      />
                    </div>

                    {/* Astrolabe Actions Buttons */}
                    <div className="w-full">
                      <button
                        onClick={triggerScenicMoonrise}
                        disabled={isAutoRising}
                        type="button"
                        className="w-full text-[8px] text-center font-bold tracking-widest uppercase py-1.5 px-0.5 bg-gradient-to-r from-[#e5cb95]/15 via-[#e5cb95]/30 to-[#e5cb95]/15 text-[#fdf5e2] hover:from-[#e5cb95]/30 hover:to-[#e5cb95]/30 border border-[#e5cb95]/40 transition disabled:opacity-50 cursor-pointer"
                      >
                        {isAutoRising ? "升月中..." : "海上升明月"}
                      </button>
                    </div>
                  </div>

                  <span className="mt-4 text-[10px] text-[#ebdcb9]/60 font-mono tracking-[0.2em] uppercase text-center select-none block">
                    Moon Over Shimmering Sea &middot; 月下静澜，波光粼粼
                  </span>
                </div>

                {/* Right: Elegant Floating Pearl Results Card */}
                <div className="lg:col-span-7 flex flex-col justify-center min-h-[300px]">
                  <AnimatePresence mode="wait">
                    {currentBottle ? (
                      <motion.div
                        key="active-bottle-card"
                        initial={{ opacity: 0, y: 18, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -18, scale: 0.96 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="relative p-6 md:p-8 bg-gradient-to-b from-[#060a1c] via-[#091129] to-[#040816] border border-white/10 rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.45),inset_0_1px_2px_rgba(255,255,255,0.08)] backdrop-blur-md flex flex-col gap-5 font-serif text-[#ebdcb9] text-left overflow-hidden group/card"
                      >
                        {/* Mother-of-pearl magical iridescent radial background halo */}
                        <div className="absolute -top-1/4 -left-1/4 w-80 h-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(229,203,149,0.06)_0%,rgba(147,197,253,0.03)_50%,transparent_100%)] pointer-events-none filter blur-xl" />

                        {/* Celestial corner accents - elegant tiny golden stars at the boundaries of the scroll */}
                        <span className="absolute top-2 left-2 text-[8px] text-brand-gold/40 select-none">✦</span>
                        <span className="absolute top-2 right-2 text-[8px] text-brand-gold/40 select-none">✦</span>
                        <span className="absolute bottom-2 left-2 text-[8px] text-brand-gold/40 select-none">✦</span>
                        <span className="absolute bottom-2 right-2 text-[8px] text-brand-gold/40 select-none">✦</span>

                        {/* Thin decorative gold-accent inner border line */}
                        <div className="absolute inset-2 border border-[#e5cb95]/10 pointer-events-none" />

                        {/* Symmetrical framing lines */}
                        <div className="absolute left-6 right-6 top-3 h-[1px] bg-gradient-to-r from-transparent via-[#e5cb95]/20 to-transparent" />
                        <div className="absolute left-6 right-6 bottom-3 h-[1px] bg-gradient-to-r from-transparent via-[#e5cb95]/20 to-transparent" />

                        <div className="absolute top-4 right-4 text-[8px] font-mono tracking-[0.25em] text-brand-gold border border-brand-gold/35 bg-[#050815] px-2.5 py-0.5 rounded-none uppercase z-20 shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                          {currentBottle.language}
                        </div>

                        <div className="flex items-center gap-2 relative z-10">
                          <span className="w-1.5 h-1.5 bg-[#e5cb95] rounded-full animate-ping duration-[2.5s]" />
                          <span className="text-[10px] font-mono tracking-[0.3em] font-medium text-brand-gold/90 uppercase">
                            TODAY'S PEARL &middot; 沧海明珠
                          </span>
                        </div>

                        {/* Text Area with styled typography and giant luxury background quote */}
                        <div className="space-y-4 pt-1 relative z-10">
                          <div className="relative">
                            {/* Gorgeous oversize decorative quote mark */}
                            <span className="absolute -top-6 -left-3 text-5xl font-serif text-[#e5cb95]/10 select-none">“</span>
                            <p className="text-base md:text-[18px] leading-relaxed font-normal tracking-wide text-white pl-3 relative z-10">
                              {currentBottle.text}
                            </p>
                          </div>

                          {currentBottle.translation && (
                            <p className="text-xs md:text-sm text-[#ebdcb9]/80 font-light leading-relaxed border-t border-white/5 pt-3.5 italic tracking-wider pl-3">
                              {currentBottle.translation}
                            </p>
                          )}
                        </div>

                        {/* Advice container with fine border styling and golden side indicator */}
                        <div className="bg-[#0b1227]/70 p-4 border-l-2 border-brand-gold/60 border border-white/5 flex gap-3 items-start mt-1.5 relative z-10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]">
                          <Info className="w-3.5 h-3.5 text-brand-gold mt-1 flex-shrink-0" />
                          <div>
                            <span className="text-[9px] font-mono tracking-[0.2em] uppercase block text-[#ebdcb9]/60 mb-0.5 font-semibold">
                              月亮启示 &middot; Lunar Advice
                            </span>
                            <p className="text-xs font-light text-white/90 leading-relaxed tracking-wider">
                              {currentBottle.hint}
                            </p>
                          </div>
                        </div>

                        {/* Card Options with modern elegant styling */}
                        <div className="flex gap-3 justify-end items-center mt-2 pt-4 border-t border-white/10 relative z-10">
                          <button
                            type="button"
                            onClick={() => handleSaveBottle(currentBottle)}
                            className={`px-4 py-2 text-[10px] tracking-widest border font-serif cursor-pointer transition-all duration-300 flex items-center gap-1.5 rounded-none uppercase ${
                              savedSuccessFlag 
                                ? 'bg-[#ebdcb9] text-[#121930] border-[#ebdcb9] font-semibold shadow-[0_4px_12px_rgba(229,203,149,0.25)]' 
                                : 'bg-transparent text-[#ebdcb9] border-[#ebdcb9]/30 hover:border-[#ebdcb9] hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                            {savedSuccessFlag ? '已收藏' : '收藏这颗明珠'}
                          </button>
                          <button
                            type="button"
                            onClick={handleDrawBottle}
                            className="px-4 py-2 text-[10px] bg-gradient-to-r from-[#ffeebc] via-[#ebdcb9] to-[#c5a880] text-[#121930] hover:brightness-105 active:scale-95 transition-all duration-300 tracking-widest font-serif font-semibold cursor-pointer rounded-none uppercase shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                          >
                            再寻一颗
                          </button>
                        </div>

                      </motion.div>
                    ) : (
                      <div className="relative p-8 border border-dashed border-[#e5cb95]/30 bg-[#060a1c]/60 backdrop-blur-md text-center flex flex-col items-center justify-center min-h-[260px] overflow-hidden group/empty">
                        {/* Celestial framing decorators */}
                        <span className="absolute top-2 left-2 text-[8px] text-brand-gold/30">✦</span>
                        <span className="absolute top-2 right-2 text-[8px] text-brand-gold/30">✦</span>
                        <span className="absolute bottom-2 left-2 text-[8px] text-brand-gold/30">✦</span>
                        <span className="absolute bottom-2 right-2 text-[8px] text-brand-gold/30">✦</span>
                        
                        <Waves className="w-8 h-8 text-brand-gold/50 mb-4 animate-pulse duration-[3s]" />
                        <p className="text-xs md:text-[13px] text-[#ebdcb9]/80 tracking-[0.2em] font-light leading-relaxed max-w-sm mb-6">
                          这里飘荡着沧海遗落的夜光明珠。<br />
                          它们只在莹莹微刻中温存提醒，<br />
                          如同月亮圆缺盈亏，<br />
                          你的人生也始终拥有着自己的潮汐频率。
                        </p>
                        <button
                          type="button"
                          onClick={handleDrawBottle}
                          disabled={isDrawing}
                          className="px-6 py-2.5 bg-gradient-to-r from-[#ffeebc]/15 via-[#ebdcb9]/25 to-[#c5a880]/15 text-[#fdf5e2] hover:from-[#ffeebc]/25 hover:via-[#ebdcb9]/35 hover:to-[#c5a880]/25 backdrop-blur-md border border-[#e5cb95]/40 hover:scale-105 active:scale-95 transition-all font-serif text-xs font-semibold tracking-widest uppercase cursor-pointer rounded-none shadow-[0_6px_15px_rgba(0,0,0,0.4)]"
                        >
                          {isDrawing ? '在月波中寻觅...' : '拾明珠'}
                        </button>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            </div>
          </div>

          {/* SECTION 5: 月相与生活节奏说明区 / Dynamic Cards */}
          <div className="w-full max-w-5xl mb-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            <div className="bg-white border border-[#ebdcb9]/40 hover:border-brand-gold/60 p-6 flex flex-col gap-4 group transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold transition-colors group-hover:bg-brand-gold group-hover:text-brand-dark duration-500">
                <Moon className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1.5 font-serif">
                <h4 className="text-base text-[#2c2722] tracking-widest font-semibold">看见月亮</h4>
                <p className="text-[#5c5346] text-xs md:text-sm leading-relaxed tracking-wider font-light">
                  了解今日月相，观察自然周期的变化。宇宙有其运行轨迹，你也是。
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#ebdcb9]/40 hover:border-brand-gold/60 p-6 flex flex-col gap-4 group transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold transition-colors group-hover:bg-brand-gold group-hover:text-brand-dark duration-500">
                <Activity className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1.5 font-serif">
                <h4 className="text-base text-[#2c2722] tracking-widest font-semibold">听见自己</h4>
                <p className="text-[#5c5346] text-xs md:text-sm leading-relaxed tracking-wider font-light">
                  根据月相提示，觉察自己的状态、能量和注意力。在适当的时候全神贯注，而在满月时舒展回首。
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#ebdcb9]/40 hover:border-brand-gold/60 p-6 flex flex-col gap-4 group transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold transition-colors group-hover:bg-brand-gold group-hover:text-brand-dark duration-500">
                <Compass className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1.5 font-serif">
                <h4 className="text-base text-[#2c2722] tracking-widest font-semibold">安排生活</h4>
                <p className="text-[#5c5346] text-xs md:text-sm leading-relaxed tracking-wider font-light">
                  把目标拆成更轻的行动，不让庞大而死板的硬计划消磨探索的热枕。让生活重新生动起来。
                </p>
              </div>
            </div>

          </div>

          {/* SECTION 6: 免责声明 / Bottom Notice info */}
          <div className="w-full max-w-4xl border-t border-[#ebdcb9]/50 pt-10 text-center select-none">
            <p className="text-[10px] md:text-xs font-serif font-light tracking-widest leading-relaxed text-[#8c7b5f] max-w-2xl mx-auto px-6">
              <b>免责声明：</b>本页面基于公开月相知识与生活规划方法设计，内容仅供自我整理、情绪记录和计划参考，不构成医疗、心理、财务或其他专业建议。
            </p>
          </div>

        </div>
      </div>

      {/* Moon Plan Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Card Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative bg-gradient-to-tr from-[#FCF8F2] to-[#FFF9EE] border-2 border-[#e5cb95]/60 max-w-2xl w-full p-8 md:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.65)] overflow-hidden text-[#5c5346] flex flex-col gap-6 z-10 m-4"
            >
              {/* Elegant double thin border line inside the modal card */}
              <div className="absolute inset-2 border border-[#e5cb95]/20 pointer-events-none" />

              {/* Classical Corner Ornamentations */}
              <span className="absolute top-4 left-4 text-[8px] text-[#e5cb95]/50 select-none">✦</span>
              <span className="absolute top-4 right-4 text-[8px] text-[#e5cb95]/50 select-none">✦</span>
              <span className="absolute bottom-4 left-4 text-[8px] text-[#e5cb95]/50 select-none">✦</span>
              <span className="absolute bottom-4 right-4 text-[8px] text-[#e5cb95]/50 select-none">✦</span>

              {/* Header with Title and Close Button */}
              <div className="flex justify-between items-center border-b border-[#ebdcb9]/40 pb-4 relative z-10">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-brand-gold animate-pulse" />
                  <span className="font-serif text-sm font-semibold tracking-widest text-[#2c2722]">
                    {modalMode === 'generate' ? '开启月相整理仪式' : '月下墨笔自省书'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 hover:bg-[#2c2722]/5 text-[#5c5346] hover:text-[#2c2722] transition-colors cursor-pointer text-sm font-mono"
                >
                  ✕
                </button>
              </div>

              {/* Modal Core Content Container */}
              <div className="relative z-10 overflow-y-auto max-h-[70vh] px-1">
                {/* Content will be rendered here dynamically */}
                {modalMode === 'generate' ? (
                  <div className="space-y-6">
                    {/* Stepper Steps Bar */}
                    <div className="flex items-center justify-between max-w-md mx-auto mb-8 relative z-20">
                      {[1, 2, 3, 4, 5].map((step, idx) => (
                        <React.Fragment key={step}>
                          <div className="flex flex-col items-center">
                            <button
                              type="button"
                              onClick={() => setActiveStep(step)}
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-serif transition-all duration-300 cursor-pointer ${
                                activeStep === step
                                  ? 'bg-brand-gold text-brand-dark font-bold border-2 border-brand-dark shadow-sm'
                                  : activeStep > step
                                  ? 'bg-[#2c2722] text-white font-medium'
                                  : 'bg-white text-[#8c7b5f] border border-[#e5cb95]/30'
                              }`}
                            >
                              {step}
                            </button>
                            <span className="text-[9px] mt-1.5 font-serif text-[#8c7a5c] font-medium whitespace-nowrap">
                              {step === 1 ? '设定愿景' : step === 2 ? '最小行动' : step === 3 ? '断舍离' : step === 4 ? '习惯固化' : '自勉寄语'}
                            </span>
                          </div>
                          {idx < 4 && (
                            <div className={`flex-1 h-[1px] -mt-5 transition-colors duration-300 ${
                              activeStep > step ? 'bg-[#2c2722]' : 'bg-[#e5cb95]/20'
                            }`} />
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Step Fields Container */}
                    <div className="min-h-[160px] flex flex-col justify-center">
                      <AnimatePresence mode="wait">
                        {activeStep === 1 && (
                          <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-4 text-left"
                          >
                            <div className="flex flex-col gap-2">
                              <label className="text-sm font-serif tracking-widest text-[#6e5f49] uppercase flex items-center justify-between font-semibold">
                                <span>1. 我在这个周期最想完成的目标</span>
                                <span className="text-[10px] px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 font-sans">设定愿景</span>
                              </label>
                              <textarea
                                value={userGoal}
                                onChange={(e) => setUserGoal(e.target.value)}
                                placeholder="例如：整理积攒的文献资料 / 完成工作室的修缮（不填默认使用诗意模版）"
                                rows={3}
                                className="w-full bg-[#fdfcf9] border border-[#e5cb95]/30 focus:border-brand-gold text-sm md:text-base text-[#2c2722] placeholder-[#8c7a5c]/50 px-4.5 py-3.5 focus:outline-none transition-colors rounded-none font-serif tracking-wider leading-relaxed"
                              />
                            </div>
                          </motion.div>
                        )}

                        {activeStep === 2 && (
                          <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-4 text-left"
                          >
                            <div className="flex flex-col gap-2">
                              <label className="text-sm font-serif tracking-widest text-[#6e5f49] uppercase flex items-center justify-between font-semibold">
                                <span>2. 今天我可以推进的一件小事</span>
                                <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 font-sans">最小行动</span>
                              </label>
                              <textarea
                                value={userTask}
                                onChange={(e) => setUserTask(e.target.value)}
                                placeholder="例如：整理书架上的摄影集，挑出十本分享 / 慢跑半小时"
                                rows={3}
                                className="w-full bg-[#fdfcf9] border border-[#e5cb95]/30 focus:border-brand-gold text-sm md:text-base text-[#2c2722] placeholder-[#8c7a5c]/50 px-4.5 py-3.5 focus:outline-none transition-colors rounded-none font-serif tracking-wider leading-relaxed"
                              />
                            </div>
                          </motion.div>
                        )}

                        {activeStep === 3 && (
                          <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-4 text-left"
                          >
                            <div className="flex flex-col gap-2">
                              <label className="text-sm font-serif tracking-widest text-[#6e5f49] uppercase flex items-center justify-between font-semibold">
                                <span>3. 我需要放下的一件事</span>
                                <span className="text-[10px] px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 font-sans">断舍离</span>
                              </label>
                              <input
                                value={userRelease}
                                onChange={(e) => setUserRelease(e.target.value)}
                                placeholder="例如：推迟非必要的聚餐，不盲目加入外界喧哗"
                                className="w-full bg-[#fdfcf9] border border-[#e5cb95]/30 focus:border-brand-gold text-sm md:text-base text-[#2c2722] placeholder-[#8c7a5c]/50 px-4.5 py-3.5 focus:outline-none transition-colors rounded-none font-serif tracking-wider leading-relaxed"
                              />
                            </div>
                          </motion.div>
                        )}

                        {activeStep === 4 && (
                          <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-4 text-left"
                          >
                            <div className="flex flex-col gap-2">
                              <label className="text-sm font-serif tracking-widest text-[#6e5f49] uppercase flex items-center justify-between font-semibold">
                                <span>4. 我想保留的一件好习惯</span>
                                <span className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 font-sans">习惯固化</span>
                              </label>
                              <input
                                value={userHabit}
                                onChange={(e) => setUserHabit(e.target.value)}
                                placeholder="例如：睡前阅读一首诗、不看电子屏幕"
                                className="w-full bg-[#fdfcf9] border border-[#e5cb95]/30 focus:border-brand-gold text-sm md:text-base text-[#2c2722] placeholder-[#8c7a5c]/50 px-4.5 py-3.5 focus:outline-none transition-colors rounded-none font-serif tracking-wider leading-relaxed"
                              />
                            </div>
                          </motion.div>
                        )}

                        {activeStep === 5 && (
                          <motion.div
                            key="step5"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-4 text-left"
                          >
                            <div className="flex flex-col gap-2">
                              <label className="text-sm font-serif tracking-widest text-[#6e5f49] uppercase flex items-center justify-between font-semibold">
                                <span>5. 写给自己的月相提醒</span>
                                <span className="text-[10px] px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 font-sans">自勉寄语</span>
                              </label>
                              <input
                                value={userReminder}
                                onChange={(e) => setUserReminder(e.target.value)}
                                placeholder="例如：生活本就不需要事事紧绷，慢慢生根发芽亦有风景"
                                className="w-full bg-[#fdfcf9] border border-[#e5cb95]/30 focus:border-brand-gold text-sm md:text-base text-[#2c2722] placeholder-[#8c7a5c]/50 px-4.5 py-3.5 focus:outline-none transition-colors rounded-none font-serif tracking-wider leading-relaxed"
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Stepper Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-4 border-t border-[#e5cb95]/20">
                      <button
                        type="button"
                        disabled={activeStep === 1}
                        onClick={() => setActiveStep(prev => prev - 1)}
                        className={`px-4 py-2 border rounded-none text-xs font-serif tracking-widest transition-all duration-300 ${
                          activeStep === 1
                            ? 'border-[#ebdcb9]/20 text-[#8c7b5f]/30 cursor-not-allowed'
                            : 'border-[#ebdcb9] hover:bg-[#fdfaf5] text-[#5c5346] cursor-pointer'
                        }`}
                      >
                        上一步
                      </button>
                      {activeStep < 5 ? (
                        <button
                          type="button"
                          onClick={() => setActiveStep(prev => prev + 1)}
                          className="px-5 py-2 bg-[#2c2722] text-[#fffcf9] hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 rounded-none text-xs font-serif tracking-widest cursor-pointer"
                        >
                          下一步
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            handleGeneratePlan(e);
                            setModalMode('view');
                          }}
                          className="px-5 py-2 bg-gradient-to-r from-[#ffeebc]/85 to-[#c5a880] text-[#121930] hover:brightness-105 transition-all duration-300 rounded-none text-xs font-serif tracking-widest font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          完成并生成
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="w-full text-left">
                    {generatedPlan ? (
                      <div className="relative p-2 flex flex-col gap-6 text-[#5c5346]">
                        {/* Classic red circular seal mimicry representing Orient Bright Moon signature */}
                        <div className="absolute top-2 right-4 w-16 h-18 rounded-full border-2 border-dashed border-red-500/15 flex items-center justify-center opacity-70 select-none transform rotate-12 pointer-events-none">
                          <span className="font-serif text-[9px] text-red-500/60 tracking-[0.2em] font-bold block text-center leading-snug">
                            朗月<br />印信
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
                          <span className="font-mono text-[9px] text-[#8c7b5f] font-semibold tracking-[0.3em] uppercase">
                            ACTIVE RHYTHM PLAN &middot; 月下墨笔自省
                          </span>
                        </div>

                        <div className="flex justify-between items-baseline border-b border-[#ebdcb9] pb-4">
                          <div className="flex flex-col gap-1 font-serif">
                            <h4 className="text-lg md:text-xl text-[#2c2722] font-semibold tracking-widest pl-0">
                              我的「{generatedPlan.phaseName}」整理清单
                            </h4>
                            <span className="text-[9px] font-sans font-light text-[#8c7b5f] tracking-wider">
                              Created under moonlight &middot; {generatedPlan.date}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-4 font-serif pt-1 text-xs md:text-sm leading-relaxed text-[#4a4135]">
                          <div className="flex items-start gap-4">
                            <span className="font-mono text-xs text-brand-gold tracking-widest font-bold uppercase mt-0.5 w-16 flex-shrink-0 text-left">
                              周期誓约
                            </span>
                            <div className="flex-1 text-[#2c2722] font-light text-xs md:text-sm">
                              {generatedPlan.goal}
                            </div>
                          </div>

                          <div className="flex items-start gap-4">
                            <span className="font-mono text-xs text-brand-gold tracking-widest font-bold uppercase mt-0.5 w-16 flex-shrink-0 text-left">
                              今日推行
                            </span>
                            <div className="flex-1 text-[#2c2722] font-semibold text-xs md:text-sm">
                              {generatedPlan.task}
                            </div>
                          </div>

                          <div className="flex items-start gap-4">
                            <span className="font-mono text-xs text-brand-gold tracking-widest font-bold uppercase mt-0.5 w-16 flex-shrink-0 text-left">
                              整理放下
                            </span>
                            <div className="flex-1 text-[#5c5346] font-light text-xs md:text-sm">
                              {generatedPlan.release}
                            </div>
                          </div>

                          <div className="flex items-start gap-4">
                            <span className="font-mono text-xs text-brand-gold tracking-widest font-bold uppercase mt-0.5 w-16 flex-shrink-0 text-left">
                              守护好习
                            </span>
                            <div className="flex-1 text-[#5c5346] font-light text-xs md:text-sm block">
                              • {generatedPlan.habit}
                            </div>
                          </div>

                          <div className="flex items-start gap-4 border-t border-[#ebdcb9]/40 pt-4 mt-3">
                            <span className="font-mono text-xs text-brand-gold tracking-widest font-bold uppercase mt-0.5 w-16 flex-shrink-0 text-left">
                              寄语叮嘱
                            </span>
                            <div className="flex-1 italic text-[#6e5f49] font-light text-xs md:text-sm pl-3 border-l-2 border-brand-gold">
                              “{generatedPlan.reminder}”
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 flex gap-3 border-t border-[#ebdcb9]/40 pt-5 justify-end relative z-10">
                          <button
                            type="button"
                            onClick={handleResetPlan}
                            className="px-4 py-2 bg-white hover:bg-[#fdfaf5] text-[#5c5346] border border-[#ebdcb9] rounded-none text-xs font-serif tracking-widest flex items-center gap-1.5 cursor-pointer transition-all duration-300"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            废置旧案
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const formatted = `【月之谕计划清单 - ${generatedPlan.phaseName}】\n一、周期目标：${generatedPlan.goal}\n二、今日推进：${generatedPlan.task}\n三、心离舍弃：${generatedPlan.release}\n四、每日好习惯：${generatedPlan.habit}\n五、月相寄语：${generatedPlan.reminder}\n\n跟随大自然呼吸，自审以行远。`;
                              navigator.clipboard.writeText(formatted);
                              alert('计划内容已复制到剪切板，您可在手机备忘录或日记中粘贴存档！诚挚祝愿您的生活回归和谐呼吸。');
                            }}
                            className="px-5 py-2 bg-[#2c2722] text-[#fffcf9] font-semibold hover:bg-brand-gold hover:text-brand-dark transition-colors duration-300 rounded-none text-xs font-serif tracking-widest flex items-center gap-1.5 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5 text-brand-gold" />
                            复制分享手抄本
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="min-h-[260px] border border-dashed border-[#e5cb95]/40 flex flex-col items-center justify-center p-6 text-center text-[#8c7b5f]/40 bg-[#fdfaf5]/30 font-serif">
                        <div className="w-10 h-10 rounded-full border border-[#e5cb95]/40 flex items-center justify-center mb-4 text-brand-gold animate-pulse">
                          <FileText className="w-5 h-5" />
                        </div>
                        <span className="text-xs md:text-sm font-semibold tracking-[0.2em] text-[#2c2722] mb-1.5">
                          虚怀若谷 &middot; 待写纸张
                        </span>
                        <p className="max-w-[320px] text-[11px] leading-relaxed tracking-wider text-[#5c5346]/70 font-light font-sans mb-5">
                          您目前尚未生成或保存月相计划。请跟着步骤条，伴着这片祥和的光辉开始自我梳理。
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setModalMode('generate');
                            setActiveStep(1);
                          }}
                          className="px-5 py-2 bg-[#2c2722] text-white hover:bg-brand-gold hover:text-brand-dark rounded-none text-xs tracking-widest cursor-pointer font-serif transition-colors duration-300"
                        >
                          开始制定月相计划
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
