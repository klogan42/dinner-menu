"use client";

import { useState, useEffect } from "react";
import { UtensilsCrossed } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SubscribePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [showPromo, setShowPromo] = useState(false);
  const [waitingForPayment, setWaitingForPayment] = useState(false);

  // After Stripe checkout redirect, poll until webhook sets status to "active"
  useEffect(() => {
    if (searchParams.get("paid") !== "1") return;
    setWaitingForPayment(true);
    let attempts = 0;
    const poll = setInterval(async () => {
      attempts++;
      await update();
      // The subscribe layout will redirect to / once DB shows access
      // Force a hard reload to trigger the server-side check
      if (attempts >= 8) {
        clearInterval(poll);
        window.location.href = "/";
      }
    }, 2000);
    return () => clearInterval(poll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      setLoading(false);
    }
  };

  const handlePromo = async () => {
    setPromoError("");
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode }),
      });
      if (res.ok) {
        await update();
        window.location.href = "/";
        return;
      } else {
        const data = await res.json();
        setPromoError(data.error || "Invalid code");
      }
    } catch {
      setPromoError("Something went wrong");
    }
    setLoading(false);
  };

  const trialEnd = session?.user?.trialEndsAt
    ? new Date(session.user.trialEndsAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-amber-50/40 px-4">
      <div className="w-full max-w-sm text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <UtensilsCrossed className="size-7 text-amber-600" />
          <h1 className="text-3xl font-display text-amber-900">Dinner Table</h1>
        </div>

        {waitingForPayment && (
          <div className="font-display text-amber-700 mb-6 text-lg">
            Processing your payment...
          </div>
        )}

        {!waitingForPayment && (
        <>
        <p className="font-display text-amber-700/70 mb-2">
          Your free trial ended{trialEnd ? ` on ${trialEnd}` : ""}.
        </p>
        <p className="font-display text-amber-600/60 text-sm mb-8">
          Unlock lifetime access for a one-time payment.
        </p>

        <div className="border border-amber-200 rounded-2xl bg-white p-6 mb-6 shadow-sm">
          <div className="text-4xl font-display text-amber-900 mb-1">$9.99</div>
          <div className="text-sm font-display text-amber-600/60 mb-4">one-time payment</div>
          <ul className="text-sm font-display text-amber-700 space-y-2 text-left mb-6">
            <li>Unlimited meal planning</li>
            <li>Full recipe library</li>
            <li>Restaurant tracking</li>
            <li>Shopping list generation</li>
          </ul>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-display rounded-xl transition-colors mb-3"
          >
            {loading && !showPromo ? "Redirecting..." : "Get Lifetime Access"}
          </button>

          {!showPromo ? (
            <button
              onClick={() => setShowPromo(true)}
              className="text-xs font-display text-amber-500 hover:text-amber-600 transition-colors"
            >
              Have a promo code?
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter code"
                className="flex-1 px-3 py-2 border border-amber-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 font-display text-sm text-amber-900"
              />
              <button
                onClick={handlePromo}
                disabled={loading || !promoCode.trim()}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-display text-sm rounded-xl transition-colors"
              >
                Apply
              </button>
            </div>
          )}
          {promoError && (
            <p className="font-display text-red-500 text-sm mt-2">{promoError}</p>
          )}
        </div>

        <p className="text-sm font-display text-amber-700">
          Secure payment via Stripe
        </p>
        </>
        )}
      </div>
    </div>
  );
}
