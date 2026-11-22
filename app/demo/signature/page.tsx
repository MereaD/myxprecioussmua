import Navbar from "@/app/components/nav";
import Footer from "@/app/components/footer";
import SignatureHome from "@/app/components/home/signature-home";

// Design C, now the live home page; kept here so the three demos can still be compared.
export default function SignatureDemo() {
  return (
    <>
      <Navbar />
      <SignatureHome />
      <Footer />
    </>
  );
}
