// Simple toast without external dependency
export function toast(message: string, type: "success" | "error" | "info" = "info") {
  if (typeof window === "undefined") return;
  const div = document.createElement("div");
  const colors = { success: "#1b4332", error: "#dc2626", info: "#2563eb" };
  div.style.cssText = `position:fixed;bottom:24px;right:24px;z-index:9999;background:${colors[type]};color:white;padding:12px 20px;border-radius:12px;font-size:14px;font-weight:500;box-shadow:0 8px 24px rgba(0,0,0,0.2);animation:slideIn 0.3s ease`;
  div.textContent = message;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 3000);
}
