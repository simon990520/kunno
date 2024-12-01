"use client";

import React, { useContext } from "react";
import { Progress } from "@/components/ui/progress";

import { HiOutlineHome } from "react-icons/hi";
import { CiPower } from "react-icons/ci";
import { HiOutlineShieldCheck } from "react-icons/hi";
import { HiOutlineSquare3Stack3D } from "react-icons/hi2";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { UserCourseListContext } from "@/app/_context/UserCourseListContext";
import Image from "next/image";
import { useClerk, useUser, UserButton } from "@clerk/nextjs";
import { adminConfig } from "@/configs/AdminConfig";
import { useState } from "react";

const Sidebar = () => {
  const { user } = useUser();
  const { openUserProfile } = useClerk(); // Método para abrir la modal
  const path = usePathname();
  const { signOut } = useClerk();
  const router = useRouter();
  const { userCourseList, setUserCourseList } = useContext(UserCourseListContext);

  const isAdmin = adminConfig.emails.includes(user?.primaryEmailAddress?.emailAddress);
  
  const handleLogout = async () => {
    await signOut({ redirectTo: '/' });
  };

  const handleAccountClick = () => {
    openUserProfile(); // Abre la modal de perfil de usuario
  };

  const menu = [
    {
      id: 1,
      name: "Inicio",
      icon: <HiOutlineHome />,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Explorar",
      icon: <HiOutlineSquare3Stack3D />,
      path: "/dashboard/explore",
    },
    {
      id: 3,
      name: "Cuenta",
      icon: <HiOutlineShieldCheck />,
      path: "/dashboard",
      onClick: handleAccountClick, // Agregar el evento para abrir el perfil
    },
    ...(isAdmin
      ? [
          {
            id: 5,
            name: "Admin Users",
            icon: <HiOutlineShieldCheck />,
            path: "/dashboard/admin-users",
          },
        ]
      : []),
    {
      id: 4,
      name: "Salir",
      icon: <CiPower />,
      path: "/dashboard/logout",
      isLogout: true,
    },
  ];

  return (
    <div className="fixed h-full md:w-64 p-4 shadow-md">
      <Image src={"/logo.png"} width={44} height={44} />
      <hr className="my-3" />
      <ul>
        {menu.map((item) => (
          item.isLogout ? (
            <li
              key={item.id}
              className="flex items-center gap-2 text-gray-600 cursor-pointer p-3 hover:bg-gray-100 hover:text-black rounded-lg mb-3"
              onClick={handleLogout}
            >
              <div>{item.icon}</div>
              <h2>{item.name}</h2>
            </li>
          ) : (
            <Link href={item.path} key={item.id}>
              <li
                key={item.id}
                className={`flex items-center gap-2 text-gray-600 cursor-pointer p-3 hover:bg-gray-100 hover:text-black rounded-lg mb-3 ${item.path == path && "bg-gray-100 text-black"}`}
                onClick={item.onClick} // Se llama handleAccountClick para abrir el perfil
              >
                <div>{item.icon}</div>
                <h2>{item.name}</h2>
              </li>
            </Link>
          )
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;