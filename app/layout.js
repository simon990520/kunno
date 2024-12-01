import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Head from "next/head";
import Analytics from "./_components/Analytics";
const inter = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "Kunno app Generador de Cursos de IA | Crea tu Ruta de Aprendizaje Personalizada",
  description: "Genera fácilmente cursos personalizados de IA con nuestra herramienta Generador de Cursos de IA. Personaliza tu currículum, explora diversos temas y mejora tu experiencia de aprendizaje.",
  keywords: "cursos de IA, generador de cursos, aprendizaje personalizado, inteligencia artificial, educación online, herramienta educativa",
  author: "Simon Fuentes Barboza", 
  openGraph: {
    title: "Generador de Cursos de IA",
    description: "Transforma tu experiencia de aprendizaje con nuestro Generador de Cursos de IA. Crea cursos personalizados adaptados a tus necesidades.",
    url: "https://kunno.vercel.app/", 
    image: "/logo.png", // Actualiza con el logo
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Generador de Cursos de IA",
    description: "Genera cursos personalizados de IA fácilmente. ¡Comienza tu viaje de aprendizaje hoy!",
    image: "/images/logo.png", // Actualiza con el logo
  },
};

export default function RootLayout({ children }) {
  return (
    <>
      <ClerkProvider>
        <Head>
          {/* Metadatos SEO */}
          <title>{metadata.title}</title>
          <meta name="description" content={metadata.description} />
          <meta name="keywords" content={metadata.keywords} />
          <meta name="author" content={metadata.author} />
          <link rel="icon" href="/logo.png" sizes="16x16" />

          {/* Etiquetas de Open Graph */}
          <meta property="og:title" content={metadata.openGraph.title} />
          <meta property="og:description" content={metadata.openGraph.description} />
          <meta property="og:url" content={metadata.openGraph.url} />
          <meta property="og:image" content={metadata.openGraph.image} />
          <meta property="og:type" content={metadata.openGraph.type} />

          {/* Etiquetas de Twitter */}
          <meta name="twitter:card" content={metadata.twitter.card} />
          <meta name="google-adsense-account" content="ca-pub-1034833348897670" />
          <meta name="twitter:title" content={metadata.twitter.title} />
          <meta name="twitter:description" content={metadata.twitter.description} />
          <meta name="twitter:image" content={metadata.twitter.image} />

          {/* Script de Google AdSense */}
          <script
            data-ad-client={process.env.NEXT_PUBLIC_AD_CLIENT_ID} // Reemplaza con tu ID de cliente de AdSense
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          ></script>
        </Head>
        <Analytics />
        <html lang="es">
          <body className={inter.className}>{children}</body>
        </html>
      </ClerkProvider>
    </>
  );
}
