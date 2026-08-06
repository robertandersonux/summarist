"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { RootState } from "@/lib/store";
import { closeModal, switchView } from "@/lib/features/authModalSlice";
import { useRouter } from "next/navigation";

export default function AuthModal() {
  const dispatch = useDispatch();
  const { isOpen, view } = useSelector((state: RootState) => state.authModal);
const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

 const handleClose = () => {
  setEmail("");
  setPassword("");
  setError("");
  dispatch(closeModal());
};

const handleRegister = async () => {
  setError("");
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    handleClose();
    router.push("/for-you");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration failed";
    if (message.includes("email-already-in-use") || message.includes("invalid-email")) {
      setError("Invalid email");
    } else if (message.includes("weak-password")) {
      setError("Password should be at least 6 characters");
    } else {
      setError("Something went wrong. Please try again.");
    }
  }
};

const handleLogin = async () => {
  setError("");
  try {
    await signInWithEmailAndPassword(auth, email, password);
    handleClose();
    router.push("/for-you");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Login failed";
    if (message.includes("invalid-email")) {
      setError("Invalid email");
    } else if (message.includes("user-not-found") || message.includes("invalid-credential")) {
      setError("User not found");
    } else {
      setError("Something went wrong. Please try again.");
    }
  }
};

 const handleGuestLogin = async () => {
  setError("");
  try {
    await signInWithEmailAndPassword(auth, "guest@gmail.com", "guest123");
    handleClose();
    router.push("/for-you");
  } catch {
    setError("Guest login unavailable right now.");
  }
};

  return (
    <div className="modal--wrapper" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close--btn" onClick={handleClose}>
          &times;
        </button>

        {view === "register" ? (
          <>
            <div className="modal__title">Sign up to Summarist</div>
            <button className="btn modal__guest--btn" onClick={handleGuestLogin}>
              Login as a Guest
            </button>
            <div className="modal__divider">
              <span>or</span>
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="modal__input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="modal__input"
            />
            {error && <div className="modal__error">{error}</div>}
            <button className="btn modal__submit--btn" onClick={handleRegister}>
              Sign up
            </button>
            <button
              className="modal__switch--btn"
              onClick={() => dispatch(switchView("login"))}
            >
              Already have an account?
            </button>
          </>
        ) : (
          <>
            <div className="modal__title">Log in to Summarist</div>
            <button className="btn modal__guest--btn" onClick={handleGuestLogin}>
              Login as a Guest
            </button>
            <div className="modal__divider">
              <span>or</span>
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="modal__input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="modal__input"
            />
            {error && <div className="modal__error">{error}</div>}
            <button className="btn modal__submit--btn" onClick={handleLogin}>
              Login
            </button>
            <button
              className="modal__switch--btn"
              onClick={() => dispatch(switchView("register"))}
            >
              Don&apos;t have an account?
            </button>
          </>
        )}
      </div>
    </div>
  );
}