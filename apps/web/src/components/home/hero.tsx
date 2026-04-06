"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/* ─── Frame config ─── */
const TOTAL_FRAMES = 188;
const BATCH_SIZE = 20;            // frames per background batch
const INITIAL_BATCH = 20;         // frames loaded before reveal
const frameSrc = (i: number) =>
  `/images/sequence-webp/${String(i).padStart(6, '0')}.webp`;

/* ─── Helper: load a single image as a promise ─── */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/* ─── Helper: load images in batch, updating a shared array ─── */
async function loadBatch(
  start: number,
  end: number,
  target: HTMLImageElement[],
  onProgress?: () => void
) {
  const promises: Promise<void>[] = [];
  for (let i = start; i < end && i < TOTAL_FRAMES; i++) {
    promises.push(
      loadImage(frameSrc(i)).then((img) => {
        target[i] = img;
        onProgress?.();
      })
    );
  }
  await Promise.all(promises);
}

export function Hero() {
  const [isReady, setIsReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [bgColor, setBgColor] = useState<string>("#e7bcc6");

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>(new Array(TOTAL_FRAMES));
  const loadedCountRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, TOTAL_FRAMES - 1]);

  /* ─── Chunked preloading ─── */
  useEffect(() => {
    let cancelled = false;
    const images = imagesRef.current;

    const runLoader = async () => {
      // Phase 1: Load first INITIAL_BATCH frames (critical path)
      await loadBatch(0, INITIAL_BATCH, images, () => {
        loadedCountRef.current++;
        setLoadProgress(Math.round((loadedCountRef.current / INITIAL_BATCH) * 100));
      });

      if (cancelled) return;

      // Sample bg color from first frame
      try {
        const first = images[0];
        if (first) {
          const tmp = document.createElement('canvas');
          tmp.width = 1; tmp.height = 1;
          const tCtx = tmp.getContext('2d');
          if (tCtx) {
            tCtx.drawImage(first, 0, 0, 1, 1, 0, 0, 1, 1);
            const d = tCtx.getImageData(0, 0, 1, 1).data;
            setBgColor(`rgb(${d[0]}, ${d[1]}, ${d[2]})`);
          }
        }
      } catch { /* ignore */ }

      // Reveal the animation
      setIsReady(true);

      // Phase 2: Load remaining frames in background batches
      for (let start = INITIAL_BATCH; start < TOTAL_FRAMES; start += BATCH_SIZE) {
        if (cancelled) return;
        await loadBatch(start, start + BATCH_SIZE, images);
        // Small yield between batches so we don't choke the main thread
        await new Promise(r => setTimeout(r, 50));
      }
    };

    runLoader();
    return () => { cancelled = true; };
  }, []);

  /* ─── Canvas render loop ─── */
  useEffect(() => {
    if (!isReady || !canvasRef.current) return;

    let animationFrameId: number;
    const images = imagesRef.current;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // High-DPI scaling
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const frame = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.floor(frameIndex.get())));
      const img = images[frame];

      if (img && img.complete && img.naturalWidth > 0) {
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = rect.width / rect.height;

        let drawWidth: number, drawHeight: number, x: number, y: number;

        // "Cover" logic — fill entire viewport, crop overflow
        if (imgRatio > canvasRatio) {
          drawHeight = rect.height;
          drawWidth = rect.height * imgRatio;
          x = (rect.width - drawWidth) / 2;
          y = 0;
        } else {
          drawWidth = rect.width;
          drawHeight = rect.width / imgRatio;
          x = 0;
          y = (rect.height - drawHeight) / 2;
        }

        ctx.drawImage(img, x, y, drawWidth, drawHeight);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isReady, frameIndex]);

  /* ─── Scroll-driven text overlays ─── */

  // Intro (0 → 0.2)
  const opacity1 = useTransform(scrollYProgress, [0, 0.05, 0.15, 0.20], [1, 1, 0, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.2], [0, -40]);

  // Chapter 1 (0.25 → 0.45)
  const opacity2 = useTransform(scrollYProgress, [0.2, 0.3, 0.4, 0.5], [0, 1, 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.2, 0.5], [40, -40]);

  // Chapter 2 (0.5 → 0.70)
  const opacity3 = useTransform(scrollYProgress, [0.45, 0.55, 0.65, 0.75], [0, 1, 1, 0]);
  const y3 = useTransform(scrollYProgress, [0.45, 0.75], [40, -40]);

  // Final CTA (0.75 → 1.0)
  const opacity4 = useTransform(scrollYProgress, [0.70, 0.85, 1, 1], [0, 1, 1, 1]);
  const y4 = useTransform(scrollYProgress, [0.70, 1], [40, 0]);

  return (
    <div ref={containerRef} className="relative w-full h-[800vh] transition-colors duration-500" style={{ backgroundColor: bgColor }}>
      {/* Sticky viewport */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">

        {/* Loading overlay — elegant fade with progress */}
        <AnimatePresence>
          {!isReady && (
            <motion.div
              key="loader"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center"
              style={{ backgroundColor: bgColor }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-6"
              >
                <h2 className="font-serif text-4xl sm:text-5xl font-black uppercase text-neutral-900/80 tracking-wide">
                  Ummie&apos;s Essence
                </h2>
                {/* Progress bar */}
                <div className="w-48 h-[3px] bg-neutral-900/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-neutral-900/40 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${loadProgress}%` }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10 block" />

        {/* Text Overlays — only visible after ready */}
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isReady ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Section 1 — Title + Shop Now */}
          <motion.div style={{ opacity: opacity1, y: y1 }} className="absolute inset-0 flex flex-col items-center justify-between py-[15vh] md:py-0 md:justify-center drop-shadow-2xl">
            <div className="flex flex-col items-center text-center px-4 md:absolute md:top-[20%] md:inset-x-0">
              <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-black uppercase text-neutral-900 drop-shadow-[0_5px_15px_rgba(255,255,255,0.8)] leading-[0.9]">
                Ummie&apos;s Essence
              </h1>
              <p className="mt-4 text-lg md:text-2xl text-neutral-800 font-medium tracking-wide w-auto mx-auto bg-white/40 backdrop-blur-sm px-6 py-2 rounded-full border border-white/60">
                Timeless Fragrances
              </p>
            </div>
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

          {/* Section 2 — Symphony of Florals */}
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

          {/* Section 3 — Timeless Allure */}
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

          {/* Section 4 — Final CTA */}
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
        </motion.div>
      </div>
    </div>
  );
}
