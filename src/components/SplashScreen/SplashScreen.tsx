"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface SplashScreenProps {
  duration?: number; // total duration of the splash screen in ms
}

const SplashScreen = ({ duration = 2500 }: SplashScreenProps) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[9999] flex items-center justify-center gap-8 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.8 } }}
          exit={{ opacity: 0, scale: 1.05, transition: { duration: 1.2 } }}
        >
          {/* NASA Logo */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.2, duration: 1 },
            }}
            exit={{ opacity: 0, y: -50, transition: { duration: 1 } }}
          >
            <Image
              src="/NasaFullLogo.png"
              alt="Nasa Logo"
              width={300}
              height={300}
              sizes="100vw"
              className="w-40 sm:w-56 md:w-72 h-auto"
            />
          </motion.div>

          {/* Software Masons Logo */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.4, duration: 1 },
            }}
            exit={{ opacity: 0, y: -50, transition: { duration: 1 } }}
          >
            <Image
              src="/SoftwareMasons.png"
              alt="Software Masons Logo"
              width={300}
              height={300}
              sizes="100vw"
              className="w-40 sm:w-56 md:w-72 h-auto"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;