"use client";

import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { ImCross } from "react-icons/im";
// import { Link, useLocation } from 'react-router-dom';
// import Image from './Image';
// import { useAuthStore } from '../store/useAuthStore';
import { ProfilePreviewDialog } from "./ProfilePreviewDialog";
import { ProfileEditDialog } from "./ProfileEditDialog";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/context/user-provider";
import { createClient } from "../../utils/supabase/client";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  const { user, loading } = useUser();

  // const location = useLocation();

  // TODO
  // useEffect(() => {
  //     setOpen(false);
  // }, [location]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/posts?sort=trending", label: "Trending" },
    { to: "/posts?sort=popular", label: "Most Popular" },
    { to: "/saved-posts", label: "Saved Posts" },
  ];

  console.log("user ==>", user);

  const logout = async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
  };

  return (
    <>
      <div className="w-full h-16 md:h-20 flex items-center justify-between md:border-b-gray-700 md:border-b-2 pt-3 pb-0">
        {/* Logo */}
        <Link className="flex items-center gap-4 text-2xl font-bold " href="/">
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <span>Blog Site</span>
        </Link>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <div
            className="cursor-pointer text-2xl"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <ImCross /> : <GiHamburgerMenu />}
          </div>

          <div
            className={`w-full flex-col gap-2 text-lg font-medium px-4 z-10 absolute top-16 left-0 bg-[#e6e6ff] shadow-2xl ${open ? "flex" : "hidden"} border-t-gray-700 border-t-2 py-3`}
          >
            {navLinks.map((link, index) => (
              <div key={index} className="relative group">
                <Link
                  href={link.to}
                  className="inline-block relative group-hover:text-blue-900"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-1/2 w-0 h-[2px] bg-blue-800 transition-all duration-500 group-hover:w-full group-hover:left-0"></span>
                  <span className="absolute -bottom-1 right-1/2 w-0 h-[2px] bg-blue-800 transition-all duration-500 group-hover:w-full group-hover:right-0"></span>
                </Link>
              </div>
            ))}
            <Link href="/write">
              <button className="py-2 px-4 rounded-3xl bg-blue-800 hover:bg-blue-600 text-white">
                Write Blog
              </button>
            </Link>
            {!user ? (
              <Link href="/login">
                <button className="py-2 px-4 rounded-3xl bg-blue-800 hover:bg-blue-600 text-white cursor-pointer">
                  Login 👋
                </button>
              </Link>
            ) : (
              <div
                onClick={() => setProfileOpen(true)}
                className="cursor-pointer"
              >
                {/* {selectedImg ? (
                  <img
                    src={selectedImg.url}
                    alt="Profile"
                    className="rounded-full w-10 h-10"
                  />
                ) : (
                  <Image
                    src={user.img || "user.png"}
                    alt="profile"
                    width={36}
                    height={36}
                    className="rounded-full w-10 h-10"
                  />
                )} */}

                <Image
                  src={"/userIcon.jpg"}
                  alt="profile"
                  className="rounded-full w-full h-full"
                  width={36}
                  height={36}
                />
              </div>
            )}
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 xl:gap-12 font-medium">
          {navLinks.map((link, index) => (
            <div key={index} className="relative group">
              <Link
                href={link.to}
                className="inline-block relative group-hover:text-blue-900"
              >
                {link.label}
                <span className="absolute -bottom-1 left-1/2 w-0 h-[2px] bg-blue-800 transition-all duration-500 group-hover:w-full group-hover:left-0"></span>
                <span className="absolute -bottom-1 right-1/2 w-0 h-[2px] bg-blue-800 transition-all duration-500 group-hover:w-full group-hover:right-0"></span>
              </Link>
            </div>
          ))}
          {!user ? (
            <Link href="/login">
              <button className="py-2 px-4 rounded-3xl bg-blue-800 hover:bg-blue-600 text-white cursor-pointer">
                Login 👋
              </button>
            </Link>
          ) : (
            <div
              onClick={() => setProfileOpen(true)}
              className="cursor-pointer rounded-full w-10 h-10"
            >
              {/* {selectedImg ? (
                <img
                  src={selectedImg.url}
                  alt="Profile"
                  className="w-full h-full rounded-full"
                />
              ) : (
                <Image
                  src={"/user.png"}
                  alt="profile"
                  className="rounded-full w-full h-full"
                />
              )} */}

              <Image
                src={"/userIcon.jpg"}
                alt="profile"
                className="rounded-full w-full h-full"
                width={30}
                height={30}
              />
            </div>
          )}
        </div>
      </div>

      <ProfilePreviewDialog
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={user}
        onUpdateProfile={() => {
          setProfileOpen(false);
          setEditProfileOpen(true);
        }}
        onLogout={() => {
          setOpen(false);
          logout();
        }}
      />

      <ProfileEditDialog
        isOpen={editProfileOpen}
        onClose={() => {
          setOpen(false);
          setEditProfileOpen(false);
        }}
        user={user}
        selectedImg={selectedImg}
        setSelectedImg={setSelectedImg}
      />
    </>
  );
};

export default Navbar;
