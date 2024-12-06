import React from 'react'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import Image from 'next/image'

const Loading = ({loading}) => {
  return (
    <AlertDialog open={loading}>
      <AlertDialogContent>
        <AlertDialogHeader className="space-y-2">
          <VisuallyHidden asChild>
            <AlertDialogTitle>
              Estado de generación del curso
            </AlertDialogTitle>
          </VisuallyHidden>
          <div className="text-center text-xl font-semibold">
            Generando tu curso personalizado
          </div>
          <AlertDialogDescription className="text-center">
            Por favor espera mientras la IA trabaja en tu curso...
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col items-center py-6">
          <Image 
            src="/LoadingCourse.gif"
            width={100}
            height={100}
            alt="Animación de carga mientras se genera el curso"
            priority
            className="mb-4"
          />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default Loading