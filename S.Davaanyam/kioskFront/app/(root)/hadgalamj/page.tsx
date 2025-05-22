// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// export default function HadgalamjPage() {
//   const router = useRouter()
//   const [amount, setAmount] = useState('')
//   const [type, setType] = useState<'энгийн' | 'хугацаатай'>('энгийн')
//   const [duration, setDuration] = useState<'1' | '5' | ''>('')
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [loading, setLoading] = useState(false)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setError('')
//     setSuccess('')

//     const res = await fetch("http://localhost:8000/kiosk/create/", {
//       method: 'POST',
//       credentials: 'include',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ amount, type, duration }),
//     })

//     const data = await res.json()
//     if (res.ok) {
//       setSuccess('Хадгаламж амжилттай үүслээ!')
//       setAmount('')
//       setDuration('')
//     } else {
//       setError(data.error || 'Алдаа гарлаа.')
//     }
//     setLoading(false)
//   }

//   return (
//     <div className="max-w-md mx-auto mt-10 space-y-4 p-4 border rounded-xl shadow">
//       <h2 className="text-xl font-semibold">Хадгаламж үүсгэх</h2>
//       {error && <div className="text-red-500">{error}</div>}
//       {success && <div className="text-green-600">{success}</div>}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <Label>Дүн</Label>
//           <Input
//             type="number"
//             required
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//           />
//         </div>

//         <div>
//           <Label>Хадгаламжийн төрөл</Label>
//           <Select value={type} onValueChange={(val) => setType(val as 'энгийн' | 'хугацаатай')}>
//             <SelectTrigger>
//               <SelectValue placeholder="Сонгох" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="энгийн">Энгийн</SelectItem>
//               <SelectItem value="хугацаатай">Хугацаатай</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {type === 'хугацаатай' && (
//           <div>
//             <Label>Хугацаа</Label>
//             <Select value={duration} onValueChange={(val) => setDuration(val as '1' | '5')}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Сонгох" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="1">1 жил</SelectItem>
//                 <SelectItem value="5">5 жил</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         )}

//         <Button type="submit" disabled={loading}>
//           {loading ? 'Илгээж байна...' : 'Үүсгэх'}
//         </Button>
//       </form>
//     </div>
//   )
// }
