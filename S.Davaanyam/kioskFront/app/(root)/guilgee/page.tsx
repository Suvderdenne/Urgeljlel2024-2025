"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function GuilgeePage() {
  const [accountNumber, setAccountNumber] = useState(""); // Account number state
  const [amount, setAmount] = useState(""); // Transaction amount state
  const [currency, setCurrency] = useState("MNT"); // Currency selection state
  const [isSuccess, setIsSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recipientName, setRecipientName] = useState<string | null>(null);
  const [recipientSurname, setRecipientSurname] = useState<string | null>(null);

  const getCookie = (name: string) => {
    const value = document.cookie;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return null;
  };

  useEffect(() => {
    const sessionId = getCookie("sessionid");
    console.log("SessionID:", sessionId);
  }, []);

  // 🟡 Realtime овог нэр шалгах
  useEffect(() => {
    const fetchRecipient = async () => {
      if (accountNumber.length < 8) {  // Check account number length before fetching recipient
        setRecipientName(null);
        setRecipientSurname(null);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8000/kiosk/account-info/?account_number=${accountNumber}`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();

        if (response.ok) {
          setRecipientName(data.нэр);
          setRecipientSurname(data.овог);
        } else {
          setRecipientName(null);
          setRecipientSurname(null);
        }
      } catch (err) {
        setRecipientName(null);
        setRecipientSurname(null);
      }
    };

    fetchRecipient();
  }, [accountNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(null);
    setError(null);
    setIsLoading(true);

    try {
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount)) {
        throw new Error("Дүн буруу байна");
      }

      const result = await submitTransaction({
        accountNumber,
        amount: numericAmount,
        currency,
        sessionCookie: document.cookie,
      });

      setIsSuccess("Гүйлгээ амжилттай хийгдлээ!");
      setAccountNumber("");
      setAmount("");
      setRecipientName(null);
      setRecipientSurname(null);
      console.log("Transaction Result:", result);
    } catch (error: any) {
      setError(error.message || "Гүйлгээ хийхэд алдаа гарлаа");
      console.error("Transaction Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle numeric keypad button clicks
  const handleKeyPress = (value: string) => {
    setAmount((prevAmount) => prevAmount + value);
  };

  const handleBackspace = () => {
    setAmount((prevAmount) => prevAmount.slice(0, -1));
  };

  const handleClear = () => {
    setAmount("");
  };

  const numericButtons = [
    "1", "2", "3",
    "4", "5", "6",
    "7", "8", "9",
    "0", "C", "←"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Бэлэн бус гүйлгээ</h1>
          <p className="text-gray-600">Та гүйлгээний мэдээллээ оруулна уу</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Дансны дугаар
            </label>
            <Input
              type="text"
              inputMode="numeric"  // Restrict to numeric input
              pattern="[0-9]*"     // Restrict input to only digits
              value={accountNumber}
              onChange={(e) =>
                setAccountNumber(e.target.value.replace(/\D/g, ""))  // Allow only numeric characters
              }
              placeholder="Дансны дугаараа оруулна уу"
              className="text-lg py-6"
              maxLength={16}  // Adjust length if needed
              required
            />
            {recipientName && recipientSurname && (
              <div className="text-sm text-green-600 mt-1">
                Хүлээн авагч: {recipientSurname} {recipientName}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Гүйлгээний дүн
            </label>
            <div className="relative">
              <Input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="text-2xl font-bold py-6 pl-4 pr-12"
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                {currency}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Валют
            </label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-full py-6 text-base">
                <SelectValue placeholder="Валют сонгох" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MNT">MNT - Монгол төгрөг</SelectItem>
                <SelectItem value="USD">USD - Американ доллар</SelectItem>
                <SelectItem value="EUR">EUR - Евро</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full py-6 text-lg font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              "Түр хүлээнэ үү..."
            ) : (
              <>
                Гүйлгээ хийх <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>

        {isSuccess && (
          <div className="mt-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-start">
            <CheckCircle2 className="h-5 w-5 mt-0.5 mr-2 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-medium">{isSuccess}</p>
              <p className="text-sm mt-1">
                Гүйлгээний дугаар: {Math.floor(Math.random() * 1000000)}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 mt-0.5 mr-2 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-medium">{error}</p>
              <p className="text-sm mt-1">
                Дахин оролдоно уу эсвэл банкинд холбогдоно уу
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Хэрэглэгчийн дугаар: {getCookie("sessionid")?.slice(0, 8)}...</p>
          <p className="mt-1">Тусламж: 80040425</p>
        </div>

        {/* Numeric keypad */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          {numericButtons.map((button, index) => (
            <Button
              key={index}
              onClick={() => {
                if (button === "C") handleClear();
                else if (button === "←") handleBackspace();
                else handleKeyPress(button);
              }}
              className="py-4 text-xl font-semibold"
            >
              {button}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

async function submitTransaction({
  accountNumber,
  amount,
  currency,
  transactionType = "TRANSFER",
  feeAmount = 0,
  sessionCookie,
}: {
  accountNumber: string;
  amount: number;
  currency: string;
  transactionType?: string;
  feeAmount?: number;
  sessionCookie: string;
}) {
  try {
    const response = await fetch("http://localhost:8000/kiosk/guilgee/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        данс_дугаар: accountNumber,
        дүн: amount,
        валют: currency,
        гүйлгээний_төрөл: transactionType,
        хураамж_дүү: feeAmount,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Гүйлгээний алдаа");
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || "Серверийн алдаа");
  }
}
