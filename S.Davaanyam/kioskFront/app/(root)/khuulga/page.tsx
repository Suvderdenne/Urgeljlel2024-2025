'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { format } from 'date-fns'

interface Transaction {
  гүйлгээ_id: number
  огноо: string
  төрөл: string
  дүн: string
  валют: string
  чиглэл: string
  харилцах_данс: string
  төлөв: string
  үлдэгдэл_өөрчлөлт: string
}

interface AccountInfo {
  данс_дугаар: string
  үлдэгдэл: string
  валют: string
  хугацааны_загвар: string
}

export default function KhuulgaPage() {
  const [data, setData] = useState<Transaction[]>([])
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  const handleSearch = () => {
    const queryParams = new URLSearchParams()
    if (startDate) queryParams.append('start_date', startDate)
    if (endDate) queryParams.append('end_date', endDate)

    fetch(`http://localhost:8000/kiosk/khuulga/?${queryParams.toString()}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(async res => {
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.message || 'Алдаа гарлаа')
        }
        return res.json()
      })
      .then(resJson => {
        setData(resJson.statement)
        setAccountInfo(resJson.account_info)
      })
      .catch(err => setError(err.message))
  }

  useEffect(() => {
    handleSearch()
  }, [])

  if (error) {
    return <div className="p-4 text-red-500 text-center font-bold">{error}</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold">Дансны хуулга</h1>

      <div className="mb-4 flex space-x-2">
        <input
          type="date"
          className="input"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="input"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button onClick={handleSearch} className="btn">Хайх</button>
      </div>

      {accountInfo && (
        <Card>
          <CardContent className="p-4 space-y-1">
            <p>Данс: {accountInfo.данс_дугаар}</p>
            <p>Үлдэгдэл: {accountInfo.үлдэгдэл} {accountInfo.валют}</p>
          </CardContent>
        </Card>
      )}

      {data.length === 0 ? (
        <p className="text-gray-600">Гүйлгээ олдсонгүй.</p>
      ) : (
        data.map(tx => (
          <Card key={tx.гүйлгээ_id}>
            <CardContent className="p-4 space-y-1">
              <p><strong>{tx.чиглэл}</strong> - {tx.дүн} {tx.валют}</p>
              <p>Төрөл: {tx.төрөл}</p>
              <p>Харилцах данс: {tx.харилцах_данс}</p>
              <p>Огноо: {tx.огноо}</p>
              <p>Үлдэгдэл өөрчлөлт: {tx.үлдэгдэл_өөрчлөлт}</p>
              <p>Төлөв: {tx.төлөв}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
