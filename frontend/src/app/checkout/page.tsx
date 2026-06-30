"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, ChevronRight, MapPin, Truck, CreditCard, ClipboardList, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { formatPrice, cn } from "@/lib/utils";
import { CheckoutStep, CheckoutFormData } from "@/types";
import { toast } from "@/components/ui/Toast";

const STEPS: { key: CheckoutStep; label: string; icon: React.ReactNode }[] = [
  { key: "address", label: "Address", icon: <MapPin className="h-4 w-4" /> },
  { key: "delivery", label: "Delivery", icon: <Truck className="h-4 w-4" /> },
  { key: "payment", label: "Payment", icon: <CreditCard className="h-4 w-4" /> },
  { key: "review", label: "Review", icon: <ClipboardList className="h-4 w-4" /> },
];

const STATES = [
  "Gujarat", "Maharashtra", "Delhi", "Karnataka", "Tamil Nadu",
  "Rajasthan", "Uttar Pradesh", "West Bengal", "Telangana", "Madhya Pradesh",
].map((s) => ({ value: s, label: s }));

const DELIVERY_OPTIONS = [
  { id: "standard", label: "Standard Delivery", sub: "3–5 business days", price: 0, note: "FREE" },
  { id: "express", label: "Express Delivery", sub: "1–2 business days", price: 149, note: "₹149" },
  { id: "overnight", label: "Overnight Delivery", sub: "Next business day", price: 249, note: "₹249" },
];

const INITIAL_FORM: CheckoutFormData = {
  fullName: "", phone: "", email: "", addressLine1: "", addressLine2: "",
  city: "", state: "", postalCode: "",
  deliveryMethod: "standard",
  paymentMethod: "upi",
  cardNumber: "", cardExpiry: "", cardCvv: "", cardName: "", upiId: "",
  saveAddress: false,
};

