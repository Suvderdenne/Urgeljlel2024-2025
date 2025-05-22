'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface AccountInfo {
  данс_дугаар: string
  үлдэгдэл: string
  валют: string
  овог: string
  нэр: string
}

export default function AccountBalancePage() {
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('http://localhost:8000/kiosk/uldegdel/', {
      method: 'GET',
      credentials: 'include', // Keep Django session
    })
      .then(async res => {
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.message || 'Алдаа гарлаа')
        }
        return res.json()
      })
      .then(resJson => {
        setAccountInfo(resJson.account_info)
      })
      .catch(err => setError(err.message))
  }, [])

  if (error) {
    return <div className="p-6 text-red-500 text-center font-semibold">{error}</div>
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-center text-indigo-700">Дансны Үлдэгдэл</h1>

      {accountInfo ? (
        <Card className="rounded-2xl shadow-xl border border-gray-200">
          <CardContent className="p-6 space-y-4">
            <div className="text-center">
              <p className="text-xl font-semibold text-gray-800">
                {accountInfo.овог} {accountInfo.нэр}
              </p>
              <p className="text-md text-gray-600">Хэрэглэгчийн нэр</p>
            </div>

            <div className="text-center space-y-1 pt-4">
              <p className="text-lg font-medium text-gray-700">
                Дансны дугаар: <span className="text-indigo-600 font-semibold">{accountInfo.данс_дугаар}</span>
              </p>
              <p className="text-2xl font-bold text-gray-900">
                Үлдэгдэл: {accountInfo.үлдэгдэл} <span className="text-lg text-indigo-600">{accountInfo.валют}</span>
              </p>
            </div>

            <div className="border-t pt-4 text-center text-sm text-gray-500">
              Энэ нь таны одоогийн дансны үлдэгдэл юм.
            </div>
          </CardContent>
        </Card>
      ) : (
        <p className="text-center text-gray-500">Ачааллаж байна...</p>
      )}
    </div>
  )
}
