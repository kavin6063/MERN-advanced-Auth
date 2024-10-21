import { useState } from "react";
import { Link } from "react-router-dom";
import { CodeXml } from "lucide-react";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl shadow-lg mb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-2xl font-bold">
          <Link to="/" className="hover:text-green-400 transition-colors">
            <div className="flex items-center gap-2">
              <CodeXml size={30} /> AUTH
            </div>
          </Link>
        </div>

        {/* Hamburger Button */}
        <div className="sm:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden sm:flex space-x-7">
          <Link
            to="/"
            className="text-gray-300 hover:text-green-400 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-gray-300 hover:text-green-400 transition-colors"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-gray-300 hover:text-green-400 transition-colors"
          >
            Contact
          </Link>
        </nav>
      </div>

      {/* Mobile Menu - aligned to the right */}
      {isMenuOpen && (
        <div className="sm:hidden px-4 pb-4 flex justify-center">
          <nav className="flex flex-col space-y-4 items-start">
            <Link
              to="/"
              className="text-gray-300 hover:text-green-400 transition-colors"
              onClick={toggleMenu} // Close the menu after clicking
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-300 hover:text-green-400 transition-colors"
              onClick={toggleMenu}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-300 hover:text-green-400 transition-colors"
              onClick={toggleMenu}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
