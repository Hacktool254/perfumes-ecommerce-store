"use client";

import { User, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const perfumeVideos = [
  { src: '/perfume1.mp4', title: 'EAU DE PARFUM' },
  { src: '/perfume2.mp4', title: 'ESSENCE NOIRE' },
  { src: '/perfume3.mp4', title: 'VELVET ROSE' }
];

const TypewriterText = ({ text, delay = 0 }: { text: string, delay?: number }) => {
  const words = text.split(" ");
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: delay },
    },
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 200,
      },
    },
  };

  return (
    <motion.div
      className="flex flex-wrap justify-center gap-x-[0.3em]"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="flex whitespace-nowrap">
          {Array.from(word).map((letter, letterIndex) => (
            <motion.span variants={child} key={letterIndex}>
              {letter}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.div>
  );
};

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    perfumeVideos.forEach((_, index) => {
      const vid = videoRefs.current[index];
      if (vid) {
        if (index === activeIndex) {
          vid.currentTime = 0;
          vid.play().catch(e => console.log("Autoplay blocked", e));
        } else {
          vid.pause();
        }
      }
    });
  }, [activeIndex]);

  const handleVideoEnd = () => {
    setActiveIndex((prev) => (prev + 1) % perfumeVideos.length);
  };

  return (
    <div className="w-full relative overflow-hidden h-[calc(100vh-16px)] md:h-[calc(100vh-32px)]">
      {/* Center Title (Replaces Logo) */}
      <div className="absolute top-[35%] md:top-[40%] left-0 w-full flex flex-col items-center justify-center z-30 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {/* Desktop: 2 lines total | Mobile: 3 lines total */}
            <div className="text-white font-serif text-3xl md:text-5xl lg:text-7xl tracking-[0.15em] md:tracking-[0.2em] font-bold drop-shadow-2xl uppercase text-center leading-tight flex flex-col md:flex-row md:gap-x-6">
              <div className="md:inline-block">
                <TypewriterText text="UMMIES" />
              </div>
              <div className="md:inline-block">
                <TypewriterText text="ESSENCE" delay={0.4} />
              </div>
            </div>
            <div className="text-white/90 text-xs md:text-base lg:text-xl tracking-[0.3em] md:tracking-[0.5em] mt-3 md:mt-5 font-light italic text-center drop-shadow-lg">
              <TypewriterText text="Timeless Fragrance" delay={1.0} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            src="/background.mp4"
            className="w-full h-full object-cover"
            loop
            playsInline
            autoPlay
            muted
            onError={() => console.log("Video failed to load. Please ensure background.mp4 is in the public folder.")}
          />
          {/* Subtle pink tint to blend water with the overall theme */}
          <div className="absolute inset-0 bg-pink-400/20 mix-blend-color pointer-events-none"></div>
        </div>

        {/* Perfume Videos Carousel (Above water, below UI overlays) */}
        <div className="absolute inset-0 z-[5] overflow-hidden pointer-events-none opacity-80">
          {perfumeVideos.map((video, index) => {
            let transformClass = 'translate-x-full';
            if (index === activeIndex) transformClass = 'translate-x-0';
            else if (index === (activeIndex - 1 + perfumeVideos.length) % perfumeVideos.length) transformClass = '-translate-x-full';
            
            return (
              <video
                key={video.src}
                ref={el => { videoRefs.current[index] = el; }}
                src={video.src}
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-in-out ${transformClass}`}
                onEnded={handleVideoEnd}
                playsInline
                muted
              />
            );
          })}
        </div>

        {/* Pink Ground Overlay - Underwater Effect */}
        <div className="absolute bottom-0 left-0 w-full h-[45%] md:h-[55%] z-20 pointer-events-none">
          {/* Base color blend to tint the water */}
          <div 
            className="absolute inset-0 mix-blend-color opacity-90"
            style={{
              background: 'linear-gradient(to top, #c87b9e 0%, #c87b9e 50%, transparent 100%)',
            }}
          ></div>
          
          {/* Texture and contrast blend to show water ripples over the ground */}
          <div 
            className="absolute inset-0 mix-blend-overlay opacity-100"
            style={{
              background: 'linear-gradient(to top, #b66a8c 0%, rgba(182, 106, 140, 0.8) 60%, transparent 100%)',
            }}
          >
            <div className="absolute inset-0 opacity-50 mix-blend-multiply" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/asfalt-light.png")' }}></div>
          </div>

          {/* Depth shadow at the very bottom for realism */}
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/50 to-transparent mix-blend-multiply"></div>
        </div>



        {/* Mobile Call to Action */}
        <div className="absolute bottom-12 left-0 w-full z-40 flex justify-center md:hidden px-6">
          <button className="bg-white/20 backdrop-blur-lg border border-white/40 text-white px-8 py-4 rounded-full font-bold tracking-[0.2em] text-sm shadow-2xl active:scale-95 transition-all w-full max-w-[280px] hover:bg-white/30">
            SHOP COLLECTION
          </button>
        </div>
    </div>
  );
}
