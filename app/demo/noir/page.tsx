"use client";
import Navbar from "@/app/components/nav";
import Footer from "@/app/components/footer";
import { useReveal } from "@/app/components/home/motion";
import { nrCss } from "@/app/components/home/styles";
import { NrCta, NrFaq, NrGallery, NrHero, NrPromise, NrReview, NrServices } from "@/app/components/home/sections";

// Design B: dark espresso, cinematic.
export default function NoirDemo() {
  useReveal();
  return (
    <>
      <style>{nrCss}</style>
      <Navbar />
      <main className="nr">
        <NrHero next="promise" />
        <NrPromise id="promise" />
        <NrServices />
        <NrGallery />
        <NrReview />
        <NrFaq />
        <NrCta />
      </main>
      <Footer />
    </>
  );
}
