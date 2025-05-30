import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#121212] shadow-lg shadow-orange-500 hover:shadow-white transition-shadow duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a
              href="/"
              className="text-white text-xl font-bold hover:text-orange-500 transition-colors duration-300 ease-in-out"
            >
              DHARANEESH PORTFOLIO
            </a>
          </div>
          <div className="-mr-2 flex sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white transition-all duration-300"
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
          {/* Navigation Links */}
          <div className="hidden sm:flex sm:items-center sm:space-x-5">
            {['ABOUT ME', 'SKILLS', 'PROJECTS', 'CONTACT'].map((item) => (
              <a
                key={item}
                href={`/${item.replace(' ', '').toLowerCase()}`}
                className="text-white hover:text-orange-500 text-md font-bold relative transition duration-300 ease-in-out group"
              >
                {item}
                <span className="absolute inset-x-0 -bottom-1 h-1 bg-orange-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
              </a>
            ))}
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center" id="mobile-menu">
          <div className="bg-[#121212] w-full max-w-xs px-6 py-4 space-y-4 rounded-md">
            {['ABOUT ME', 'SKILLS', 'PROJECTS', 'CONTACT'].map((item) => (
              <a
                key={item}
                href={`/${item.replace(' ', '').toLowerCase()}`}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-lg font-bold text-white hover:bg-orange-500 hover:text-black transition-all duration-300"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
