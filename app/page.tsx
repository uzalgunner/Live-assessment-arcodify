"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (isLoggedIn) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [router]);
  return (
    <>
      <div className="flex justify-center items-center">hello</div>
    </>
  );
}
