import type { Metadata } from "next";
import { HomePage } from "@/components/home-page";

export const metadata: Metadata = {
  title: "Home",
  description:
    "FreshBitan homepage for orchard-first mango and seasonal fruit ordering across Bangladesh.",
};

export default function Home() {
  return <HomePage />;
}
