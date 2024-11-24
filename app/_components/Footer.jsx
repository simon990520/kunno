"use client"
import { FaLinkedin } from "react-icons/fa6";
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'


const Footer = () => {
  const path = usePathname();
  const menu = [
    {id:1,
      name:'Quiénes Somos',
      path:'/about'
    },
    {id:1,
      name:'Contáctanos',
      path:'/contact'
    },
    {id:1,
      name:'Términos y Condiciones',
      path:'/terms'
    },
  ]
  return (
   
   

    <footer className=" bottom-0 bg-white dark:bg-gray-900">
  <div className="mx-auto max-w-screen-xl px-4 pb-8 pt-16 sm:px-6 lg:px-8 lg:pt-1">
   

    <div
      className="mt-16 border-t border-gray-100 pt-8 sm:flex sm:items-center sm:justify-between lg:mt-24 dark:border-gray-800"
    >
      <ul className="flex flex-wrap justify-center gap-4 text-xs lg:justify-end">
        {menu.map((item,index) =>(
           <Link href={item.path} key={item.id}>

        <li
          className="text-gray-500 text-xl transition hover:opacity-75 dark:text-gray-400">
            {item.name}
         
        </li>
           </Link>
        
        ))}

        
      </ul>

      <ul className="mt-8 flex justify-center gap-6 sm:mt-0 lg:justify-end">
        <li>
         
        </li>

        <li>
         
        </li>

        
      </ul>
    </div>
  </div>
</footer>

  )
}

export default Footer