export default function CheckoutPage() {
  const { items, subtotal, discount, tax, total } = useCartStore();
  const [step, setStep] = useState<CheckoutStep>("address");
  const [form, setForm] = useState<CheckoutFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber] = useState(`AYG-${Date.now().toString(36).toUpperCase()}`);

  const set = (field: keyof CheckoutFormData, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  const shipping = form.deliveryMethod === "express" ? 149 : form.deliveryMethod === "overnight" ? 249 : 0;
  const grandTotal = total() - discount() + shipping;

  const validateAddress = () => {
    const e: typeof errors = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = "Enter a valid 10-digit mobile number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.addressLine1.trim()) e.addressLine1 = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.state) e.state = "Select a state";
    if (!/^\d{6}$/.test(form.postalCode)) e.postalCode = "Enter a valid 6-digit PIN code";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    if (form.paymentMethod === "card") {
      const e: typeof errors = {};
      if (form.cardNumber.replace(/\s/g, "").length < 16) e.cardNumber = "Enter valid card number";
      if (!form.cardExpiry) e.cardExpiry = "Enter expiry date";
      if (form.cardCvv.length < 3) e.cardCvv = "Enter valid CVV";
      if (!form.cardName.trim()) e.cardName = "Enter cardholder name";
      setErrors(e);
      return Object.keys(e).length === 0;
    }
    if (form.paymentMethod === "upi" && !form.upiId.includes("@")) {
      setErrors({ upiId: "Enter a valid UPI ID (e.g., name@upi)" });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    const idx = STEPS.findIndex((s) => s.key === step);
    if (step === "address" && !validateAddress()) return;
    if (step === "payment" && !validatePayment()) return;
    if (step === "review") {
      handlePlaceOrder();
      return;
    }
    setStep(STEPS[idx + 1].key);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    const idx = STEPS.findIndex((s) => s.key === step);
    if (idx > 0) setStep(STEPS[idx - 1].key);
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setPlacing(false);
    setOrderPlaced(true);
    useCartStore.getState().clearCart();
  };

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  if (orderPlaced) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
        <div className="rounded-full bg-green-100 p-6 mb-6">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Order Placed! 🎉</h1>
        <p className="mt-3 text-gray-500 max-w-md">
          Thank you, <strong>{form.fullName}</strong>! Your order <strong>{orderNumber}</strong> has been confirmed.
          We&apos;ll send updates to <strong>{form.email}</strong>.
        </p>
        <div className="mt-6 rounded-2xl bg-gray-50 px-8 py-5 dark:bg-gray-800 space-y-1">
          <p className="text-sm text-gray-500">Order Number</p>
          <p className="text-xl font-bold text-[#1b4332] dark:text-green-400">{orderNumber}</p>
          <p className="text-sm text-gray-500 mt-1">Estimated delivery: 3–5 business days</p>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/dashboard/orders"><Button variant="outline">Track Order</Button></Link>
          <Link href="/products"><Button>Continue Shopping</Button></Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Your cart is empty.</p>
        <Link href="/products"><Button>Shop Now</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfbf7] dark:bg-gray-950">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">Checkout</h1>

        {/* Progress Steps */}
        <div className="mb-10 flex items-center justify-center">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <div
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
                  i < stepIndex ? "bg-[#1b4332] text-white" :
                  i === stepIndex ? "bg-[#1b4332] text-white ring-4 ring-[#1b4332]/20" :
                  "bg-gray-100 text-gray-400 dark:bg-gray-800"
                )}
              >
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
          {/* Form area */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">

              {/* STEP 1: Address */}
              {step === "address" && (
                <div>
                  <h2 className="mb-6 text-xl font-bold text-gray-800 dark:text-white">Shipping Address</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input label="Full Name *" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} error={errors.fullName} placeholder="Rahul Sharma" />
                    <Input label="Phone Number *" value={form.phone} onChange={(e) => set("phone", e.target.value)} error={errors.phone} placeholder="9876543210" type="tel" />
                    <div className="sm:col-span-2">
                      <Input label="Email Address *" value={form.email} onChange={(e) => set("email", e.target.value)} error={errors.email} placeholder="rahul@example.com" type="email" />
                    </div>
                    <div className="sm:col-span-2">
                      <Input label="Address Line 1 *" value={form.addressLine1} onChange={(e) => set("addressLine1", e.target.value)} error={errors.addressLine1} placeholder="House No., Street, Area" />
                    </div>
                    <div className="sm:col-span-2">
                      <Input label="Address Line 2" value={form.addressLine2} onChange={(e) => set("addressLine2", e.target.value)} placeholder="Landmark (optional)" />
                    </div>
                    <Input label="City *" value={form.city} onChange={(e) => set("city", e.target.value)} error={errors.city} placeholder="Ahmedabad" />
                    <Select label="State *" value={form.state} onChange={(e) => set("state", e.target.value)} options={[{ value: "", label: "Select State" }, ...STATES]} error={errors.state} />
                    <Input label="PIN Code *" value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)} error={errors.postalCode} placeholder="380001" maxLength={6} />
                  </div>
                  <label className="mt-4 flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.saveAddress} onChange={(e) => set("saveAddress", e.target.checked)} className="accent-[#1b4332]" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Save this address for future orders</span>
                  </label>
                </div>
              )}

              {/* STEP 2: Delivery */}
              {step === "delivery" && (
                <div>
                  <h2 className="mb-6 text-xl font-bold text-gray-800 dark:text-white">Delivery Method</h2>
                  <div className="space-y-3">
                    {DELIVERY_OPTIONS.map((opt) => (
                      <label
                        key={opt.id}
                        className={cn(
                          "flex items-center gap-4 cursor-pointer rounded-xl border-2 p-4 transition-all",
                          form.deliveryMethod === opt.id
                            ? "border-[#1b4332] bg-green-50 dark:bg-green-900/10"
                            : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                        )}
                      >
                        <input type="radio" name="delivery" value={opt.id} checked={form.deliveryMethod === opt.id} onChange={() => set("deliveryMethod", opt.id)} className="accent-[#1b4332]" />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 dark:text-white">{opt.label}</p>
                          <p className="text-sm text-gray-500">{opt.sub}</p>
                        </div>
                        <span className={cn("font-bold", opt.price === 0 ? "text-green-600" : "text-gray-800 dark:text-white")}>
                          {opt.note}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Payment */}
              {step === "payment" && (
                <div>
                  <h2 className="mb-6 text-xl font-bold text-gray-800 dark:text-white">Payment Method</h2>
                  <div className="space-y-3 mb-6">
                    {[
                      { id: "upi", label: "UPI / Net Banking", sub: "GPay, PhonePe, Paytm, BHIM" },
                      { id: "card", label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay" },
                      { id: "cod", label: "Cash on Delivery", sub: "Pay when delivered" },
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        className={cn(
                          "flex items-center gap-4 cursor-pointer rounded-xl border-2 p-4 transition-all",
                          form.paymentMethod === opt.id
                            ? "border-[#1b4332] bg-green-50 dark:bg-green-900/10"
                            : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                        )}
                      >
                        <input type="radio" name="payment" value={opt.id} checked={form.paymentMethod === opt.id} onChange={() => set("paymentMethod", opt.id)} className="accent-[#1b4332]" />
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-white">{opt.label}</p>
                          <p className="text-xs text-gray-500">{opt.sub}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {form.paymentMethod === "card" && (
                    <div className="grid grid-cols-1 gap-4 rounded-xl bg-gray-50 p-5 dark:bg-gray-900 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <Input label="Card Number" value={form.cardNumber} onChange={(e) => set("cardNumber", e.target.value.replace(/\D/g, "").replace(/(\d{4})/g, "$1 ").trim())} error={errors.cardNumber} placeholder="4000 1234 5678 9010" maxLength={19} />
                      </div>
                      <Input label="Expiry Date" value={form.cardExpiry} onChange={(e) => set("cardExpiry", e.target.value)} error={errors.cardExpiry} placeholder="MM/YY" maxLength={5} />
                      <Input label="CVV" value={form.cardCvv} onChange={(e) => set("cardCvv", e.target.value.replace(/\D/g, ""))} error={errors.cardCvv} placeholder="123" maxLength={3} type="password" />
                      <div className="sm:col-span-2">
                        <Input label="Cardholder Name" value={form.cardName} onChange={(e) => set("cardName", e.target.value)} error={errors.cardName} placeholder="Name on card" />
                      </div>
                    </div>
                  )}

                  {form.paymentMethod === "upi" && (
                    <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-900">
                      <Input label="UPI ID" value={form.upiId} onChange={(e) => set("upiId", e.target.value)} error={errors.upiId} placeholder="yourname@upi" hint="Enter your UPI ID (e.g., mobile@paytm)" />
                    </div>
                  )}

                  {form.paymentMethod === "cod" && (
                    <div className="rounded-xl bg-amber-50 p-4 dark:bg-amber-900/20">
                      <p className="text-sm text-amber-800 dark:text-amber-400">
                        🚚 Pay in cash or UPI at the time of delivery. No additional charges.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: Review */}
              {step === "review" && (
                <div>
                  <h2 className="mb-6 text-xl font-bold text-gray-800 dark:text-white">Review Your Order</h2>
                  <div className="space-y-4">
                    <Section title="Shipping To">
                      <p className="font-medium text-gray-800 dark:text-white">{form.fullName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{form.phone} · {form.email}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{form.addressLine1}{form.addressLine2 ? `, ${form.addressLine2}` : ""}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{form.city}, {form.state} – {form.postalCode}</p>
                    </Section>
                    <Section title="Delivery">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {DELIVERY_OPTIONS.find((d) => d.id === form.deliveryMethod)?.label} · {DELIVERY_OPTIONS.find((d) => d.id === form.deliveryMethod)?.sub}
                      </p>
                    </Section>
                    <Section title="Payment">
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{form.paymentMethod === "upi" ? `UPI: ${form.upiId}` : form.paymentMethod === "cod" ? "Cash on Delivery" : `Card ending ****${form.cardNumber.slice(-4)}`}</p>
                    </Section>
                    <Section title="Items">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">{item.product.name} × {item.quantity}</span>
                          <span className="font-medium text-gray-800 dark:text-white">{formatPrice(item.product.price * item.quantity)}</span>
                        </div>
                      ))}
                    </Section>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="mt-8 flex justify-between">
                <Button variant="ghost" onClick={handleBack} disabled={stepIndex === 0} className="gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button onClick={handleNext} loading={placing} className="gap-2">
                  {step === "review" ? "Place Order" : "Continue"}
                  {step !== "review" && <ChevronRight className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Order summary sidebar */}
          <div className="space-y-4">
            <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 font-bold text-gray-800 dark:text-white">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <Image src={item.product.images[0]?.url ?? "/placeholder.jpg"} alt={item.product.name} width={48} height={48} className="h-12 w-12 rounded-lg object-cover" unoptimized />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-gray-400">× {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-800 dark:text-white">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 border-t border-gray-100 pt-3 dark:border-gray-700">
                {[
                  { label: "Subtotal", value: formatPrice(subtotal()) },
                  ...(discount() > 0 ? [{ label: "Discount", value: `−${formatPrice(discount())}`, green: true }] : []),
                  { label: "Shipping", value: shipping === 0 ? "FREE" : formatPrice(shipping), green: shipping === 0 },
                  { label: "Tax (GST)", value: formatPrice(tax()) },
                ].map(({ label, value, green }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className={cn("font-medium", green ? "text-green-600" : "text-gray-800 dark:text-white")}>{value}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-gray-100 pt-2 dark:border-gray-700">
                  <span className="font-bold text-gray-800 dark:text-white">Total</span>
                  <span className="font-bold text-[#1b4332] text-lg dark:text-green-400">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#1b4332] dark:text-green-400">{title}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
