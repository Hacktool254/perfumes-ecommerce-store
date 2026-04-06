"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const FRAME_COUNT = 190;
const currentFrame = (index: number) => 
  `/images/yara-webp/ezgif-frame-${index.toString().padStart(3, '0')}.webp`;

export function Hero() {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [bgColor, setBgColor] = useState<string>("#e7bcc6");
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

  useEffect(() => {
    // Preload images
    const loadedImages: HTMLImageElement[] = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  useEffect(() => {
    if (images.length === 0 || !canvasRef.current) return;
    
    // Sample background color immediately from the first frame once it's loaded
    const checkFirstFrame = () => {
      const img = images[0];
      if (img && img.complete && img.naturalWidth > 0) {
        try {
          const tmp = document.createElement('canvas');
          tmp.width = 1; tmp.height = 1;
          const tCtx = tmp.getContext('2d');
          if (tCtx) {
            tCtx.drawImage(img, 0, 0, 1, 1, 0, 0, 1, 1);
            const data = tCtx.getImageData(0, 0, 1, 1).data;
            const sampled = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
            setBgColor(sampled);
          }
        } catch (e) {
          // ignore CORS or other canvas errors 
        }
      } else {
        setTimeout(checkFirstFrame, 100);
      }
    };
    checkFirstFrame();

    let animationFrameId: number;
    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Handle High-DPI screens securely for perfect sharpness
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      // Update canvas dimensions if they don't match the display size
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
          canvas.width = rect.width * dpr;
          canvas.height = rect.height * dpr;
          ctx.scale(dpr, dpr);
      }

      // Optimize image sharpness logic
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const frame = Math.min(FRAME_COUNT - 1, Math.max(0, Math.floor(frameIndex.get())));
      const img = images[frame];
      
      if (img && img.complete && img.naturalWidth > 0) {
        
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = rect.width / rect.height;
        
        let drawWidth, drawHeight, x, y;
        
        // Exact "Cover" Logic -> Ensures animation fills the entire screen, 
        // completely eliminating borders on mobile and desktop
        if (imgRatio > canvasRatio) {
          // Image is relatively wider than the screen (e.g. landscape image on a mobile portrait screen)
          // Fit height and crop the sides
          drawHeight = rect.height;
          drawWidth = rect.height * imgRatio;
          x = (rect.width - drawWidth) / 2;
          y = 0;
        } else {
          // Image is taller than the screen (e.g. portrait image on an ultra-wide desktop)
          // Fit width and crop top/bottom
          drawWidth = rect.width;
          drawHeight = rect.width / imgRatio;
          x = 0;
          y = (rect.height - drawHeight) / 2;
        }

        ctx.drawImage(img, x, y, drawWidth, drawHeight);
      }
      
      animationFrameId = requestAnimationFrame(render);
    };

    const loop = () => {
        render();
    };
    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [images, frameIndex, bgColor]);

  // Framer motion text overlays mapping scroll progress
  
  // Intro (0 to 0.2)
  const opacity1 = useTransform(scrollYProgress, [0, 0.05, 0.15, 0.20], [1, 1, 0, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.2], [0, -40]);

  // Chapter 1 (0.25 to 0.45)
  const opacity2 = useTransform(scrollYProgress, [0.2, 0.3, 0.4, 0.5], [0, 1, 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.2, 0.5], [40, -40]);

  // Chapter 2 (0.5 to 0.70)
  const opacity3 = useTransform(scrollYProgress, [0.45, 0.55, 0.65, 0.75], [0, 1, 1, 0]);
  const y3 = useTransform(scrollYProgress, [0.45, 0.75], [40, -40]);

  // Final CTA (0.75 to 1.0)
  const opacity4 = useTransform(scrollYProgress, [0.70, 0.85, 1, 1], [0, 1, 1, 1]);
  const y4 = useTransform(scrollYProgress, [0.70, 1], [40, 0]);

  // Dynamically setting the container background ensures seamless loading and transition margins
  return (
    <div ref={containerRef} className="relative w-full h-[800vh] bg-transition transition-colors duration-500" style={{ backgroundColor: bgColor }}>
      {/* Sticky Sequence Container */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10 block" />

        {/* Text Overlays - On top of Canvas */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          
          {/* Section 1 - Title at center, Shop Now at bottom */}
          <motion.div style={{ opacity: opacity1, y: y1 }} className="absolute inset-0 flex flex-col items-center justify-between py-[15vh] md:py-0 md:justify-center drop-shadow-2xl">
            <div className="flex flex-col items-center text-center px-4 md:absolute md:top-[20%] md:inset-x-0">
              <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-black uppercase text-neutral-900 drop-shadow-[0_5px_15px_rgba(255,255,255,0.8)] leading-[0.9]">
                Ummie&apos;s Essence
              </h1>
              <p className="mt-4 text-lg md:text-2xl text-neutral-800 font-medium tracking-wide w-auto mx-auto bg-white/40 backdrop-blur-sm px-6 py-2 rounded-full border border-white/60">
                Timeless Fragrances
              </p>
            </div>
            {/* Shop Now pinned to bottom center on mobile (red box area) */}
            <div className="pointer-events-auto md:absolute md:bottom-[18%] md:inset-x-0 md:flex md:justify-center">
              <Link
                href="/shop"
                className="btn-lattafa-primary btn-lattafa-ghost btn-pill font-fredoka shadow-lg inline-flex items-center"
              >
                SHOP NOW
                <ArrowRight className="w-4 h-4 ml-2 btn-arrow" />
              </Link>
            </div>
          </motion.div>

          {/* Section 2 - Upper portion of screen on mobile */}
          <motion.div style={{ opacity: opacity2, y: y2 }} className="absolute top-[12%] md:top-auto inset-x-0 flex flex-col items-center text-center px-6 md:inset-0 md:flex md:items-center md:justify-center md:text-left">
            <div className="md:absolute md:left-[5%] md:px-24 md:max-w-xl md:items-start md:text-left flex flex-col items-center md:flex-col">
              <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-black uppercase text-neutral-900 drop-shadow-[0_5px_15px_rgba(255,255,255,0.8)] leading-[0.9]">
                Symphony<br />of Florals.
              </h2>
              <p className="mt-6 text-sm sm:text-base md:text-lg text-neutral-800 font-medium tracking-wide drop-shadow-md max-w-[300px] bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white/60">
                A sensual blend of rich amber and sweet vanilla that lingers elegantly on the skin.
              </p>
            </div>
          </motion.div>

          {/* Section 3 - Pushed down on mobile (yellow box area) to avoid collision with Section 2 */}
          <motion.div style={{ opacity: opacity3, y: y3 }} className="absolute bottom-[8%] md:bottom-auto inset-x-0 flex flex-col items-center text-center px-6 md:inset-0 md:flex md:items-center md:justify-center md:text-right">
            <div className="md:absolute md:right-[5%] md:px-24 md:max-w-xl md:items-end md:text-right flex flex-col items-center md:flex-col">
              <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-black uppercase text-neutral-900 drop-shadow-[0_5px_15px_rgba(255,255,255,0.8)] leading-[0.9]">
                Timeless<br/>Allure.
              </h2>
              <p className="mt-6 text-sm sm:text-base md:text-lg text-neutral-800 font-medium tracking-wide drop-shadow-md max-w-[300px] bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white/60">
                Leave an unforgettable trail wherever you go. Designed for the modern enchantress.
              </p>
            </div>
          </motion.div>

          {/* Section 4 - Final CTA */}
          <motion.div style={{ opacity: opacity4, y: y4 }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 drop-shadow-2xl z-30">
            <h2 className="font-serif text-5xl sm:text-7xl md:text-8xl font-black uppercase text-neutral-900 drop-shadow-[0_5px_15px_rgba(255,255,255,0.8)] leading-[0.9] mb-6">
              The Ultimate Aura.
            </h2>
            <div className="pointer-events-auto">
              <Link
                href="/shop"
                className="btn-lattafa-primary btn-lattafa-ghost btn-pill font-fredoka shadow-2xl inline-flex items-center scale-110"
              >
                SHOP YARA NOW
                <ArrowRight className="w-5 h-5 ml-2 btn-arrow" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
