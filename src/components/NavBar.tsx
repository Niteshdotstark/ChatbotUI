// src/components/NavBar.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function NavBar() {
  const { isLoggedIn, userEmail, logout, isLoadingAuth } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  if (isLoadingAuth) {
    return null;
  }

  const ChatIcon = (
    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
    </svg>
  );

  // NOTE: MobileLink helper removed as requested, using inline Links below.

  return (
    <header className="bg-white dotstark-shadow sticky top-0 z-40">
      {/* Container with responsive horizontal padding */}
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Main Header Row */}
        <div className="flex justify-between items-center h-20">

          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0">
            <Link className="flex items-center" href="/">
              {/* Scaled logo for mobile/desktop view - MODIFIED SPACING: mr-4 sm:mr-6 lg:mr-8 */}
              <div className="w-10 h-10 bg-dotstark-primary rounded-xl flex items-center justify-center me-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
              </div>
              <span className="navlogo-name text-dotstark-dark font-heading text-xl sm:text-2xl ">
                RAG Chat
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button (Visible below 1024px only) */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 text-gray-700 hover:text-dotstark-primary focus:outline-none"
          >
            {/* Hamburger / Close Icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {/* Navigation Links: HIDDEN by default, FLEX on large screens, FLEX-COL when menu is open */}
          <div
            className={`
              ${isMenuOpen ? 'flex flex-col absolute top-20 left-0 w-full bg-white dotstark-shadow-lg z-30 p-4 space-y-4' : 'hidden'}
              lg:flex lg:flex-row lg:items-center lg:space-x-6 lg:static
            `}
            // Ensure links close the menu on mobile navigation
            onClick={() => { if (!isMenuOpen) return; setIsMenuOpen(false); }}
          >
            {isLoggedIn ? (
              <>
                <span className="lg:text-sm text-lg font-medium uppercase tracking-wide px-2 py-1 lg:p-0">
                  {userEmail}
                </span>
                <Link
                  className="text-gray-700 hover:text-dotstark-primary px-2 sm:px-4 py-1 sm:py-2 text-sm font-medium transition-colors uppercase tracking-wide hover-lift"
                  href="/pricing"
                >
                  Pricing
                </Link>
                <Link
                  className="text-gray-700 hover:text-dotstark-primary px-2 sm:px-4 py-1 sm:py-2 text-sm font-medium transition-colors uppercase tracking-wide hover-lift"
                  href="/dashboard"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="btn-dotstark text-white text-sm px-4 py-2 hover-lift w-full lg:w-auto mt-2 lg:mt-0"
                >
                  Logout
                </button>
              </>
            ) : (
              // Desktop/Mobile Logged Out Links
              <div className='flex flex-col lg:flex-row items-stretch lg:items-center space-y-2 lg:space-y-0 lg:space-x-2 w-full lg:w-auto'>
                <Link
                  className="text-gray-700 hover:text-dotstark-primary px-4 py-4 text-sm font-medium transition-colors uppercase tracking-wide hover-lift"
                  href="/pricing"
                >
                  Pricing
                </Link>
                <Link
                  className="text-gray-700 hover:text-dotstark-primary px-4 py-4 text-sm font-medium transition-colors uppercase tracking-wide hover-lift"
                  href="/login"
                >
                  Login
                </Link>
                <Link
                  className="btn-dotstark text-white text-sm "
                  href="/register"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>

  );

}