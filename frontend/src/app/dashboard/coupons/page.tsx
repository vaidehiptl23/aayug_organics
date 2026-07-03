"use client";
import { useState } from "react";
import { Tag, Copy, Check, Gift } from "lucide-react";
import { toast } from "@/components/ui/Toast";

type Coupon = {
  code: string;
  discount: string;
  description: string;
  minSpend: string;
  expiry: string;
};

const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: "ORGANIC10",
    discount: "10% OFF",
    description: "Get 10% off on all items across our premium organic range.",
    minSpend: "No minimum purchase requirement",
    expiry: "Expires Dec 31, 2026",
  },
  {
    code: "WELCOME50",
    discount: "₹50 OFF",
    description: "Enjoy a flat ₹50 discount on your first order with us.",
    minSpend: "Minimum order value: ₹299",
    expiry: "Expires Dec 31, 2026",
  },
];

export default function CouponsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code ${code} copied! 🎫`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Tag className="h-6 w-6 text-[#1b4332]" /> My Coupons
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Apply these exclusive promo codes at checkout to save on your orders.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {AVAILABLE_COUPONS.map((coupon) => (
          <div
            key={coupon.code}
            className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-800 flex"
          >
            {/* Left Tag graphic */}
            <div className="flex w-24 shrink-0 flex-col items-center justify-center bg-gradient-to-b from-[#1b4332] to-[#2d6a4f] p-4 text-center text-white">
              <Gift className="mb-2 h-6 w-6 opacity-85" />
              <span className="text-xs font-bold uppercase tracking-wider opacity-90">Save</span>
              <span className="text-lg font-black">{coupon.discount.split(" ")[0]}</span>
              <span className="text-[10px] font-medium uppercase opacity-75">{coupon.discount.split(" ")[1]}</span>
            </div>

            {/* Dash border separator */}
            <div className="relative flex w-1 flex-col items-center justify-between py-2 shrink-0">
              <div className="absolute -left-1 -top-2 h-4 w-4 rounded-full bg-[#fcfbf7] dark:bg-gray-950"></div>
              <div className="h-full border-r border-dashed border-gray-200 dark:border-gray-700"></div>
              <div className="absolute -left-1 -bottom-2 h-4 w-4 rounded-full bg-[#fcfbf7] dark:bg-gray-950"></div>
            </div>

            {/* Right details */}
            <div className="flex-1 p-5 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white group-hover:text-[#1b4332] transition-colors">
                  {coupon.code}
                </h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {coupon.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-50 dark:border-gray-700/50 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    {coupon.minSpend}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {coupon.expiry}
                  </p>
                </div>

                <button
                  onClick={() => copyToClipboard(coupon.code)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-[#1b4332] transition hover:bg-green-100 dark:bg-green-950/30 dark:text-green-400 dark:hover:bg-green-950/50"
                >
                  {copiedCode === coupon.code ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-green-600" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
