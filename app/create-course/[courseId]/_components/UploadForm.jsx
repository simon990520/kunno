"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { ref as dbRef, update } from 'firebase/database';
import { storage, realtimeDb } from '@/configs/firebaseConfig';
import toast from 'react-hot-toast';
import Image from 'next/image';

const UploadForm = ({ course }) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onFileUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file || !course?.courseId) return;

      setLoading(true);
      const fileRef = storageRef(storage, `courses/${course.courseId}/${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          console.error('Error al subir imagen:', error);
          toast.error('Error al subir la imagen');
          setLoading(false);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const courseRef = dbRef(realtimeDb, `courses/${course.courseId}`);
            await update(courseRef, {
              imageUrl: downloadURL,
              updatedAt: new Date().toISOString()
            });
            toast.success('Imagen subida exitosamente');
          } catch (error) {
            console.error('Error al actualizar la base de datos:', error);
            toast.error('Error al actualizar la información del curso');
          } finally {
            setLoading(false);
            setProgress(0);
          }
        }
      );
    } catch (error) {
      console.error('Error en la subida:', error);
      toast.error('Error al procesar la imagen');
      setLoading(false);
    }
  };

  return (
    <div className="p-5 bg-white rounded-lg">
      <h2 className="text-[18px] font-medium">Imagen del curso</h2>
      <div className="mt-4 h-[180px] w-full bg-slate-100 rounded-lg flex items-center justify-center">
        {course?.imageUrl ? (
          <div className="relative w-full h-full">
            <Image
              src={course.imageUrl}
              alt="Course thumbnail"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-[15px] leading-6 text-gray-500">
              Sube una imagen atractiva para tu curso
            </h2>
            <p className="text-[13px] text-gray-500">
              Recomendado: 1280x720px
            </p>
          </div>
        )}
      </div>
      <div className="mt-4">
        <Button
          disabled={loading}
          onClick={() => document.querySelector('input[type="file"]').click()}
          className="w-full bg-orange-500 hover:bg-orange-600"
        >
          {loading ? `Subiendo... ${Math.round(progress)}%` : 'Subir imagen'}
        </Button>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={onFileUpload}
        />
      </div>
    </div>
  );
};

export default UploadForm;
