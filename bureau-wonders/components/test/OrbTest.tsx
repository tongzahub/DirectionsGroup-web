'use client';

import { motion } from 'framer-motion';

export default function OrbTest() {
  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-white z-50 flex items-center justify-center">
      <div className="relative w-full h-full overflow-hidden">
        {/* Simple Visible Orb Test */}
        <motion.div
          className="absolute w-64 h-64 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.6), rgba(212, 175, 55, 0.2) 50%, transparent 80%)',
            left: '20%',
            top: '20%',
            filter: 'blur(20px)',
          }}
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -50, 100, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute w-48 h-48 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(205, 133, 63, 0.5), rgba(205, 133, 63, 0.15) 50%, transparent 80%)',
            right: '20%',
            top: '30%',
            filter: 'blur(25px)',
          }}
          animate={{
            x: [0, -80, 60, 0],
            y: [0, 80, -40, 0],
            scale: [0.8, 1.1, 0.9, 0.8],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        
        <motion.div
          className="absolute w-56 h-56 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(184, 134, 11, 0.4), rgba(184, 134, 11, 0.1) 50%, transparent 80%)',
            left: '50%',
            bottom: '20%',
            filter: 'blur(30px)',
          }}
          animate={{
            x: [0, 70, -70, 0],
            y: [0, -60, 40, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
        
        {/* Test Text */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-neutral-900 mb-4">
              Orb Test
            </h1>
            <p className="text-xl text-neutral-700 mb-8">
              คุณเห็น Orb สีทองและสีน้ำตาลเคลื่อนไหวหรือไม่?
            </p>
            <button 
              onClick={() => window.location.href = '/about'}
              className="px-8 py-4 bg-gradient-to-r from-accent-gold to-accent-gold-light text-neutral-900 font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
            >
              กลับไปหน้า About
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}