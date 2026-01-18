import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT', path: '/aboutme' },
    { name: 'SKILLS', path: '/skills' },
    { name: 'PROJECTS', path: '/projects' },
    { name: 'CONTACT', path: '/contact' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-dark-600/95 backdrop-blur-md shadow-lg shadow-primary-500/20 sticky top-0 z-50 border-b border-primary-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-white text-xl font-heading font-bold hover:text-primary-500 transition-colors duration-300"
            >
              DHARANEESH<span className="text-primary-500">.</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-dark-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-all duration-300"
              aria-controls="mobile-menu"
              aria-expanded={isOpen ? 'true' : 'false'}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative text-sm font-semibold transition-all duration-300 group ${isActive(item.path)
                    ? 'text-primary-500'
                    : 'text-white hover:text-primary-400'
                  }`}
              >
                {item.name}
                <span
                  className={`absolute inset-x-0 -bottom-1 h-0.5 bg-primary-500 transform origin-left transition-transform duration-300 ${isActive(item.path)
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-dark-700/95 backdrop-blur-md border-t border-primary-500/10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-semibold transition-all duration-300 ${isActive(item.path)
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-300 hover:bg-dark-500 hover:text-primary-400'
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

