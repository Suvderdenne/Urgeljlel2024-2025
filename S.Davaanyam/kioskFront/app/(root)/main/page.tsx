"use client";

import { useRouter } from "next/navigation";
import { FileText, CreditCard, Wifi, Landmark, PenTool, ArrowRight, LogOut } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const services = [
  {
    name: "Дансны тодорхойлолт, хуулга авах",
    description: "Иргэний үнэмлэхээ уншуулан дансны тодорхойлолт, хуулгаа хэвлэх эсвэл и-мэйлээр илгээх боломжтой.",
    icon: FileText,
    path: "/khuulga",
    color: "bg-blue-100 text-blue-600"
  },
  {
    name: "Бэлэн бус гүйлгээ хийх",
    description: "ХААН Банк дотор болон бусад банк руу өндөр дүнтэй бэлэн бус гүйлгээ хийх боломжтой.",
    icon: CreditCard,
    path: "/guilgee",
    color: "bg-green-100 text-green-600"
  },
  {
    name: "Орлого, Зарлага",
    description: "Дебит картын захиалга, нөхөн авалт, сунгалт, карт идэвхжүүлэх болон идэвхгүй болгох боломжтой.",
    icon: CreditCard,
    path: "/orlogozarlaga",
    color: "bg-purple-100 text-purple-600"
  },
  {
    name: "Хадгаламж үүсгэх",
    description: "Интернэт банк аппликэйшн, ухаалаг мэдээ үйлчилгээнд бүртгүүлэх боломжтой.",
    icon: Wifi,
    path: "/hadgalamj",
    color: "bg-orange-100 text-orange-600"
  },
  // {
  //   name: "Төрийн үйлчилгээний төлбөр төлөх",
  //   description: "Тээврийн хэрэгслийн татвар зэрэг төрийн үйлчилгээний төлбөрийг бэлэн бусаар төлөх боломжтой.",
  //   icon: Landmark,
  //   path: "/government-payments",
  //   color: "bg-red-100 text-red-600"
  // },
  {
    name: "Дансны үлдэгдэл",
    description: "Дансны үлдэгдлээ харах.",
    icon: PenTool,
    path: "/dansuldegdel",
    color: "bg-teal-100 text-teal-600"
  },
];

export default function MainPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("http://localhost:8000/kiosk/logout/", {
        method: "POST",
        credentials: "include",
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 p-6 relative">
      {/* Logout Button */}
      <div className="absolute top-6 right-20">
  <button
    onClick={handleLogout}
    disabled={loading}
    className="flex items-center space-x-1 bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
  >
    <LogOut className="w-4 h-4" />
    <span>{loading ? "Гарах..." : "Гарах"}</span>
  </button>
</div>

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Банкны Киоск Үйлчилгээ</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Таны хүссэн банкны үйлчилгээг 24/7 цагаар түргэн шуурхай авах боломжтой
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link href={service.path} key={index} className="group">
                <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-blue-200 hover:translate-y-[-4px]">
                  <div className="p-6 flex flex-col h-full">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${service.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-2">{service.name}</h3>
                    <p className="text-gray-600 mb-6 flex-grow">{service.description}</p>

                    <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                      <span>Үйлчилгээ авах</span>
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer Section */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Хэрэглэгчийн дугаар: 99112233 | © 2025 Мандах Банк.</p>
          <p className="mt-2">Тусламж: 80040425 | 24/7 Үйлчилгээ</p>
        </div>
      </div>
    </div>
  );
}
