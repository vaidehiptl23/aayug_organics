import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="text-8xl select-none">🌿</div>
      <div>
        <h1 className="text-6xl font-bold text-[#1b4332] dark:text-green-400">404</h1>
        <h2 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">Page Not Found</h2>
        <p className="mt-2 text-gray-500 max-w-md">
          Oops! Looks like this page has gone back to nature. Let&apos;s find you something better.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/"><Button className="gap-2"><Home className="h-4 w-4" /> Go Home</Button></Link>
        <Link href="/products"><Button variant="outline" className="gap-2"><Search className="h-4 w-4" /> Browse Products</Button></Link>
      </div>
    </div>
  );
}
