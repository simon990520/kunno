import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import Image from 'next/image'
import { WidthIcon } from '@radix-ui/react-icons'
  
const Loading = ({loading}) => {
  return (

<AlertDialog open={loading}>
 
  <AlertDialogContent>
    <AlertDialogHeader>
    
      <AlertDialogTitle className="sr-only">Generando Curso</AlertDialogTitle>
      <div className='flex items-center flex-col py-12'>
        <Image 
          src={'/LoadingCourse.gif'} 
          width={100} 
          height={100} 
          alt="Animación de carga mientras la IA genera el curso" 
        />
        <AlertDialogDescription className="text-center mt-4">
          Por favor espera... La IA está trabajando en tu curso.
        </AlertDialogDescription>
      </div>
    </AlertDialogHeader>
    
  </AlertDialogContent>
</AlertDialog>

  )
}

export default Loading