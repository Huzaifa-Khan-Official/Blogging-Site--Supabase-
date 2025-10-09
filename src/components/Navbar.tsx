"use client";

import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { ImCross } from "react-icons/im";
import { ProfilePreviewDialog } from "./ProfilePreviewDialog";
import { ProfileEditDialog } from "./ProfileEditDialog";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/utils/supabase/client";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const { user, isLoading } = useAuth()
  const router = useRouter();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/blogs?sort=trending", label: "Trending" },
    { to: "/blogs?sort=popular", label: "Most Popular" },
    { to: "/saved-blogs", label: "Saved Posts" },
  ];

  const logout = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (!error) {
        router.refresh();
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <div className="w-full h-16 md:h-20 flex items-center justify-between md:border-b-gray-700 md:border-b-2 pt-3 pb-0">
        {/* Logo */}
        <Link className="flex items-center gap-4 text-2xl font-bold" href="/">
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
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-1/2 w-0 h-[2px] bg-blue-800 transition-all duration-500 group-hover:w-full group-hover:left-0"></span>
                  <span className="absolute -bottom-1 right-1/2 w-0 h-[2px] bg-blue-800 transition-all duration-500 group-hover:w-full group-hover:right-0"></span>
                </Link>
              </div>
            ))}
            <Link href="/write" onClick={() => setOpen(false)}>
              <button className="py-2 px-4 rounded-3xl bg-blue-800 hover:bg-blue-600 text-white">
                Write Blog
              </button>
            </Link>

            {!user ? (
              <Link href="/login" onClick={() => setOpen(false)}>
                <button className="py-2 px-4 rounded-3xl bg-blue-800 hover:bg-blue-600 text-white cursor-pointer">
                  Login 👋
                </button>
              </Link>
            ) : (
              <div
                onClick={() => {
                  setProfileOpen(true);
                  setOpen(false);
                }}
                className="cursor-pointer"
              >
                <Image
                  src={user.user_metadata?.avatar_url || "/userIcon.jpg"}
                  alt="profile"
                  width={40}
                  height={40}
                  className="rounded-full w-10 h-10"
                />
              </div>
            )}
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 xl:gap-8 font-medium">
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

          {isLoading ? (
            <div className="hidden md:flex items-center gap-4 font-medium">
              <div className="animate-pulse bg-gray-300 h-6 w-12 rounded"></div>
              <div className="animate-pulse bg-gray-300 h-10 w-16 rounded-3xl"></div>
            </div>
          ) : !user ? (
            <Link href="/login">
              <button className="py-2 px-4 rounded-3xl bg-blue-800 hover:bg-blue-600 text-white cursor-pointer">
                Login 👋
              </button>
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <div
                onClick={() => setProfileOpen(true)}
                className="cursor-pointer rounded-full w-10 h-10"
              >
                <Image
                  src={user.user_metadata?.avatar_url || "/userIcon.jpg"}
                  alt="profile"
                  width={40}
                  height={40}
                  className="rounded-full w-full h-full"
                />
              </div>
              <button
                onClick={logout}
                className="py-2 px-4 rounded-3xl bg-red-600 hover:bg-red-500 text-white cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Dialogs */}
      <ProfilePreviewDialog
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={user}
        onUpdateProfile={() => {
          setProfileOpen(false);
          setEditProfileOpen(true);
        }}
        onLogout={() => {
          setProfileOpen(false);
          logout();
        }}
      />

      <ProfileEditDialog
        isOpen={editProfileOpen}
        onClose={() => {
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
