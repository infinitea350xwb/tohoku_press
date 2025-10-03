import { cn } from "@/lib/utils";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { name: "報道部とは", to: "/about" },
  { name: "「東北大学新聞とは」", to: "/skills" },
  { name: "新聞配布場所一覧", to: "/projects" },
  { name: "PDF版", to: "/contact" },
  { name: "広告掲載について", to: "/contact" },
  { name: "定期無料購読", to: "/contact", special: true },
];

const secondaryLinks = [
  { label: "トップ", href: "/" },
  { label: "ニュース", href: "/news" },
  { label: "文化", href: "/culture" },
  { label: "企画", href: "/features" },
  { label: "インタビュー", href: "/interview" },
  { label: "複眼時評", href: "/opinion" },
  { label: "オンラインショップ", href: "/shop" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <nav
        className={cn(
          "bg-background/80 backdrop-blur-md transition-all duration-300 border-b border-border/40",
          isScrolled ? "py-3 shadow-xs" : "py-5"
        )}
      >
        <div className="container flex items-center justify-between gap-4">
          <NavLink to="/" className="flex items-center text-xl font-bold text-primary">
            <img
              src="/images/logo.jpg"
              alt="Logo"
              className="mr-2 h-8 w-8 cursor-pointer"
              onClick={(event) => {
                event.preventDefault();
                const hero = document.getElementById('hero');
                if (hero) {
                  hero.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
            <span className="relative z-10">東北大学新聞</span>
          </NavLink>

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => {
              if (item.special) {
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        "rounded-md border-2 border-red-600 px-5 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50",
                        isActive && "bg-red-600 text-white hover:bg-red-600"
                      )
                    }
                  >
                    {item.name}
                  </NavLink>
                );
              }

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "text-foreground/80 transition-colors duration-300 hover:text-primary",
                      isActive && "text-primary font-semibold"
                    )
                  }
                >
                  {item.name}
                </NavLink>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button className="hidden h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:opacity-85 md:flex">
              <Search size={18} />
            </button>
            <ThemeToggle className="text-foreground" />
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="z-50 p-2 text-foreground md:hidden"
              aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <div
            className={cn(
              "fixed inset-0 z-40 flex flex-col items-center justify-center bg-background/95 backdrop-blur-md transition-all duration-300 md:hidden",
              isMenuOpen
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            )}
          >
            <div className="flex flex-col items-center space-y-8 text-xl">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                className={({ isActive }) =>
                  item.special
                    ? cn(
                          "rounded-md border-2 border-red-600 px-5 py-3 text-lg font-bold text-red-600 transition hover:bg-red-50",
                          isActive && "bg-red-600 text-white hover:bg-red-600"
                        )
                    : cn(
                          "text-foreground/80 transition-colors duration-300 hover:text-primary",
                          isActive && "text-primary font-semibold"
                        )
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
              <ThemeToggle className="text-foreground" />
            </div>
          </div>
        </div>
      </nav>
      <div className="bg-[#1a2f78] text-white border-b border-white/30">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-6 px-4 py-3">
          <ul className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold tracking-wide">
            {secondaryLinks.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="whitespace-nowrap transition-colors duration-200 hover:text-white/70"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href="/AdminDashboard"
              className="hidden sm:inline-flex min-w-[64px] justify-center bg-white px-4 py-2 text-sm font-semibold text-[#1a2f78] shadow-sm transition hover:bg-white/90"
            >
              RSS
            </a>
            <form className="flex items-center overflow-hidden rounded-sm bg-white shadow-sm">
              <input
                type="search"
                placeholder="記事を検索"
                className="h-10 w-48 px-3 text-sm text-[#1a2f78] placeholder:text-[#7b88c2] focus:outline-none"
              />
              <button
                type="submit"
                className="flex h-10 w-10 items-center justify-center text-[#1a2f78] transition hover:bg-[#dbe2ff]"
                aria-label="検索"
              >
                <Search size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
};
