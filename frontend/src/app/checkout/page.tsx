"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle, ChevronRight, MapPin, Truck,
  CreditCard, ClipboardList, ArrowLeft, ShieldCheck, Zap,
} from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { formatPrice, cn } from "@/lib/utils";
import { CheckoutStep, CheckoutFormData } from "@/types";
import { toast } from "@/components/ui/Toast";

// ─── Razorpay types ───────────────────────────────────────────
declare global {
  interface Window {
    Razorpay: new (opts: RazorpayOptions) => { open(): void };
  }
}
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image: string;
  order_id: string;
  handler(r: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }): void;
  prefill: { name: string; email: string; contact: string };
  notes: Record<string, string>;
  theme: { color: string };
  modal: { ondismiss(): void; confirm_close: boolean };
}

// ─── Constants ────────────────────────────────────────────────
const STEPS: { key: CheckoutStep; label: string; icon: React.ReactNode }[] = [
  { key: "address",  label: "Address",  icon: <MapPin className="h-4 w-4" /> },
  { key: "delivery", label: "Delivery", icon: <Truck className="h-4 w-4" /> },
  { key: "payment",  label: "Payment",  icon: <CreditCard className="h-4 w-4" /> },
  { key: "review",   label: "Review",   icon: <ClipboardList className="h-4 w-4" /> },
];

const STATES = [
  "Gujarat","Maharashtra","Delhi","Karnataka","Tamil Nadu",
  "Rajasthan","Uttar Pradesh","West Bengal","Telangana","Madhya Pradesh",
  "Punjab","Haryana","Bihar","Odisha","Assam","Kerala","Himachal Pradesh",
].map((s) => ({ value: s, label: s }));

const DELIVERY_OPTIONS = [
  { id: "standard", label: "Standard Delivery", sub: "3–5 business days", price: 0,   note: "FREE",  badge: "" },
  { id: "express",  label: "Express Delivery",  sub: "1–2 business days", price: 149, note: "₹149", badge: "FAST" },
  { id: "overnight",label: "Overnight Delivery",sub: "Next business day", price: 249, note: "₹249", badge: "FASTEST" },
];

const INITIAL: CheckoutFormData = {
  fullName: "", phone: "", email: "", addressLine1: "", addressLine2: "",
  city: "", state: "", postalCode: "",
  deliveryMethod: "standard", paymentMethod: "upi",
  cardNumber: "", cardExpiry: "", cardCvv: "", cardName: "", upiId: "",
  saveAddress: false,
};

