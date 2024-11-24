import React from 'react'
import Header from './Header'
import Footer from './Footer'
import Head from 'next/head'

const AboutUs = () => {
  return (
    <>
    <Header/>
    <Head>
        <title>About Us | AI Course Generator</title>
        <meta name="description" content="Learn about AI Course Generator, your ultimate tool for creating personalized AI courses." />
        <meta name="keywords" content="AI courses, course generator, artificial intelligence, personalized learning" />
        <link rel="canonical" href="https://www.yourwebsite.com/about-us" />
      </Head>
    <div className="container mx-auto px-4 py-8">
    <h1 className="text-2xl font-bold mb-4">Quiénes Somos</h1>
    <p className="mb-4 text-xl">
      Bienvenido a AI Course Generator, tu herramienta definitiva para crear cursos personalizados con IA. Nuestra misión es simplificar el proceso de aprendizaje aprovechando el poder de la inteligencia artificial para ofrecer experiencias educativas hechas a la medida para usuarios de todos los niveles.
    </p>
    <p className="mb-4 text-xl">
      En AI Course Generator, creemos que todos deberían tener acceso a una educación de alta calidad. Nuestra plataforma utiliza la API de Gemini para generar contenido de cursos completo que satisface las necesidades tanto de estudiantes como de profesionales. Ya sea que seas un principiante que busca aprender lo básico de la IA o un experto en busca de temas avanzados, tenemos algo para ti.
    </p>
    <p className="mb-4 text-xl">
    Nuestro equipo está formado por educadores apasionados y entusiastas de la IA, comprometidos con mejorar la experiencia de aprendizaje. Actualizamos constantemente nuestros cursos para reflejar los avances más recientes en tecnología y educación, asegurándonos de que nuestros usuarios reciban los mejores recursos posibles.
    </p>
    <p className="mb-4 text-lg">
      ¡Únete a nosotros en este emocionante viaje y desbloquea el potencial de la IA en tu educación!
    </p>
  </div>
  <Footer/>
    </>
  )
}

export default AboutUs