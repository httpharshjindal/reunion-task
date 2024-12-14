"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const HomePage = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace("auth/signup");
  }, []);
  return <div>loading...</div>;
};
export default HomePage;
