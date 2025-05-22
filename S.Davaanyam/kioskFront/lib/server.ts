// src/app/api/kiosk-login/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { данс_дугаар, пин_код } = body;

    const response = await fetch("http://localhost:8000/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important for session cookies
      body: JSON.stringify({ данс_дугаар, пин_код }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Сервертэй холбогдоход алдаа гарлаа." },
      { status: 500 }
    );
  }
}


import axios from 'axios';

export interface Transaction {
  гүйлгээ_id: number;
  огноо: string;
  төрөл: string;
  дүн: string;
  валют: string;
  чиглэл: string;
  харилцах_данс: string;
  төлөв: string;
  үлдэгдэл_өөрчлөлт: string;
}

export interface AccountInfo {
  данс_дугаар: string;
  үлдэгдэл: string;
  валют: string;
  хугацааны_загвар: string;
}

export interface StatementResponse {
  success: boolean;
  statement: Transaction[];
  account_info: AccountInfo;
}

export async function fetchKhuulga(startDate?: string, endDate?: string, transactionType?: string): Promise<StatementResponse> {
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  if (transactionType) params.append('transaction_type', transactionType);

  const res = await axios.get<StatementResponse>(`http://localhost:8000/kiosk/khuulga/?${params.toString()}`, {
    withCredentials: true, // Needed for session-based auth
  });
  return res.data;
}

// lib/server.ts

type WithdrawRequest = {
  account_id: string;
  amount: number;
  currency: string;
};

type WithdrawResponse = {
  message: string;
};

export async function kioskZarlaga(data: WithdrawRequest): Promise<WithdrawResponse> {
  const res = await fetch('http://localhost:8000/kiosk/zarlaga/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Send cookies for session-based auth
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Серверийн алдаа гарлаа.');
  }

  return res.json();
}

export async function kioskOrlogo(data: { amount: number; currency: string }) {
  const res = await fetch('http://localhost:8000/kiosk/orlogo/', {
  method: 'POST',
  headers: {
  'Content-Type': 'application/json',
  },
  credentials: 'include', // Needed for session-based authentication
  body: JSON.stringify(data),
  });
  
  if (!res.ok) {
  const error = await res.json();
  throw new Error(error.error || 'Алдаа гарлаа');
  }
  
  return res.json();
  }