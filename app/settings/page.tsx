"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { openModal } from "../../lib/features/authModalSlice";

export default function SettingsPage() {
  const dispatch = useDispatch();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
  return (
    <div className="settings">
      <div className="skeleton skeleton--text" style={{ width: 150, height: 28, marginBottom: 24 }} />
      <div className="skeleton skeleton--text" style={{ width: "100%", height: 60 }} />
    </div>
  );
}
  if (!user) {
    return (
      <div className="settings">
        <div className="settings__title">Settings</div>
        <div className="settings__logged-out--wrapper">
          <img
            src="/login.png"
            alt="Log in required"
            className="settings__logged-out--img"
          />
          <div className="settings__logged-out--text">
            Log in to your account to see your details.
          </div>
          <button
            className="btn settings__login--btn"
            onClick={() => dispatch(openModal("login"))}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  const subscriptionPlan = "basic";

  return (
    <div className="settings">
      <div className="settings__title">Settings</div>
      <div className="settings__section">
        <div className="settings__label">Your Subscription plan</div>
        <div className="settings__value">{subscriptionPlan}</div>
        {subscriptionPlan === "basic" && (
          <Link href="/choose-plan" className="btn settings__upgrade--btn">
            Upgrade to Premium
          </Link>
        )}
      </div>
      <div className="settings__section">
        <div className="settings__label">Email</div>
        <div className="settings__value">{user.email}</div>
      </div>
    </div>
  );
}