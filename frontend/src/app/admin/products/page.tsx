"use client";
import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search, Package } from "lucide-react";
import { products as initialProducts } from "@/data/products";
import { Product } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import { toast } from "@/components/ui/Toast";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [productList, setProductList] = useState<Product[]>(initialProducts);

  const filtered = productList.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setProductList((prev) => prev.filter((p) => p.id !== id));
    toast.success("Product deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-sm text-gray-500">{productList.length} products total</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-sm">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden dark:border-gray-700 dark:bg-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-5 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Product</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Category</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Price</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Stock</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Rating</th>
              <th className="px-5 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Status</th>
              <th className="px-5 py-3 text-right font-semibold text-gray-600 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
            {filtered.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={product.images[0]?.url ?? "https://placehold.co/40x40"}
                      alt={product.name}
                      width={40} height={40}
                      className="h-10 w-10 rounded-lg object-cover"
                      unoptimized
                    />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{product.name}</p>
                      <p className="text-xs text-gray-400">SKU: {product.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{product.category}</td>
                <td className="px-5 py-4">
                  <div>
                    <p className="font-semibold text-[#1b4332] dark:text-green-400">{formatPrice(product.price)}</p>
                    {product.originalPrice && (
                      <p className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`font-semibold ${product.stockCount < 20 ? "text-red-600" : "text-gray-700 dark:text-gray-300"}`}>
                    {product.stockCount}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="flex items-center gap-1 text-amber-600 font-semibold">
                    ⭐ {product.rating}
                    <span className="text-gray-400 font-normal text-xs">({product.reviewCount})</span>
                  </span>
                </td>
                <td className="px-5 py-4">
                  <Badge variant={product.inStock ? "success" : "danger"}>
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </Badge>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 rounded-lg text-gray-400 hover:text-[#1b4332] hover:bg-green-50 transition-colors" aria-label="Edit">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" aria-label="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Package className="h-10 w-10 text-gray-300" />
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}
