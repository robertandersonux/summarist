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

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleAuthClick = () => {
    if (user) {
      signOut(auth);
    } else {
      dispatch(openModal("login"));
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="sidebar">
      <Link href="/" className="sidebar__logo--wrapper">
        <img className="sidebar__logo" src="/logo.png" alt="logo" />
      </Link>
      <div className="sidebar__list--wrapper">
        <Link
          href="/for-you"
          className={`sidebar__list ${isActive("/for-you") ? "sidebar__list--active" : ""}`}
        >
          For you
        </Link>
        <Link
          href="/library"
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
  );
}