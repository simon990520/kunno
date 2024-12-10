'use client';

import { motion } from "framer-motion";

export default function AnimatedFeatures() {
  return (
    <div className="grid grid-cols-3 gap-8 mt-20">
      {/* Note Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <div className="bg-yellow-100 w-12 h-12 rounded-lg mb-4 flex items-center justify-center">
          <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Take notes</h3>
        <p className="text-gray-600">Keep track of crucial details and accomplish more tasks with ease.</p>
      </motion.div>

      {/* Tasks Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <div className="bg-blue-100 w-12 h-12 rounded-lg mb-4 flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Today's tasks</h3>
        <p className="text-gray-600">Track your daily progress and stay on top of deadlines.</p>
      </motion.div>

      {/* Integrations Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <div className="bg-green-100 w-12 h-12 rounded-lg mb-4 flex items-center justify-center">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">100+ Integrations</h3>
        <p className="text-gray-600">Connect with your favorite tools and boost your workflow.</p>
      </motion.div>
    </div>
  );
}
