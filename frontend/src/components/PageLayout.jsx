import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./Header";
import { StarBackground } from "@/components/StarBackground";
import { Footer } from "./Footer";

export const PageLayout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <StarBackground />
      <Header />
      <main className="pt-32 pb-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};
