import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const SplashScreen: React.FC = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-white">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <img 
          src="https://shop.zuppa.io/static/media/ZuppaLogo.ad518d12027126fa7f78.png" 
          alt="Zuppa Logo" 
          className="h-16 mb-6"
        />
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-200 mb-8"
        >
          Product Management Platform
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
