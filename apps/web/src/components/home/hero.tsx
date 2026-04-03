"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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
      transition: { type: "spring" as const, damping: 12, stiffness: 200 },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: { type: "spring" as const, damping: 12, stiffness: 200 },
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
    <section className="relative h-[calc(100vh-16px)] md:h-[calc(100vh-32px)] w-full overflow-hidden bg-[#F8DFE1] m-2 md:m-4 rounded-[2rem] shadow-[0_10px_40px_rgba(200,123,158,0.2)]">
      
      {/* Typewriter Title block, placed nicely within the hero layout */}
      <div className="absolute top-[35%] md:top-[40%] left-0 w-full flex flex-col items-center justify-center z-30 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(5px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(5px)' }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col items-center px-4"
          >
            <div 
              className="text-[#b38466] leading-[0.85] drop-shadow-sm font-normal text-center text-[5.5rem] sm:text-[7.5rem] md:text-[9.5rem] lg:text-[11rem] tracking-normal md:capitalize flex flex-col md:flex-row md:gap-x-8"
              style={{ fontFamily: "var(--font-script, 'Great Vibes', cursive)" }}
            >
              <TypewriterText text="Ummie Essence" />
            </div>
            <div className="text-[#8e6b54] text-xs sm:text-sm md:text-[1.1rem] tracking-[0.25em] font-medium mt-6 md:mt-8 uppercase drop-shadow-sm italic text-center">
              <TypewriterText text="Timeless Fragrances" delay={1.0} />
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
        />
        {/* Subtle pink tint to blend water with the overall theme (#F8DFE1 / #D2929B) */}
        <div className="absolute inset-0 mix-blend-color pointer-events-none opacity-40 bg-[#D2929B]"></div>
      </div>

      {/* Perfume Videos Carousel */}
      <div className="absolute inset-0 z-[5] overflow-hidden pointer-events-none opacity-85">
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

      {/* Pink Ground Overlay - Underwater Effect (adapted to use current theme #D2929B and #b38466) */}
      <div className="absolute bottom-0 left-0 w-full h-[45%] md:h-[55%] z-20 pointer-events-none">
        <div 
          className="absolute inset-0 mix-blend-color opacity-80"
          style={{ background: 'linear-gradient(to top, #D2929B 0%, #D2929B 60%, transparent 100%)' }}
        ></div>
        <div 
          className="absolute inset-0 mix-blend-overlay opacity-90"
          style={{ background: 'linear-gradient(to top, #b38466 0%, rgba(210, 146, 155, 0.7) 60%, transparent 100%)' }}
        >
          <div className="absolute inset-0 opacity-40 mix-blend-multiply" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/asfalt-light.png")' }}></div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/40 to-transparent mix-blend-multiply"></div>
      </div>

      {/* Mobile Call to Action */}
      <div className="absolute bottom-12 left-0 w-full z-40 flex justify-center md:hidden px-6 pointer-events-auto">
        <button className="bg-white/30 backdrop-blur-md border border-white/40 text-[#5C4D42] px-8 py-4 rounded-full font-bold tracking-[0.2em] text-sm shadow-xl active:scale-95 transition-all w-full max-w-[280px] hover:bg-white/40">
          SHOP COLLECTION
        </button>
      </div>

    </section>
  );
}
