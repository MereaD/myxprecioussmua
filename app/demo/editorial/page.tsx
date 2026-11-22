"use client";
import Navbar from "@/app/components/nav";
import Footer from "@/app/components/footer";
import { useReveal } from "@/app/components/home/motion";
import { edCss } from "@/app/components/home/styles";
import { EdCta, EdHero, EdMarquee, EdProcess, EdReview, EdServices, EdWork } from "@/app/components/home/sections";

// Design A: light, magazine-style.
export default function EditorialDemo() {
  useReveal();
  return (
    <>
      <style>{edCss}</style>
      <Navbar />
      <main className="ed">
        <EdHero />
        <EdMarquee />
        <EdServices />
        <EdWork />
        <EdReview />
        <EdProcess />
        <EdCta />
      </main>
      <Footer />
    </>
  );
}
