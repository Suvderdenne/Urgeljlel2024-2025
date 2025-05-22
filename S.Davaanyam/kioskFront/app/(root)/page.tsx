"use client";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  const handleLogout = () => {
    router.push("/");
  };
  return <div></div>;
}