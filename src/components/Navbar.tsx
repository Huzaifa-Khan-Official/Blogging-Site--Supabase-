"use client"

import type React from "react"
import { useState } from "react"
import { GiHamburgerMenu } from "react-icons/gi"
import { ImCross } from "react-icons/im"
import { User, LogOut, FolderClosed } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProfilePreviewModal } from "./ProfilePreviewModal"
import { ProfileEditModal } from "./ProfileEditModal"
import Image from "next/image"

interface NavLink {
  to: string
  label: string
}

export const Navbar = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [profileOpen, setProfileOpen] = useState<boolean>(false)
  const [editProfileOpen, setEditProfileOpen] = useState<boolean>(false)
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState<boolean>(false)
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const navLinks: NavLink[] = [
    { to: "/", label: "Home" },
    { to: "/blogs?sort=trending", label: "Trending" },
    { to: "/blogs?sort=popular", label: "Most Popular" },
    { to: "/saved-blogs", label: "Saved Posts" },
  ]

  const logout = async (): Promise<void> => {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setLogoutConfirmOpen(false)
      router.refresh()
    }
  }

  const displayName = user?.username || "User"
  const avatarUrl = user?.img

  return (
    <>
      <div className="w-full h-16 md:h-20 flex items-center justify-between md:border-b md:border-b-gray-700 pt-3 pb-0 px-4 md:px-6">
        {/* Logo */}
        <Link className="flex items-center gap-4 text-2xl font-bold" href="/">
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <span>Blog Site</span>
        </Link>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-4">
          {!isLoading && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  <Avatar className="h-10 w-10 cursor-pointer border-2 border-blue-600">
                    <AvatarImage src={avatarUrl || "/userIcon.jpg"} alt={displayName} />
                    <AvatarFallback className="bg-blue-200 text-blue-900">
                      {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setProfileOpen(true)}>
                  <User className="mr-2 h-4 w-4" />
                  <span>See Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEditProfileOpen(true)}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Update Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLogoutConfirmOpen(true)} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}

          <div className="cursor-pointer text-2xl" onClick={() => setOpen((prev) => !prev)}>
            {open ? <ImCross /> : <GiHamburgerMenu />}
          </div>

          <div
            className={`w-full flex-col gap-2 text-lg font-medium px-4 py-4 z-10 absolute top-16 left-0 bg-blue-100 shadow-2xl ${open ? "flex" : "hidden"
              }`}
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
              <button className="py-2 px-4 rounded-3xl bg-blue-800 hover:bg-blue-600 text-white cursor-pointer">
                Write Blog
              </button>
            </Link>
            {!isLoading && !user && (
              <Link
                href="/login"
                className="py-2 hover:text-blue-600 transition-colors cursor-pointer"
                onClick={() => setOpen(false)}
              >
                <button className="py-2 px-4 rounded-3xl bg-blue-800 hover:bg-blue-600 text-white cursor-pointer">
                  Login 👋
                </button>
              </Link>
            )}
          </div>
        </div>

        <div className="hidden md:flex gap-8 items-center">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
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
              <button className="py-2 px-4 rounded-3xl bg-blue-800 hover:bg-blue-600 text-white cursor-pointer">
                Write Blog
              </button>
            </Link>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {isLoading ? (
              <div className="hidden md:flex items-center gap-4 font-medium">
                <div className="animate-pulse bg-gray-300 h-10 w-10 rounded-full"></div>
              </div>
            ) : !isLoading && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none">
                    <Avatar className="h-10 w-10 cursor-pointer border-2 border-blue-600 hover:border-blue-700 transition-colors">
                      <AvatarImage src={avatarUrl || "/userIcon.jpg"} alt={displayName} />
                      <AvatarFallback className="bg-blue-200 text-blue-900">
                        {displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <Link href="/my-blogs" className="flex gap-2 items-center w-full">
                      <FolderClosed className="mr-2 h-4 w-4" />
                      <span>My Blogs</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setProfileOpen(true)}>
                    <User className="mr-2 h-4 w-4" />
                    <span>See Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEditProfileOpen(true)}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Update Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setLogoutConfirmOpen(true)} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <button className="py-2 px-4 rounded-3xl bg-blue-800 hover:bg-blue-600 text-white cursor-pointer">
                  Login 👋
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Profile Preview Modal */}

      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="w-[95vw] sm:w-full sm:max-w-[425px] max-h-[90vh] bg-white border-2 border-blue-300 rounded-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl text-blue-900">User Profile</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-gray-600">
              View your profile information
            </DialogDescription>
          </DialogHeader>
          {user && <ProfilePreviewModal user={user} />}
        </DialogContent>
      </Dialog>

      {/* Profile Edit Modal */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent className="sm:max-w-md bg-white border-2 border-blue-300 rounded-lg !max-h-[85vh] overflow-hidden overflow-y-scroll">
          <DialogHeader>
            <DialogTitle className="text-blue-900">Edit Profile</DialogTitle>
            <DialogDescription className="text-gray-600">Update your profile information</DialogDescription>
          </DialogHeader>
          {user && <ProfileEditModal user={user} onClose={() => setEditProfileOpen(false)} />}
        </DialogContent>
      </Dialog>

      {/* Logout Confirmation Modal */}
      <Dialog open={logoutConfirmOpen} onOpenChange={setLogoutConfirmOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white border-2 border-red-300 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-red-900">Confirm Logout</DialogTitle>
            <DialogDescription className="text-gray-600">Are you sure you want to logout?</DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => setLogoutConfirmOpen(false)}
              className="border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={logout} className="bg-red-600 hover:bg-red-700 cursor-pointer">
              Logout
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Navbar
