import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  
import { HiOutlineTrash } from "react-icons/hi2";


const DropdownOption = ({ children,handleOnDelete }) => {
    
    const[openAlert, setOpenAlert] =  useState(false)
  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={()=>setOpenAlert(true)}>
          <div className="flex  items-center gap-1">
            <HiOutlineTrash /> Eliminar
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    {/*  alert box  */}
    <AlertDialog open={openAlert}>
 
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
      <AlertDialogDescription>
      Esta acción no se puede deshacer. Eliminará permanentemente su curso
      y eliminará sus datos de nuestros servidores.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel onClick={()=>setOpenAlert(false)}>Cancelar</AlertDialogCancel>
      <AlertDialogAction onClick={()=>{handleOnDelete();setOpenAlert(false)}}>Continuar</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

    </>
  );
};

export default DropdownOption;
