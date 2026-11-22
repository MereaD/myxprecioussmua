"use client";
import { useReveal } from "./motion";
import { edCss, nrCss } from "./styles";
import { EdCta, EdProcess, EdReview, EdServices, EdWork, NrFaq, NrHero } from "./sections";

// The home page ("Signature" design): the Noir opening and "Good to know" questions,
// with Editorial's services, recent work, review, process and booking panel in between.
export default function SignatureHome() {
  useReveal();
  return (
    <>
      <style>{edCss}</style>
      <style>{nrCss}</style>
      <main>
        <div className="nr">
          <NrHero next="services" />
        </div>
        {/* scroll-margin keeps the hero's scroll cue from landing under the fixed nav */}
        <div className="ed" id="services" style={{ scrollMarginTop: 64 }}>
          <EdServices />
          <EdWork />
          <EdReview />
          <EdProcess />
        </div>
        <div className="nr">
          <NrFaq />
        </div>
        <div className="ed">
          <EdCta style={{ paddingTop: 120 }} />
        </div>
      </main>
    </>
  );
}
