"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface SplashScreenProps {
  duration?: number; // duração da animação em ms
}

const SplashScreen = ({ duration }: SplashScreenProps) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false); // some depois de x ms
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white"
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: 1 } }}
          exit={{ opacity: 0, scale: 1.1, transition: { duration: 1 } }}
        >
          <Image
            src="/NasaFullLogo.png"
            sizes="100vw"
            className="w-40 sm:w-56 md:w-72 h-auto"
            alt="Splash"
            width={300}
            height={300}
          />
          <Image
            src="/SoftwareMasons.png"
            alt="Splash"
            width={300}
            height={300}
            sizes="100vw"
            className="w-40 sm:w-56 md:w-72 h-auto"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
