import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import Footer from "./Footer";
import { HiChevronDoubleRight } from "react-icons/hi";

const Hero = () => {
  return (
    <div>
      <section className="bg-cover bg-center bg-no-repeat bg-[url('/banner.png')]">
        <div className="mx-auto max-w-screen-xl px-4 pt-32 pb-10 lg:flex lg:items-center">
          <div className="mx-auto max-w-xl text-center">
          <h1 class="text-3xl font-extrabold sm:text-5xl">
          Crea <strong class="font-extrabold text-orange-500 "> tus propios </strong>cursos personalizados con <strong class="font-extrabold text-orange-500 "> IA. </strong>
          </h1>
          <p className="mt-4 text-xm relaxed bg-white bg-opacity-30">
            Descubre la educación personalizada con cursos creados por IA. Adapta tu aprendizaje a tus objetivos y ritmo únicos.
          </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4 cursor-pointer">
              <Link href={"/explore-course"}>
                <Button variant="startButton" size="lg">explorar cursos.<HiChevronDoubleRight className="text-xl" /></Button>
              </Link>
            </div>
          </div>
        </div>
      
      </section>
    </div>
  );
};

export default Hero;
