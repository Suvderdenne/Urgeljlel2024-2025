import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetchWithSession(url: string) {
  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include', // ⭐ Important for session
  });

  const data = await res.json();
  return { data, status: res.status };
}
