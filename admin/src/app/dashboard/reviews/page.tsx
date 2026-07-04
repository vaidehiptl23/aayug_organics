"use client";
import { useState, useEffect } from "react";
import { adminFetch } from "@/lib/api";
import { toast } from "@/lib/toast";
import { Star } from "lucide-react";

type Review = {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  isVerifiedBuyer: boolean;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  product: {
    name: string;
    sku: string;
  };
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPendingReviews = async () => {
    try {
      const res = await adminFetch<any>("/reviews/pending");
      setReviews(res.data ?? []);
    } catch (err) {
      console.error("Failed to load pending reviews", err);
      toast("Failed to load reviews", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingReviews();
  }, []);

  const moderateReview = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      await adminFetch(`/reviews/${id}/moderate`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast(`Review ${status.toLowerCase()} successfully`, "success");
    } catch (err) {
      toast("Failed to moderate review", "error");
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this review?")) return;
    try {
      await adminFetch(`/reviews/admin/${id}`, {
        method: "DELETE",
      });
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast("Review deleted successfully", "success");
    } catch (err) {
      toast("Failed to delete review", "error");
    }
  };

  const S = {
    font: "system-ui, -apple-system, sans-serif",
    th: { padding: "12px 16px", background: "#f8fafc", fontSize: 11, fontWeight: 700, color: "#94a3b8", textAlign: "left" as const, textTransform: "uppercase" as const, letterSpacing: 0.5, borderBottom: "1px solid #f1f5f9" },
    td: { padding: "13px 16px", fontSize: 13, color: "#374151", borderBottom: "1px solid #f8fafc", verticalAlign: "middle" as const },
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", fontFamily: "system-ui,sans-serif" }}>
        <p style={{ color: "#64748b", fontSize: 14 }}>Loading reviews...</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: S.font }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: 0 }}>Review Moderation</h1>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>{reviews.length} reviews pending moderation</p>
      </div>

      <div style={{ background: "white", borderRadius: 14, border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Product", "Customer", "Rating & Title", "Review Content", "Date", "Actions"].map((h) => (
                <th key={h} style={S.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 24, textAlign: "center", color: "#94a3b8" }}>
                  All caught up! No reviews pending moderation.
                </td>
              </tr>
            ) : (
              reviews.map((r, i) => (
                <tr key={r.id} style={{ background: i % 2 === 0 ? "white" : "#fafafa" }}>
                  <td style={{ ...S.td, fontWeight: 600, color: "#1b4332" }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{r.product?.name || "Product"}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>SKU: {r.product?.sku}</div>
                    </div>
                  </td>
                  <td style={S.td}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{r.user ? `${r.user.firstName} ${r.user.lastName}` : "Verified Buyer"}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>{r.user?.email}</div>
                    </div>
                  </td>
                  <td style={S.td}>
                    <div>
                      <div style={{ display: "flex", gap: 2, marginBottom: 4 }}>
                        {Array.from({ length: 5 }).map((_, starIdx) => (
                          <Star
                            key={starIdx}
                            size={12}
                            style={{
                              fill: starIdx < r.rating ? "#ca8a04" : "none",
                              color: starIdx < r.rating ? "#ca8a04" : "#cbd5e1"
                            }}
                          />
                        ))}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 12 }}>{r.title || "Untitled"}</div>
                    </div>
                  </td>
                  <td style={{ ...S.td, maxWidth: 300 }}>
                    <div style={{ fontSize: 12, color: "#64748b", lineHeight: "1.4", wordBreak: "break-word" }}>
                      {r.body || "No body content provided."}
                    </div>
                  </td>
                  <td style={S.td}>
                    {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td style={S.td}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => moderateReview(r.id, "APPROVED")}
                        style={{
                          padding: "6px 12px",
                          background: "#16a34a",
                          color: "white",
                          border: "none",
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => moderateReview(r.id, "REJECTED")}
                        style={{
                          padding: "6px 12px",
                          background: "#ea580c",
                          color: "white",
                          border: "none",
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => deleteReview(r.id)}
                        style={{
                          padding: "6px 12px",
                          background: "transparent",
                          color: "#dc2626",
                          border: "1px solid #fee2e2",
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
