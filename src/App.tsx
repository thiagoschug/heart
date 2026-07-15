import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Lock, Heart as HeartIcon, Sparkles, Volume2, VolumeX } from 'lucide-react';
import TextHeart from './components/TextHeart';

const Typewriter = ({ text, delay = 50, onComplete }: { text: string, delay?: number, onComplete?: () => void }) => {
  const [currentText, setCurrentText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prev => prev + text[index]);
        setIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [index, text, delay, onComplete]);

  return <span className="font-mono">{currentText}</span>;
};

export default function App() {
  const [stage, setStage] = useState<'console' | 'reveal'>('console');
  const [consoleFinished, setConsoleFinished] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleReveal = useCallback(() => {
    if (stage === 'console' && consoleFinished) {
      setStage('reveal');
    }
  }, [stage, consoleFinished]);

  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => {
        // navegador pode bloquear até haver mais interação, tudo bem
      });
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setMuted(audioRef.current.muted);
    }
  };

  return (
    <div
      onClick={handleReveal}
      className={`relative min-h-screen w-full flex items-center justify-center bg-[#050505] selection:bg-pink-deep/30 ${stage === 'console' && consoleFinished ? 'cursor-pointer' : ''}`}
    >
      <audio ref={audioRef} src="/love.mp3" loop />

      {stage === 'reveal' && (
        <button
          onClick={toggleMute}
          className="absolute top-6 right-6 z-30 text-white/30 hover:text-white/70 transition-colors"
          aria-label="mute"
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}

      <div className="scanline" />

      <AnimatePresence mode="wait">
        {stage === 'console' ? (
          <motion.div
            key="console"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full max-w-2xl p-8 font-mono text-sm md:text-base text-white/80"
          >
            <div className="space-y-2">
              <div className="flex gap-2 text-pink-soft/60">
                <span>[system]</span>
                <Typewriter
                  text="Initializing heart.PROTOCOL_v2.0..."
                  delay={30}
                  onComplete={() => setConsoleFinished(true)}
                />
              </div>

              <div className="flex gap-2 h-6">
                <span>[status]</span>
                {consoleFinished && (
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-green-400"
                    >
                        READY
                    </motion.span>
                )}
              </div>

              {consoleFinished && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-8 flex flex-col items-start gap-6"
                >
                  <p className="text-white/40 italic">
                    {">"} One encrypted package found for you.
                  </p>

                  <button
                    id="decrypt-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      startMusic();
                      setStage('reveal');
                    }}
                    className="group flex items-center gap-3 px-6 py-3 border border-pink-deep/30 bg-pink-deep/5 hover:bg-pink-deep/10 text-pink-soft transition-all duration-300 pointer-events-auto"
                  >
                    <Lock size={16} className="group-hover:rotate-12 transition-transform" />
                    <span className="font-mono tracking-widest uppercase text-xs">Decrypt Message</span>
                    <span className="terminal-cursor" />
                  </button>

                  <p className="text-[10px] text-white/20 animate-pulse">
                    (or just click anywhere)
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative w-full h-screen flex items-center justify-center overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                scale: [1, 1.08, 1],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <TextHeart />
            </motion.div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 3, duration: 1.5 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center"
            >
              <h2 className="text-pink-deep font-mono text-xl tracking-[0.3em] uppercase glow-text mb-2">
                Decrypted
              </h2>
              <div className="w-12 h-px bg-pink-deep/30 mx-auto mb-8" />

              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setStage('console');
                }}
                className="text-white/20 hover:text-white/60 transition-colors uppercase text-[10px] tracking-widest font-mono"
              >
                Re-encrypt
              </motion.button>
            </motion.div>

            <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-[10px] font-mono text-white/10 uppercase tracking-widest">
              <div>ln: 420</div>
              <div>id: 0xDEADBEEF</div>
              <div>type: organic_emotion</div>

              <motion.h2
                className="mt-2 text-pink-deep font-mono text-xl tracking-[0.3em] uppercase glow-text"
                animate={{
                  y: [0, -8, 0, 8, 0],
                  scale: [1, 1.05, 1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Eu te amo Piantra ❤
              </motion.h2>
            </div>

            <div className="absolute bottom-8 right-8 text-[10px] font-mono text-white/10 uppercase tracking-widest">
                heart_reveal // success
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}