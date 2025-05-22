"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle, MinusCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrlogoZarlagaPage() {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <main className="flex flex-col items-center justify-center w-screen h-screen bg-gradient-to-br from-[#e0f7fa] to-[#ffffff] px-8">
    <div className="min-h-screen w-500 flex items-center justify-center  from-white to-black p-4 relative">
      {/* Kiosk Card Slot */}
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-40 h-3 bg-gray-600 rounded-b-md shadow-md"></div>

      {/* Kiosk Machine */}
      <div className="w-full max-w-md bg-gray-800 border-4 border-gray-700 rounded-xl p-6 shadow-2xl space-y-6">
        {/* Back Button */}
        <Button
          onClick={handleBackClick}
          className="w-full text-xl py-3 rounded-lg bg-gray-600 hover:bg-gray-500 transition text-white font-semibold"
        >
          🔙 Буцах
        </Button>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-white">Орлого, Зарлага</h1>

        {/* Button Cards */}
        <div className="flex flex-col gap-6">
          {/* Income */}
          <Link href="/orlogo" className="block">
            <div className="w-full h-28 flex flex-col items-center justify-center gap-2 bg-green-900 hover:bg-green-800 border-2 border-green-700 rounded-xl shadow-md transition">
              <PlusCircle className="h-8 w-8 text-green-200" />
              <span className="text-lg font-semibold text-green-100">Орлого</span>
            </div>
          </Link>

          {/* Expense */}
          <Link href="/zarlaga" className="block">
            <div className="w-full h-28 flex flex-col items-center justify-center gap-2 bg-red-900 hover:bg-red-800 border-2 border-red-700 rounded-xl shadow-md transition">
              <MinusCircle className="h-8 w-8 text-red-200" />
              <span className="text-lg font-semibold text-red-100">Зарлага</span>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-xs pt-4">
          <p>SECURED BY BANK OF MONGOLIA</p>
        </div>
      </div>
    </div>
    </main>
  );
}