export default function CheckoutPage() {
  const { items, subtotal, discount, tax, total, clearCart } = useCartStore();
  const [step, setStep]           = useState<CheckoutStep>("address");
  const [form, setForm]           = useState<CheckoutFormData>(INITIAL);
  const [errors, setErrors]       = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [placing, setPlacing]     = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [rzpReady, setRzpReady]   = useState(false);

  const shipping = form.deliveryMethod === "express" ? 149 : form.deliveryMethod === "overnight" ? 249 : 0;
  const grandTotal = total() - discount() + shipping;
  const stepIndex  = STEPS.findIndex((s) => s.key === step);

  // ── Load Razorpay SDK once ─────────────────────────────────
  useEffect(() => {
    if (document.getElementById("rzp-sdk")) { setRzpReady(true); return; }
    const s = document.createElement("script");
    s.id  = "rzp-sdk";
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => setRzpReady(true);
    s.onerror = () => toast.error("Could not load payment SDK. Check your internet.");
    document.head.appendChild(s);
  }, []);

  const set = (k: keyof CheckoutFormData, v: string | boolean) =>
    setForm((p) => ({ ...p, [k]: v }));

  // ── Validation ─────────────────────────────────────────────
  const validateAddress = (): boolean => {
    const e: typeof errors = {};
    if (!form.fullName.trim())               e.fullName    = "Full name is required";
    if (!/^[6-9]\d{9}$/.test(form.phone))   e.phone       = "Valid 10-digit mobile required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.addressLine1.trim())           e.addressLine1 = "Street address is required";
    if (!form.city.trim())                   e.city        = "City is required";
    if (!form.state)                         e.state       = "Please select a state";
    if (!/^\d{6}$/.test(form.postalCode))   e.postalCode  = "Valid 6-digit PIN code required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Navigation ─────────────────────────────────────────────
  const handleNext = () => {
    if (step === "address" && !validateAddress()) return;
    if (step === "review") { handlePlaceOrder(); return; }
    const idx = STEPS.findIndex((s) => s.key === step);
    setStep(STEPS[idx + 1].key);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    const idx = STEPS.findIndex((s) => s.key === step);
    if (idx > 0) setStep(STEPS[idx - 1].key);
  };

  // ── Order placement ────────────────────────────────────────
  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      if (form.paymentMethod === "cod") {
        await handleCOD();
      } else {
        await handleRazorpay();
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
      setPlacing(false);
    }
  };

  const handleCOD = async () => {
    await new Promise((r) => setTimeout(r, 800));
    const num = `AYG-${Date.now().toString(36).toUpperCase()}`;
    setOrderNumber(num);
    clearCart();
    setOrderPlaced(true);
    toast.success("Order placed! 🎉");
    setPlacing(false);
  };

  const handleRazorpay = async () => {
    if (!rzpReady || !window.Razorpay) {
      toast.error("Payment is loading, please try again.");
      setPlacing(false);
      return;
    }

    const rzpKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "";

    if (!rzpKey || rzpKey === "rzp_test_placeholder") {
      // No key configured — use demo mode
      toast.info("Razorpay not configured — using demo mode");
      await new Promise((r) => setTimeout(r, 800));
      const num = `AYG-${Date.now().toString(36).toUpperCase()}`;
      setOrderNumber(num);
      clearCart();
      setOrderPlaced(true);
      setPlacing(false);
      return;
    }

    // Real Razorpay flow
    const options: RazorpayOptions = {
      key: rzpKey,
      amount: Math.round(grandTotal * 100),
      currency: "INR",
      name: "Aayug Organics",
      description: `Order for ${items.length} item${items.length > 1 ? "s" : ""}`,
      image: "https://placehold.co/80x80/1b4332/ffffff?text=AO",
      order_id: `order_${Date.now()}`,
      handler: (response) => {
        const num = `AYG-${Date.now().toString(36).toUpperCase()}`;
        setOrderNumber(num);
        clearCart();
        setOrderPlaced(true);
        toast.success(`Payment successful! Order ${num} placed 🎉`);
      },
      prefill: {
        name: form.fullName,
        email: form.email,
        contact: form.phone,
      },
      notes: {
        address: `${form.addressLine1}, ${form.city}, ${form.state}`,
      },
      theme: { color: "#1b4332" },
      modal: {
        ondismiss: () => {
          toast.info("Payment cancelled. Your cart is saved.");
          setPlacing(false);
        },
        confirm_close: true,
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    setPlacing(false);
  };

  // ── Order success screen ───────────────────────────────────
  if (orderPlaced) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="rounded-full bg-green-100 p-6">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Order Placed! 🎉</h1>
          <p className="mt-2 text-gray-500 max-w-md">
            Thank you, <strong>{form.fullName}</strong>! Your order is confirmed and we'll send updates to{" "}
            <strong>{form.email}</strong>.
          </p>
        </div>
        <div className="rounded-2xl bg-gray-50 dark:bg-gray-800 px-8 py-5 space-y-1 text-center">
          <p className="text-sm text-gray-500">Order Number</p>
          <p className="text-2xl font-bold text-[#1b4332] dark:text-green-400">{orderNumber}</p>
          <p className="text-sm text-gray-500">Estimated delivery: 3–5 business days</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/dashboard/orders"><Button variant="outline">Track Order</Button></Link>
          <Link href="/products"><Button>Continue Shopping</Button></Link>
        </div>
      </div>
    );
  }

  // ── Empty cart ─────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Your cart is empty.</p>
        <Link href="/products"><Button>Shop Now</Button></Link>
      </div>
    );
  }

  // ── Main checkout UI ───────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#fcfbf7] dark:bg-gray-950">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">

        <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">Checkout</h1>

        {/* Progress stepper */}
        <div className="mb-10 flex items-center justify-center gap-1 flex-wrap">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <div className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
                i < stepIndex  ? "bg-[#1b4332] text-white" :
                i === stepIndex ? "bg-[#1b4332] text-white ring-4 ring-[#1b4332]/20" :
                                  "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
              )}>
                {i < stepIndex ? <CheckCircle className="h-4 w-4" /> : s.icon}
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRight className={cn("mx-1 h-4 w-4", i < stepIndex ? "text-[#1b4332]" : "text-gray-300")} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* ── Left: Form ─────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">

              {/* STEP 1 – Address */}
              {step === "address" && (
                <div>
                  <h2 className="mb-6 text-xl font-bold text-gray-800 dark:text-white">Shipping Address</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input label="Full Name *" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} error={errors.fullName} placeholder="Rahul Sharma" />
                    <Input label="Phone Number *" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} error={errors.phone} placeholder="9876543210" />
                    <div className="sm:col-span-2">
                      <Input label="Email Address *" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} error={errors.email} placeholder="rahul@example.com" />
                    </div>
                    <div className="sm:col-span-2">
                      <Input label="Street Address *" value={form.addressLine1} onChange={(e) => set("addressLine1", e.target.value)} error={errors.addressLine1} placeholder="House No., Street, Area" />
                    </div>
                    <div className="sm:col-span-2">
                      <Input label="Landmark" value={form.addressLine2} onChange={(e) => set("addressLine2", e.target.value)} placeholder="Near landmark (optional)" />
                    </div>
                    <Input label="City *" value={form.city} onChange={(e) => set("city", e.target.value)} error={errors.city} placeholder="Ahmedabad" />
                    <Select
                      label="State *"
                      value={form.state}
                      onChange={(e) => set("state", e.target.value)}
                      options={[{ value: "", label: "Select State" }, ...STATES]}
                      error={errors.state}
                    />
                    <Input label="PIN Code *" value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)} error={errors.postalCode} placeholder="380001" maxLength={6} />
                  </div>
                  <label className="mt-4 flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.saveAddress} onChange={(e) => set("saveAddress", e.target.checked)} className="accent-[#1b4332]" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Save address for future orders</span>
                  </label>
                </div>
              )}

              {/* STEP 2 – Delivery */}
              {step === "delivery" && (
                <div>
                  <h2 className="mb-6 text-xl font-bold text-gray-800 dark:text-white">Delivery Method</h2>
                  <div className="space-y-3">
                    {DELIVERY_OPTIONS.map((opt) => (
                      <label key={opt.id} className={cn(
                        "flex items-center gap-4 cursor-pointer rounded-xl border-2 p-4 transition-all",
                        form.deliveryMethod === opt.id
                          ? "border-[#1b4332] bg-green-50 dark:bg-green-900/10"
                          : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                      )}>
                        <input type="radio" name="delivery" value={opt.id} checked={form.deliveryMethod === opt.id} onChange={() => set("deliveryMethod", opt.id)} className="accent-[#1b4332]" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-800 dark:text-white">{opt.label}</p>
                            {opt.badge && (
                              <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700 dark:bg-green-900 dark:text-green-400">
                                {opt.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{opt.sub}</p>
                        </div>
                        <span className={cn("font-bold text-sm", opt.price === 0 ? "text-green-600" : "text-gray-800 dark:text-white")}>
                          {opt.note}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3 – Payment */}
              {step === "payment" && (
                <div>
                  <h2 className="mb-6 text-xl font-bold text-gray-800 dark:text-white">Payment Method</h2>
                  <div className="space-y-3 mb-5">
                    {[
                      { id: "upi",  label: "UPI / Net Banking",      sub: "GPay, PhonePe, Paytm, BHIM — via Razorpay", emoji: "📱" },
                      { id: "card", label: "Credit / Debit Card",     sub: "Visa, Mastercard, RuPay — via Razorpay",    emoji: "💳" },
                      { id: "cod",  label: "Cash on Delivery (COD)",  sub: "Pay in cash when your order arrives",        emoji: "🚚" },
                    ].map((opt) => (
                      <label key={opt.id} className={cn(
                        "flex items-center gap-4 cursor-pointer rounded-xl border-2 p-4 transition-all",
                        form.paymentMethod === opt.id
                          ? "border-[#1b4332] bg-green-50 dark:bg-green-900/10"
                          : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                      )}>
                        <input type="radio" name="payment" value={opt.id} checked={form.paymentMethod === opt.id} onChange={() => set("paymentMethod", opt.id)} className="accent-[#1b4332]" />
                        <span className="text-2xl">{opt.emoji}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 dark:text-white">{opt.label}</p>
                          <p className="text-xs text-gray-500">{opt.sub}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Razorpay security notice */}
                  {form.paymentMethod !== "cod" && (
                    <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                      <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">Secured by Razorpay</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                          256-bit SSL encryption. Your payment info is never stored on our servers. Trusted by 8 crore+ Indians.
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {["UPI", "GPay", "PhonePe", "Paytm", "Visa", "Mastercard", "RuPay", "EMI"].map((m) => (
                            <span key={m} className="rounded border border-blue-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-blue-400">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {form.paymentMethod === "cod" && (
                    <div className="rounded-xl bg-amber-50 p-4 dark:bg-amber-900/20">
                      <p className="text-sm text-amber-800 dark:text-amber-400">
                        🚚 Pay in cash when your order is delivered. No extra charges for COD.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4 – Review */}
              {step === "review" && (
                <div>
                  <h2 className="mb-6 text-xl font-bold text-gray-800 dark:text-white">Review Your Order</h2>
                  <div className="space-y-3">
                    <ReviewBlock title="Shipping Address">
                      <p className="font-medium text-gray-800 dark:text-white">{form.fullName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{form.phone} · {form.email}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{form.addressLine1}{form.addressLine2 ? `, ${form.addressLine2}` : ""}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{form.city}, {form.state} – {form.postalCode}</p>
                    </ReviewBlock>
                    <ReviewBlock title="Delivery">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {DELIVERY_OPTIONS.find((d) => d.id === form.deliveryMethod)?.label} &middot;{" "}
                        {DELIVERY_OPTIONS.find((d) => d.id === form.deliveryMethod)?.sub}
                      </p>
                    </ReviewBlock>
                    <ReviewBlock title="Payment">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {form.paymentMethod === "cod"  ? "Cash on Delivery" :
                         form.paymentMethod === "upi"  ? "UPI / Net Banking via Razorpay 🔒" :
                                                         "Card via Razorpay 🔒"}
                      </p>
                    </ReviewBlock>
                    <ReviewBlock title="Items Ordered">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex justify-between text-sm py-0.5">
                          <span className="text-gray-600 dark:text-gray-400">{item.product.name} × {item.quantity}</span>
                          <span className="font-medium text-gray-800 dark:text-white">{formatPrice(item.product.price * item.quantity)}</span>
                        </div>
                      ))}
                    </ReviewBlock>
                  </div>
                </div>
              )}

              {/* Nav buttons */}
              <div className="mt-8 flex items-center justify-between">
                <Button variant="ghost" onClick={handleBack} disabled={stepIndex === 0} className="gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button onClick={handleNext} loading={placing} size="lg" className="gap-2">
                  {step === "review"
                    ? form.paymentMethod === "cod"
                      ? "Place Order (COD)"
                      : <><Zap className="h-4 w-4" /> Pay ₹{grandTotal.toLocaleString("en-IN")} via Razorpay</>
                    : <>Continue <ChevronRight className="h-4 w-4" /></>
                  }
                </Button>
              </div>
            </div>
          </div>

          {/* ── Right: Order summary ─────────────────────────── */}
          <div>
            <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 font-bold text-gray-800 dark:text-white">Order Summary</h3>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <Image
                      src={item.product.images[0]?.url ?? "https://placehold.co/48x48"}
                      alt={item.product.name}
                      width={48} height={48}
                      className="h-12 w-12 rounded-lg object-cover shrink-0"
                      unoptimized
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-gray-400">× {item.quantity} · {item.product.weight}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-800 dark:text-white whitespace-nowrap">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-gray-100 pt-3 dark:border-gray-700 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-800 dark:text-white">{formatPrice(subtotal())}</span>
                </div>
                {discount() > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Product Discount</span>
                    <span className="font-medium text-green-600">−{formatPrice(discount())}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className={cn("font-medium", shipping === 0 ? "text-green-600" : "text-gray-800 dark:text-white")}>
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax (GST 18%)</span>
                  <span className="font-medium text-gray-800 dark:text-white">{formatPrice(tax())}</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-2 dark:border-gray-700">
                  <span className="font-bold text-gray-800 dark:text-white text-base">Total</span>
                  <span className="font-bold text-[#1b4332] text-lg dark:text-green-400">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Razorpay badge */}
              {form.paymentMethod !== "cod" && (
                <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-gray-50 py-2.5 dark:bg-gray-700">
                  <ShieldCheck className="h-4 w-4 text-blue-500" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">100% Secure · Powered by</span>
                  <span className="text-xs font-bold text-blue-600">Razorpay</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function ReviewBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#1b4332] dark:text-green-400">{title}</p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}
