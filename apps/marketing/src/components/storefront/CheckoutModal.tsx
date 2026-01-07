import React, { useState } from "react";
import { CartItem } from "@/hooks/storefront/useStorefrontCart";
import { Modal } from "@vayva/ui";
import { Loader2, ChevronRight, CheckCircle2, MapPin, User, CreditCard, ShoppingBag, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  total: number;
  storeSlug: string;
  onSuccess: () => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  cart,
  total,
  storeSlug,
  onSuccess,
}: CheckoutModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep((s) => (s + 1) as 1 | 2 | 3);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/storefront/${storeSlug}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: formData,
          items: cart,
          total,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Checkout failed");

      if (data.authorization_url) {
        toast.loading("Redirecting to secure payment...", { duration: 4000 });
        setTimeout(() => {
          window.location.href = data.authorization_url;
        }, 1000);
      } else {
        toast.success("Order placed successfully!");
        onSuccess();
        onClose();
        setStep(1); // Reset
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to process order");
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { id: 1, label: "Contact", icon: User },
    { id: 2, label: "Delivery", icon: MapPin },
    { id: 3, label: "Payment", icon: CreditCard },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span>Secure Checkout</span>
          <span className="text-gray-400 text-sm font-normal">Step {step} of 3</span>
        </div>
      }
    >
      <div className="flex justify-between mb-8 px-2 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -z-10 -translate-y-1/2"></div>
        {steps.map((s) => {
          const Icon = s.icon;
          const isActive = s.id === step;
          const isCompleted = s.id < step;
          return (
            <div key={s.id} className="flex flex-col items-center gap-1 bg-white px-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${isActive ? 'border-black text-black bg-white' : isCompleted ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-200 text-gray-300'}`}>
                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-black' : 'text-gray-400'}`}>{s.label}</span>
            </div>
          )
        })}
      </div>

      <div className="mb-6 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowSummary(!showSummary)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <ShoppingBag className="w-4 h-4" />
            Order Summary <span className="text-gray-400">({cart.length})</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-sm">
            ₦{total.toLocaleString()}
            {showSummary ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        <AnimatePresence>
          {showSummary && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0 border-t border-gray-100 space-y-3">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-start text-sm">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-white rounded border border-gray-200 relative">
                        <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{item.quantity}</span>
                        {item.image && <img src={item.image} className="w-full h-full object-cover rounded" />}
                      </div>
                      <span className="text-gray-600 line-clamp-1 max-w-[150px]">{item.name}</span>
                    </div>
                    <span className="font-medium">₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSubmit} className="relative min-h-[300px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Full Name</label>
                <input
                  required
                  autoFocus
                  type="text"
                  placeholder="e.g. John Doe"
                  className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Email Address</label>
                <input
                  required
                  type="email"
                  placeholder="john@example.com"
                  className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Phone Details</label>
                <input
                  required
                  type="tel"
                  placeholder="+234..."
                  className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Street Address</label>
                <input
                  required
                  autoFocus
                  type="text"
                  placeholder="e.g. 123 Lagos St"
                  className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-500">City</label>
                  <input
                    required
                    type="text"
                    placeholder="Ikeja"
                    className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-500">State / Zip</label>
                  <input
                    required
                    type="text"
                    placeholder="Lagos"
                    className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 text-center py-4"
            >
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-black" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Ready to Pay</h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">
                  You will be redirected to our secure payment gateway to complete your purchase of <span className="font-bold text-black">₦{total.toLocaleString()}</span>.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3 pt-6 mt-6 border-t border-gray-100">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(s => (s - 1) as 1 | 2 | 3)}
              className="px-6 py-3 font-bold text-black bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Back
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-900 disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : null}
            {step === 3 ? `Pay ₦${total.toLocaleString()}` : `Continue to ${steps[step].label}`}
            {step < 3 && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </form>
    </Modal>
  );
}
