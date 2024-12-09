'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { HiAcademicCap, HiBookOpen, HiClipboardList, HiPlay } from 'react-icons/hi';
import VideoPlayer from '@/app/create-course/_components/VideoPlayer';
import { fadeInUp, containerVariants, itemVariants } from '@/utils/animations';

export default function CourseDetails({ course }) {
  const [activeTab, setActiveTab] = useState('overview');
  const videoId = course.videoData?.videoId;

  const tabs = [
    { id: 'overview', name: 'Vista General', icon: HiAcademicCap },
    { id: 'subjects', name: 'Materias', icon: HiBookOpen },
    { id: 'notes', name: 'Apuntes', icon: HiClipboardList },
    { id: 'video', name: 'Video', icon: HiPlay },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <motion.div
            {...fadeInUp}
            className="space-y-6"
          >
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Acerca del Curso</h3>
              <p className="text-gray-600">{course.courseOutput.course.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h4 className="font-medium mb-2">Categoría</h4>
                <p className="text-gray-600">{course.category}</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h4 className="font-medium mb-2">Instructor</h4>
                <p className="text-gray-600">{course.createdBy || 'No especificado'}</p>
              </div>
            </div>
          </motion.div>
        );

      case 'subjects':
        return (
          <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {course.subjects.map((subject, index) => (
              <motion.div
                key={subject}
                variants={itemVariants}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <h3 className="font-medium text-lg mb-2">{subject}</h3>
                <p className="text-sm text-gray-500">
                  Material relacionado con {subject.toLowerCase()}
                </p>
              </motion.div>
            ))}
          </motion.div>
        );

      case 'notes':
        return (
          <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-4"
          >
            {course.notes.map((note, index) => (
              <motion.div
                key={note.id}
                variants={itemVariants}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-orange-600">
                    {course.subjects.find(s => s === note.subjectId) || 'General'}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600 whitespace-pre-wrap">{note.content}</p>
              </motion.div>
            ))}
          </motion.div>
        );

      case 'video':
        return (
          <motion.div
            {...fadeInUp}
            className="space-y-6"
          >
            <VideoPlayer
              videoId={videoId}
              title={course.videoData?.title}
            />
            {course.videoData && (
              <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
                <h3 className="text-xl font-semibold">{course.videoData.title}</h3>
                <p className="text-gray-600">{course.videoData.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Canal: {course.videoData.channelName}</span>
                  <span>Duración: {course.videoData.duration}</span>
                </div>
              </div>
            )}
          </motion.div>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-8 rounded-lg shadow-lg">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-4"
        >
          {course.courseOutput.course.name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-orange-100"
        >
          {course.courseOutput.course.description}
        </motion.p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>
    </div>
  );
}
