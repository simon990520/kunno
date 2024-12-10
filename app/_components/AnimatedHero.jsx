'use client';

import { motion } from "framer-motion";

export default function AnimatedHero() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-16"
    >
      <h1 className="text-6xl font-bold mb-4">
        Think, plan, and track
        <span className="block text-gray-400 mt-2">all in one place</span>
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
        Efficiently manage your tasks and boost productivity.
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Get free demo
      </motion.button>
    </motion.div>
  );
}
