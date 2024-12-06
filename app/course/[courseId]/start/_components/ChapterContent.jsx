"use client";

import React from 'react'
import Markdown from 'react-markdown'
import YouTube from 'react-youtube'

const opts = {
    height: '300',
    width: '600',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
}
const ChapterContent = ({chapter, content}) => {

    // Verificar que tenemos contenido válido
    const sections = content?.content?.sections || [];

  return (
    <div className='p-10'>
      <h2 className='font-medium text-2xl'>{chapter?.name}</h2>
      <p className='text-gray-500'> {chapter?.about}</p>

      {/* video  */}
      {content?.videoId && (
                <div className='mt-5 mb-8 flex justify-center'>

      <YouTube
      videoId={content.videoId}
      opts={opts}
      className="rounded-lg overflow-hidden shadow-lg"

      />
      </div>
      )}


      {/* content  */}
      <div className="space-y-6">
        {sections.map((section, index) => (
            <div key={index} className='p-6 bg-slate-50 rounded-lg shadow-sm'>
                <h2 className='font-medium text-xl text-gray-900 mb-3'>{section.title}</h2>
                <div className='prose prose-slate max-w-none'>
                    <Markdown>{section.description}</Markdown>
                </div>
                {section.code && (
                    <div className='mt-4 p-4 bg-gray-900 text-white rounded-md overflow-x-auto'>
                        <pre className='text-sm'>
                            <code>
                                {section.code.replace(/<\/?precode>/g, '')}
                            </code>
                        </pre>
                    </div>
                )}
            </div>
        ))}
      </div>
    </div>
  )
}

export default ChapterContent