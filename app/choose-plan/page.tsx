"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { openModal } from "../../lib/features/authModalSlice";
import { useEffect } from "react";
import Link from "next/link";

export default function ChoosePlanPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [user, setUser] = useState<import("firebase/auth").User | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleSubscribe = () => {
    if (!user) {
      dispatch(openModal("login"));
      return;
    }
    // Real Stripe checkout would go here.
    // Stubbed for now: simulate a successful subscription.
    setSubscribed(true);
  };

  const faqs = [
    {
      q: "How does the 7-day free trial work?",
      a: "Begin your 7-day free trial today. You can cancel anytime before the trial ends and you won't be charged.",
    },
    {
      q: "Can I switch plans later?",
      a: "Yes — you can upgrade, downgrade, or cancel your plan at any time from your account settings.",
    },
    {
      q: "What happens after my trial ends?",
      a: "You'll be charged the plan price you selected, and your subscription will continue until you cancel.",
    },
  ];

  if (subscribed) {
    return (
      <div className="choose-plan__success">
        <div className="choose-plan__success--title">You&apos;re all set!</div>
        <div className="choose-plan__success--text">
          Your Premium subscription is now active. Enjoy full access to every book.
        </div>
        <Link href="/for-you" className="btn choose-plan__success--btn">
          Start reading
        </Link>
      </div>
    );
  }

  return (
    <div className="choose-plan">
      <nav className="choose-plan__nav">
        <img src="/logo.png" alt="logo" className="choose-plan__nav--logo" />
      </nav>

      <div className="choose-plan__hero">
        <div className="choose-plan__hero--title">
          Get unlimited access to many amazing books to read
        </div>
        <div className="choose-plan__hero--subtitle">
          Turn ordinary moments into amazing learning opportunities
        </div>
        <img src="/pricing-top.png" alt="pricing" className="choose-plan__hero--img" />
      </div>

      <div className="choose-plan__plans">
        <div
          className={`choose-plan__plan ${
            selectedPlan === "yearly" ? "choose-plan__plan--active" : ""
          }`}
          onClick={() => setSelectedPlan("yearly")}
        >
          <div className="choose-plan__plan--radio">
            {selectedPlan === "yearly" && <div className="choose-plan__plan--radio-dot" />}
          </div>
          <div className="choose-plan__plan--details">
            <div className="choose-plan__plan--title">Premium Plus Yearly</div>
            <div className="choose-plan__plan--price">$99.99/year</div>
            <div className="choose-plan__plan--sub">7-day free trial included</div>
          </div>
        </div>

        <div className="choose-plan__divider">
          <span>or</span>
        </div>

        <div
          className={`choose-plan__plan ${
            selectedPlan === "monthly" ? "choose-plan__plan--active" : ""
          }`}
          onClick={() => setSelectedPlan("monthly")}
        >
          <div className="choose-plan__plan--radio">
            {selectedPlan === "monthly" && <div className="choose-plan__plan--radio-dot" />}
          </div>
          <div className="choose-plan__plan--details">
            <div className="choose-plan__plan--title">Premium Monthly</div>
            <div className="choose-plan__plan--price">$9.99/month</div>
            <div className="choose-plan__plan--sub">No trial included</div>
          </div>
        </div>

        <button className="btn choose-plan__cta--btn" onClick={handleSubscribe}>
          {selectedPlan === "yearly" ? "Start your free trial" : "Subscribe now"}
        </button>
        <div className="choose-plan__cta--note">
          {selectedPlan === "yearly"
            ? "Cancel your trial at any time before it ends, and you won't be charged."
            : "Recurring billing. Cancel anytime."}
        </div>
      </div>

      <div className="choose-plan__faq">
        {faqs.map((faq, i) => (
          <div key={i} className="choose-plan__faq--item">
            <div
              className="choose-plan__faq--question"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              {faq.q}
              <span>{openFaq === i ? "−" : "+"}</span>
            </div>
            {openFaq === i && (
              <div className="choose-plan__faq--answer">{faq.a}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}