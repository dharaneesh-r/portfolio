import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLenis } from "../context/LenisContext";

const Navbar = () => {
  const [isOpen,    setIsOpen]    = useState(false);
  const [scrolled,  setScrolled]  = useState(false);
  const location = useLocation();
  const lenis    = useLenis();

  // ── Scroll-aware shrink ─────────────────────────────────────────
  useEffect(() => {
    const handleScroll = (e) => {
      // `e` from Lenis has a `.scroll` property; native scroll uses window
      const y = lenis ? (e?.scroll ?? e?.target?.scrollTop ?? window.scrollY) : window.scrollY;
      setScrolled(y > 40);
    };

    if (lenis) {
      lenis.on("scroll", handleScroll);
      return () => lenis.off("scroll", handleScroll);
    } else {
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [lenis]);

  // Close mobile menu on route change
  useEffect(() => setIsOpen(false), [location.pathname]);

  const navItems = [
    { name: "HOME",     path: "/" },
    { name: "ABOUT",    path: "/aboutme" },
    { name: "SKILLS",   path: "/skills" },
    { name: "PROJECTS", path: "/projects" },
    { name: "CONTACT",  path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`sticky top-0 z-50 border-b border-primary-500/10 transition-all duration-300 ${
        scrolled
          ? "bg-dark-900/98 backdrop-blur-xl shadow-xl shadow-primary-500/10 py-0"
          : "bg-dark-600/95 backdrop-blur-md shadow-lg shadow-primary-500/20"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? "h-12" : "h-16"}`}>
          {/* Logo */}
          <Link
            to="/"
            className="text-white font-heading font-bold hover:text-primary-500 transition-colors duration-300 text-lg sm:text-xl"
          >
            DHARANEESH<span className="text-primary-500">.</span>
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-dark-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-all duration-300"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop links */}
          <div className="hidden sm:flex sm:items-center sm:space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative text-sm font-semibold tracking-wide transition-all duration-300 group ${
                  isActive(item.path) ? "text-primary-500" : "text-white hover:text-primary-400"
                }`}
              >
                {item.name}
                <span className={`absolute inset-x-0 -bottom-1 h-0.5 bg-primary-500 transform origin-left transition-transform duration-300 ${
                  isActive(item.path) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden border-t border-primary-500/10">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-dark-700/98 backdrop-blur-md">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-semibold transition-all duration-300 ${
                  isActive(item.path)
                    ? "bg-primary-500 text-white"
                    : "text-gray-300 hover:bg-dark-500 hover:text-primary-400"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
