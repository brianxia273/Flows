import { Herocontent } from "@/components/hero-content";
import { Footer } from "@/components/footer";
import { AuthUserProvider } from "@/components/auth-provider";

export default function Home() {
  return (
    <AuthUserProvider>
      <Herocontent />
      <Footer />
    </AuthUserProvider>
  );
}
