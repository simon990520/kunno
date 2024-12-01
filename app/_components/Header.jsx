import { Button } from "@/components/ui/button";
import { RxGithubLogo } from "react-icons/rx";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <>
     <Head>
        <title>Kunno - Crea cursos personalizados con IA.</title>
        <meta name="description" content="Genera cursos personalizados de IA con nuestra herramienta fácil de usar. Aprende sobre inteligencia artificial, aprendizaje automático y más con un enfoque práctico. Crea tu currículum educativo personalizado hoy mismo." />
        <meta name="keywords" content="generador de cursos de IA, cursos personalizados de inteligencia artificial, aprendizaje automático, educación online, cursos de aprendizaje profundo, herramientas educativas IA, cursos de machine learning, formación en IA" />
        <meta name="author" content="Simon Fuentes Barboza" />
        <link rel="canonical" href="https://kunno.vercel.app/" />
        <meta name="robots" content="index, follow" />
        <meta name="robots" content="max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#FF6F00" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="es_ES" />
        <meta property="og:site_name" content="Generador de Cursos de IA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Generador de Cursos de IA" />
        <meta name="twitter:description" content="Genera cursos de IA personalizados con nuestra herramienta fácil de usar. Aprende de manera práctica sobre inteligencia artificial y machine learning." />
        <meta name="twitter:image" content="https://kunno.vercel.app/image.jpg" />
        <meta property="og:title" content="Generador de Cursos de IA" />
        <meta property="og:description" content="Crea cursos personalizados de IA adaptados a tus necesidades educativas y aprende de forma efectiva sobre inteligencia artificial y machine learning." />
        <meta property="og:image" content="https://kunno.vercel.app/image.jpg" />
        <meta property="og:url" content="https://kunno.vercel.app/" />

      </Head>
    <div className="flex justify-between p-5 shadow-sm items-center">
      <div className="flex items-center gap-2">
      <Link  href={'/'}  className="flex justify-center items-center gap-2">
      <span className="font-bold text-xl">Kunno</span>
      </Link>
      </div>
      <div className="flex justify-center items-center gap-10 cursor-pointer">         
      <Link href={'/dashboard'} >

      <Button variant="startButton" > ¡Empieza ahora! </Button>
      </Link>
      </div>
    </div>
    </>
  );
};

export default Header;
