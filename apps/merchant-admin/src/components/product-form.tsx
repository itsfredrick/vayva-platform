"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassPanel, Button, Input, Icon } from "@vayva/ui";

interface ProductFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export const ProductForm = ({
  initialData,
  isEdit = false,
}: ProductFormProps) => {
  const router = useRouter();
  const [hasVariants, setHasVariants] = useState(false);
  const [price, setPrice] = useState(initialData?.price || 0);
  const [costPrice, setCostPrice] = useState(initialData?.costPrice || 0);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [isProcessing, setIsProcessing] = useState(false);

  // Profit Calculation
  const profit = Number(price) - Number(costPrice);
  const margin = price > 0 ? (profit / price) * 100 : 0;

  // Magic Cut Pro
  const handleMagicCut = async (index: number) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const response = await fetch("/api/products/magic-cut", {
        method: "POST",
        body: JSON.stringify({ imageUrl: images[index] }),
      });
      const data = await response.json();
      if (data.url) {
        const newImages = [...images];
        newImages[index] = data.url;
        setImages(newImages);
      }
    } catch (error) {
      console.error("Magic Cut failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Test save
  const handleSave = () => {
    // Logic would go here
    router.push("/dashboard/products");
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-20">
      {/* Sticky Action Bar */}
      <div className="flex items-center justify-between sticky top-[80px] z-30 py-4 bg-[#142210]/95 backdrop-blur-xl border-b border-white/5 -mx-6 px-6 sm:mx-0 sm:px-0 sm:bg-transparent sm:border-none sm:backdrop-blur-none sm:static">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-white">
            {isEdit ? "Edit Product" : "Add Product"}
          </h1>
          {isEdit && (
            <p className="text-text-secondary text-sm">
              Last saved a few minutes ago
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => router.back()}>
            Discard
          </Button>
          <Button onClick={handleSave}>
            {isEdit ? "Save Changes" : "Save Product"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Media */}
          <GlassPanel className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">Media</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary uppercase border border-primary/20">
                Vayva Cut Pro Enabled
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {images.map((url, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                  <img src={url} alt="Product" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleMagicCut(idx)}
                      disabled={isProcessing}
                      className="p-2 bg-primary text-black rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
                      title="Magic Background Remover"
                    >
                      <Icon name="Scissors" size={16} />
                    </button>
                    <button className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20">
                      <Icon name="Trash2" size={16} />
                    </button>
                  </div>
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent animate-spin rounded-full mb-1" />
                      <span className="text-[8px] text-primary font-bold uppercase">Cutting...</span>
                    </div>
                  )}
                </div>
              ))}

              <div className="border border-dashed border-white/20 rounded-xl aspect-square flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer">
                <Icon
                  name="ImagePlus"
                  size={24}
                  className="text-text-secondary mb-1"
                />
                <p className="text-[10px] font-bold text-white">Add</p>
              </div>
            </div>

            <p className="text-xs text-text-secondary">
              Pro Tip: Use <b>Magic Remover</b> to get professional white backgrounds instantly.
            </p>
          </GlassPanel>

          {/* Basic Info */}
          <GlassPanel className="p-6">
            <h3 className="font-bold text-white mb-4">Basic Info</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">
                  Product Name
                </label>
                <Input
                  defaultValue={initialData?.name}
                  placeholder="e.g. Nike Air Max 90"
                />
              </div>
              <div>
                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">
                  Description
                </label>
                <textarea
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white resize-none focus:outline-none focus:border-primary transition-colors min-h-[120px]"
                  defaultValue={initialData?.description}
                  placeholder="Describe your product..."
                ></textarea>
              </div>
            </div>
          </GlassPanel>

          {/* Variants Toggle */}
          <GlassPanel className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white">Variants</h3>
                <p className="text-sm text-text-secondary">
                  Does this product have options like size or color?
                </p>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={hasVariants}
                onChange={(e) => setHasVariants(e.target.checked)}
              />
            </div>

            {hasVariants && (
              <div className="mt-6 pt-6 border-t border-white/5">
                {isEdit ? (
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                    <div>
                      <p className="font-bold text-white">Manage Variants</p>
                      <p className="text-xs text-text-secondary">
                        Edit sizes, colors, and prices
                      </p>
                    </div>
                    <Link
                      href={`/dashboard/products/${initialData?.id || "new"}/variants`}
                    >
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/10 text-white hover:bg-white/20"
                      >
                        Open Editor
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-sm text-state-warning bg-state-warning/10 p-4 rounded-xl border border-state-warning/20">
                    You can configure variants after saving the product for the
                    first time.
                  </div>
                )}
              </div>
            )}
          </GlassPanel>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6">
          {/* Status */}
          <GlassPanel className="p-6">
            <h3 className="font-bold text-white mb-4">Status</h3>
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-4">
                <input
                  type="radio"
                  name="status"
                  className="radio radio-primary"
                  defaultChecked={initialData?.status === "active"}
                />
                <span className="label-text text-white">Active</span>
              </label>
              <label className="label cursor-pointer justify-start gap-4">
                <input
                  type="radio"
                  name="status"
                  className="radio radio-primary"
                  defaultChecked={initialData?.status !== "active"}
                />
                <span className="label-text text-white">Draft</span>
              </label>
            </div>
          </GlassPanel>

          {/* Pricing */}
          <GlassPanel className="p-6">
            <h3 className="font-bold text-white mb-4">Pricing</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">
                  Price (₦)
                </label>
                <Input
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="0.00"
                  className="font-mono text-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">
                    Cost (COGS)
                  </label>
                  <Input
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">
                    Profit
                  </label>
                  <div className={`h-12 flex items-center px-1 font-bold text-sm ${profit >= 0 ? "text-primary" : "text-state-error"}`}>
                    {profit >= 0 ? "+" : ""} ₦{profit.toLocaleString()}
                    <span className="ml-1 text-[10px] opacity-60">
                      ({margin.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </GlassPanel>

          {/* Inventory */}
          <GlassPanel className="p-6">
            <h3 className="font-bold text-white mb-4">Inventory</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">
                  SKU (Optional)
                </label>
                <Input defaultValue={initialData?.sku} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white text-sm">Track quantity</span>
                <input
                  type="checkbox"
                  className="toggle toggle-sm toggle-primary"
                  defaultChecked
                />
              </div>
              <div>
                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">
                  Available Quantity
                </label>
                <Input
                  type="number"
                  defaultValue={initialData?.inventory || 0}
                />
              </div>
            </div>
          </GlassPanel>

          {/* Organization */}
          <GlassPanel className="p-6">
            <h3 className="font-bold text-white mb-4">Organization</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">
                  Category
                </label>
                <select className="h-12 w-full rounded-full bg-white/5 border border-white/10 px-4 text-white outline-none focus:border-primary">
                  <option>Select...</option>
                  <option>Apparel</option>
                  <option>Accessories</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">
                  Collections
                </label>
                <Input placeholder="Search collections..." />
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};
