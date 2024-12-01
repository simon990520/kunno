"use client";
import Head from "next/head";
import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import emailjs from "emailjs-com"; // Importa la librería de EmailJS

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    emailjs
      .send(
        "service_2dkica3", // Reemplaza con tu ID de servicio de EmailJS
        "template_pgmb9a1", // Reemplaza con tu ID de plantilla de EmailJS
        {
          from_name: data.name,
          from_email: data.email,
          message: data.message,
        },
        "8Sipah4nwfJJtW0-m" // Reemplaza con tu user ID de EmailJS
      )
      .then(
        (response) => {
          toast.success("¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.");
          setName("");
          setEmail("");
          setMessage("");
        },
        (error) => {
          toast.error(`Algo salió mal. Por favor, intenta de nuevo.`);
        }
      );
  };

  return (
    <>
      <Header />
      <Head>
        <title>Contáctanos | AI Course Generator</title>
        <meta
          name="description"
          content="Ponte en contacto con AI Course Generator para consultas, comentarios o soporte."
        />
        <meta name="keywords" content="contacto, soporte al cliente, cursos AI" />
      </Head>
      <div name="Contact" className="max-w-screen-2xl container mx-auto px-4 md:px-20 my-10">
        <h2 className="text-3xl font-semibold mb-4 ">Contáctanos</h2>
        <div className="">
          <form method="POST" onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col items-center gap-5 border bottom-1 p-3 shadow-sm">
            <h2 className="text-2xl font-normal">Envíame un mensaje</h2>
            <h4 className="text-xl font-mono">Soy muy receptivo a los mensajes</h4>
            <div className="w-full md:w-1/2 flex flex-col gap-2">
              <input
                {...register("name", { required: true })}
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-[50px] rounded-full leading-tight border border-black py-2 px-4 dark:bg-[#1c1b23]"
                type="text"
                placeholder="Nombre"
              />
              {errors.name && <span className="text-red-300 mx-4">Este campo es obligatorio</span>}
            </div>
            <div className="w-full md:w-1/2 flex flex-col gap-2">
              <input
                {...register("email", { required: true })}
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[50px] rounded-full border border-black py-2 px-4 dark:bg-[#1c1b23]"
                type="email"
                placeholder="Correo Electrónico"
              />
              {errors.email && <span className=" mx-4 text-red-300">Este campo es obligatorio</span>}
            </div>
            <div className="w-full md:w-1/2 flex flex-col gap-2">
              <textarea
                {...register("message", { required: true })}
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full h-[140px] rounded-md border border-black py-2 px-4 dark:bg-[#1c1b23]"
                placeholder="Escribe tu mensaje"
              />
              {errors.message && <span className="mx-4 text-red-300">Este campo es obligatorio</span>}
            </div>
            <div className="w-1/2 flex items-center justify-center">
              <button type="submit" className="px-10 text-white font-medium py-3 bg-blue-400 outline-none hover:bg-blue-900 border rounded-full">
                Enviar
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;
