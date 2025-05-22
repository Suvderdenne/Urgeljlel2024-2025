"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [данс, setДанс] = useState("");
  const [пин, setПин] = useState("");
  const [error, setError] = useState("");
  const [selectedInput, setSelectedInput] = useState<"account" | "pin">("account");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // clear previous error

    try {
      const res = await fetch("http://localhost:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ send and receive cookies for session
        body: JSON.stringify({
          данс_дугаар: данс,
          пин_код: пин,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/main");
      } else {
        setError(data.message || "Нэвтрэхэд алдаа гарлаа");
      }
    } catch (err) {
      setError("Сервертэй холбогдож чадсангүй");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black p-6 relative">
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-48 h-4 bg-gray-600 rounded-b-md shadow-md" />
      <div className="w-full max-w-2xl bg-gray-800 border-4 border-gray-700 rounded-2xl p-10 shadow-2xl space-y-10">
        <div className="bg-black rounded-xl p-8 font-mono text-green-500 space-y-6 shadow-inner h-80 flex flex-col justify-between">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-extrabold">BANK OF MONGOLIA</h1>
            <p className="text-base font-bold">Нэвтрэх</p>
          </div>

          {error && (
            <div className="bg-red-800 text-red-100 p-3 text-center rounded text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm mb-2">ДАНС</label>
              <Input
                type="text"
                value={данс}
                onFocus={() => setSelectedInput("account")}
                onChange={(e) => setДанс(e.target.value)}
                required
                className="bg-gray-900 text-green-500 border-green-700 text-lg h-12"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">ПИН КОД</label>
              <Input
                type="password"
                value={пин}
                onFocus={() => setSelectedInput("pin")}
                onChange={(e) => setПин(e.target.value)}
                required
                className="bg-gray-900 text-green-500 border-green-700 text-lg h-12"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-3">
              <Button type="button" variant="outline" className="bg-gray-800 text-white border-gray-600 hover:bg-gray-700 text-lg h-12">
                Cancel
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-500 text-white text-lg h-12">
                Enter
              </Button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-3 gap-6 px-8 pt-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0, "E"].map((item) => (
            <button
              key={item}
              type="button"
              className="bg-gray-600 hover:bg-gray-500 text-white rounded-xl h-20 text-2xl font-extrabold shadow-lg"
              onClick={() => {
                if (typeof item === "number") {
                  selectedInput === "pin"
                    ? setПин((prev) => prev + item.toString())
                    : setДанс((prev) => prev + item.toString());
                } else if (item === "C") {
                  selectedInput === "pin" ? setПин("") : setДанс("");
                } else if (item === "E") {
                  document.querySelector("form")?.dispatchEvent(
                    new Event("submit", { cancelable: true, bubbles: true })
                  );
                }
              }}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="text-center text-gray-400 text-sm pt-6">
          <p>24/7 KIOSK SERVICE</p>
          <p>SECURED BY BANK OF MONGOLIA</p>
        </div>
      </div>
    </div>
  );
}
