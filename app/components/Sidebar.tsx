"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { openModal } from "@/lib/features/authModalSlice";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // Close the drawer whenever the route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock background scroll while the drawer is open
  useEffect(() => {
    document.body.classList.toggle("body--no-scroll", isOpen);
    return () => document.body.classList.remove("body--no-scroll");
  }, [isOpen]);

  const closeSidebar = () => setIsOpen(false);

  const handleAuthClick = () => {
    closeSidebar();
    if (user) {
      signOut(auth);
    } else {
      dispatch(openModal("login"));
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <button
        className="sidebar__toggle"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        aria-expanded={isOpen}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <div
        className={`sidebar__overlay ${isOpen ? "sidebar__overlay--visible" : ""}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      <div className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
        <Link href="/" className="sidebar__logo--wrapper" onClick={closeSidebar}>
          <img className="sidebar__logo" src="/logo.png" alt="logo" />
        </Link>

        <div className="sidebar__list--wrapper">
          <Link
            href="/for-you"
            onClick={closeSidebar}
            className={`sidebar__list ${isActive("/for-you") ? "sidebar__list--active" : ""}`}
          >
            For you
          </Link>
          <Link
            href="/library"
            onClick={closeSidebar}
            className={`sidebar__list ${isActive("/library") ? "sidebar__list--active" : ""}`}
          >
            Library
          </Link>
          <div className="sidebar__list sidebar__list--disabled">Highlights</div>
          <div className="sidebar__list sidebar__list--disabled">Search</div>
        </div>

        <div className="sidebar__list--wrapper sidebar__list--wrapper-bottom">
          <Link
            href="/settings"
            onClick={closeSidebar}
            className={`sidebar__list ${isActive("/settings") ? "sidebar__list--active" : ""}`}
          >
            Settings
          </Link>
          <div className="sidebar__list sidebar__list--disabled">Help &amp; Support</div>
          <div className="sidebar__list" onClick={handleAuthClick}>
            {user ? "Logout" : "Login"}
          </div>
        </div>
      </div>
    </>
  );
}
