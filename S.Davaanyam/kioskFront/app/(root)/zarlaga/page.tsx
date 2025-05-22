'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { kioskZarlaga } from '@/lib/server';

export default function HomePage() {
  const router = useRouter();
  const [accountId, setAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('MNT');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);

  const handleWithdraw = async () => {
    setLoading(true);
    setMessage('');

    try {
      const result = await kioskZarlaga({
        account_id: accountId,
        amount: parseFloat(amount),
        currency,
      });

      setMessage(result.message || 'Зарлага амжилттай хийгдлээ.');
    } catch (err: any) {
      setMessage(err.message || 'Алдаа гарлаа.');
    }

    setLoading(false);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
    }
  };

  const handleBackClick = () => {
    router.back();
  };

  const handleKeypadClick = (key: string) => {
    if (key === '←') {
      setAmount((prev) => prev.slice(0, -1));
    } else if (key === 'C') {
      setAmount('');
    } else {
      if (/^\d*\.?\d{0,2}$/.test(amount + key)) {
        setAmount((prev) => prev + key);
      }
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md space-y-4">
        <Button
          onClick={handleBackClick}
          className="w-full text-2xl py-3 rounded-xl bg-gray-400 hover:bg-gray-500 transition text-white font-semibold mb-6"
        >
          🔙 Буцах
        </Button>

        <h1 className="text-xl font-semibold text-center">💸 Зарлага хийх</h1>

        <Input
          placeholder="Дансны ID"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
        />

        <Input
          type="text"
          inputMode="decimal"
          placeholder="Дүн"
          value={amount}
          onChange={handleAmountChange}
          onFocus={() => setActiveField('amount')}
          className="text-center"
        />

        {activeField === 'amount' && (
          <div>
            <p className="text-center text-sm text-gray-500 mt-2">Тоон гар</p>
            <div className="grid grid-cols-3 gap-4 mt-2">
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
          </div>
        )}

        <Input
          placeholder="Валют (ж: MNT)"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        />

        <Button onClick={handleWithdraw} disabled={loading} className="w-full">
          {loading ? 'Ачааллаж байна...' : 'Зарлага хийх'}
        </Button>

        {message && <p className="text-center text-sm text-red-600">{message}</p>}
      </div>
    </main>
  );
}
