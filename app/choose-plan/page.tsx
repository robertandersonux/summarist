"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { openModal } from "../../lib/features/authModalSlice";
import Link from "next/link";

export default function ChoosePlanPage() {
  const dispatch = useDispatch();
  const [user, setUser] = useState<User | null>(null);
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
    setSubscribed(true);
  };

  const faqs = [
    {
      q: "How does the free 7-day trial work?",
      a: "Begin your complimentary 7-day trial with a Summarist annual membership. You are under no obligation to continue your subscription, and you will only be billed when the trial period expires. With Premium access, you can learn at your own pace and as frequently as you desire, and you may terminate your subscription prior to the conclusion of the 7-day free trial.",
    },
    {
      q: "Can I switch subscriptions from monthly to yearly, or yearly to monthly?",
      a: "While an annual plan is active, it is not feasible to switch to a monthly plan. However, once the current month ends, transitioning from a monthly plan to an annual plan is an option.",
    },
    {
      q: "What's included in the Premium plan?",
      a: "Premium membership provides you with the ultimate Summarist experience, including unrestricted entry to many best-selling books high-quality audio, the ability to download titles for offline reading, and the option to send your reads to your Kindle.",
    },
    {
      q: "Can I cancel during my trial or subscription?",
      a: "You will not be charged if you cancel your trial before its conclusion. While you will not have complete access to the entire Summarist library, you can still expand your knowledge with one curated book per day.",
    },
  ];

  const footerColumns = [
    {
      title: "Actions",
      links: ["Summarist Magazine", "Cancel Subscription", "Help", "Contact us"],
    },
    {
      title: "Useful Links",
      links: ["Pricing", "Summarist Business", "Gift Cards", "Authors & Publishers"],
    },
    {
      title: "Company",
      links: ["About", "Careers", "Partners", "Code of Conduct"],
    },
    {
      title: "Other",
      links: ["Sitemap", "Legal Notice", "Terms of Service", "Privacy Policies"],
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
      {/* ===== HERO ===== */}
      <section className="choose-plan__hero">
        <div className="choose-plan__hero--content">
          <h1 className="choose-plan__hero--title">
            Get unlimited access to many amazing books to read
          </h1>
          <p className="choose-plan__hero--subtitle">
            Turn ordinary moments into amazing learning opportunities
          </p>
        </div>
        <div className="choose-plan__hero--img-wrapper">
          <img
            src="/pricing-top.png"
            alt="Unlimited access to books"
            className="choose-plan__hero--img"
          />
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="choose-plan__features">
        <div className="choose-plan__feature">
          <div className="choose-plan__feature--icon">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm0 2.5L17.5 8H14V4.5zM8 13h8v2H8v-2zm0 4h5v2H8v-2z" />
            </svg>
          </div>
          <div className="choose-plan__feature--text">
            <b>Key ideas in few min</b> with many books to read
          </div>
        </div>

        <div className="choose-plan__feature">
          <div className="choose-plan__feature--icon">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 10c0-3.9 3.1-7 7-7h2v2c0 3.9-3.1 7-7 7h-1v4h-2v-6zm-1 2H9c-3.3 0-6-2.7-6-6V4h2c3.3 0 6 2.7 6 6v2zM7 20h10v2H7v-2z" />
            </svg>
          </div>
          <div className="choose-plan__feature--text">
            <b>3 million</b> people growing with Summarist everyday
          </div>
        </div>

        <div className="choose-plan__feature">
          <div className="choose-plan__feature--icon">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M11 5.5 8.6 7.9a1 1 0 0 0 0 1.4 1 1 0 0 0 1.4 0l2-2 4.6 4.6a1 1 0 0 1 0 1.4l-.3.3a1 1 0 0 1-1.4 0l-.7-.7-1.4 1.4-.7-.7-1.4 1.4-.7-.7-1.4 1.4a1 1 0 0 1-1.4 0l-4-4A1 1 0 0 1 3 10V6h3l2-2h5l3 3-2.5 2.5L11 5.5zM18 6h3v6h-3V6z" />
            </svg>
          </div>
          <div className="choose-plan__feature--text">
            <b>Precise recommendations</b> collections curated by experts
          </div>
        </div>
      </section>

      {/* ===== PLANS ===== */}
      <section className="choose-plan__body">
        <h2 className="choose-plan__section--title">Choose the plan that fits you</h2>

        <div
          className={`choose-plan__plan ${
            selectedPlan === "yearly" ? "choose-plan__plan--active" : ""
          }`}
          onClick={() => setSelectedPlan("yearly")}
        >
          <div className="choose-plan__plan--radio">
            {selectedPlan === "yearly" && (
              <div className="choose-plan__plan--radio-dot" />
            )}
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
            {selectedPlan === "monthly" && (
              <div className="choose-plan__plan--radio-dot" />
            )}
          </div>
          <div className="choose-plan__plan--details">
            <div className="choose-plan__plan--title">Premium Monthly</div>
            <div className="choose-plan__plan--price">$9.99/month</div>
            <div className="choose-plan__plan--sub">No trial included</div>
          </div>
        </div>

        <div className="choose-plan__cta--wrapper">
          <button className="choose-plan__cta--btn" onClick={handleSubscribe}>
            {selectedPlan === "yearly"
              ? "Start your free 7-day trial"
              : "Start your first month"}
          </button>
          <div className="choose-plan__cta--note">
            {selectedPlan === "yearly"
              ? "Cancel your trial at any time before it ends, and you won't be charged."
              : "30-day money back guarantee, no questions asked."}
          </div>
        </div>

        {/* ===== FAQ ===== */}
        <div className="choose-plan__faq">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`choose-plan__faq--item ${
                openFaq === i ? "choose-plan__faq--item-open" : ""
              }`}
            >
              <button
                className="choose-plan__faq--question"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
              >
                <span>{faq.q}</span>
                <svg
                  className="choose-plan__faq--chevron"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {openFaq === i && (
                <div className="choose-plan__faq--answer">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="choose-plan__footer">
        <div className="choose-plan__footer--wrapper">
          {footerColumns.map((col) => (
            <div className="choose-plan__footer--block" key={col.title}>
              <div className="choose-plan__footer--title">{col.title}</div>
              {col.links.map((link) => (
                <div className="choose-plan__footer--link" key={link}>
                  {link}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="choose-plan__footer--copyright">
          Copyright &copy; 2026 Summarist.
        </div>
      </footer>
    </div>
  );
}
