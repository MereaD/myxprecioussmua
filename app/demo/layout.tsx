import type { Metadata } from "next";

// Design explorations only: kept out of search results and not linked from the site.
export const metadata: Metadata = {
  title: "Design demos · Myxprecioussmua",
  robots: { index: false, follow: false },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
