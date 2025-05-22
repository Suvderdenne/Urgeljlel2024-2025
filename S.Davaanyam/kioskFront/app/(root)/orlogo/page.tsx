'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { kioskOrlogo } from '@/lib/server';

export default function HomePage() {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('MNT');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeField, setActiveField] = useState<'amount' | 'currency' | null>(null);

  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');

    try {
      const result = await kioskOrlogo({
        amount: parseFloat(amount),
        currency,
      });
      setMessage(result.message || 'Амжилттай орлого хийгдлээ.');
    } catch (err: any) {
      setMessage(err.message || 'Алдаа гарлаа.');
    }

    setLoading(false);
  };

  const handleKeypadClick = (value: string) => {
    if (activeField !== 'amount') return;

    if (value === 'C') {
      setAmount('');
    } else if (value === '←') {
      setAmount(amount.slice(0, -1));
    } else {
      setAmount((prev) => prev + value);
    }
  };

  const handleBackClick = () => {
    router.back();
  };

  return (
    <main className="flex flex-col items-center justify-center w-screen h-screen bg-gradient-to-br from-[#e0f7fa] to-[#ffffff] px-8">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-3xl space-y-6 border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-[#00796b]">💵 Орлого хийх</h1>

        <Button
          onClick={handleBackClick}
          className="w-full text-2xl py-3 rounded-xl bg-gray-400 hover:bg-gray-500 transition text-white font-semibold mb-6"
        >
          🔙 Буцах
        </Button>

        <div className="space-y-4">
          <Input
            placeholder="💱 Валют (ж: MNT)"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            onFocus={() => setActiveField('currency')}
            className={`text-xl p-5 rounded-xl border-2 ${activeField === 'currency' ? 'border-blue-500' : ''}`}
          />

          <Input
            readOnly
            value={amount}
            className="text-2xl text-center font-bold p-6 rounded-xl border-2 bg-gray-50 cursor-default"
            onFocus={() => setActiveField('amount')}
          />

          {activeField === 'amount' && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {['1','2','3','4','5','6','7','8','9','0','←','C'].map((key) => (
                <button
                  key={key}
                  onClick={() => handleKeypadClick(key)}
                  className="bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-2xl font-semibold py-4 rounded-xl shadow"
                >
                  {key}
                </button>
              ))}
            </div>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full text-2xl py-6 rounded-xl bg-green-600 hover:bg-green-700 transition text-white font-semibold mt-6"
        >
          {loading ? '⏳ Ачааллаж байна...' : '➕ Орлого хийх'}
        </Button>

        {message && (
          <div className="text-center mt-4 text-xl text-green-700 font-medium">
            {message}
          </div>
        )}
      </div>
    </main>
  );
}
