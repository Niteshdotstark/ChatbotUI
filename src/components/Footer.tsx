// src/components/Footer.tsx
import Link from 'next/link';
import React from 'react';

export default function Footer() {
    // Reusing the ChatIcon logic from NavBar for consistency
    const ChatIcon = (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
        </svg>
    );

    // MODIFIED: Using bright text-gray-200/white for visibility
    const linkClasses = "text-white hover:text-dotstark-primary transition-colors text-base font-medium";
    const headerClasses = "text-lg font-bold text-white font-heading mb-4 uppercase";

    return (
        // Added margin top for separation
        <footer className="bg-gray-900  border-t border-gray-800 pt-10 sm:pt-16 pb-6 mt-10">
            {/* Responsive container for padding */}
            <div className="max-w-7xl pt-4 mx-auto px-3 px-sm-4 sm:px-6 lg:px-8">

                {/* Main Grid Section: Responsive grid setup */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">

                    {/* Column 1: Logo & Description */}
                    <div className="space-y-4">
                        <Link className="flex items-center" href="/">
                            <div className="w-10 h-10 bg-dotstark-primary rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                                {ChatIcon}
                            </div>
                            {/* Ensured logo text is white */}
                            <span className="text-2xl ms-2 font-bold text-white font-heading">
                                RAG Chat
                            </span>
                        </Link>
                        {/* MODIFIED: Using text-gray-200 for clear visibility */}
                        <p className="text-gray-200 pt-3 text-sm max-w-xs">
                            Intelligent AI Chat solutions powered by Retrieval-Augmented Generation (RAG) technology.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="space-y-3">
                        <h3 className={headerClasses}>Quick Links</h3>
                        <ul className="ps-0 space-y-1 flex flex-col">
                            <li><Link href="/" className={linkClasses}>Home</Link></li>
                            <li><Link href="/pricing" className={linkClasses}>Pricing</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Resources */}
                    <div className="space-y-3">
                        <h3 className={headerClasses}>Resources</h3>
                        <ul className="ps-0 space-y-1 flex flex-col">
                            <li><Link href="/dashboard/knowledge" className={linkClasses}>Knowledge Base</Link></li>
                            <li><Link href="/register" className={linkClasses}>Start Free Trial</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact & Social */}
                    <div className=" ps-0 space-y-4">
                        <h3 className={headerClasses}>Follow Us</h3>
                        {/* MODIFIED: Using text-gray-200 for description */}
                        <p className="text-gray-200 text-sm">Stay connected for product updates and news.</p>

                        {/* Social Icons (text color ensures visibility) */}
                        {/* <div className="flex space-x-4">
                            <a href="#" className="text-white hover:text-dotstark-primary transition-colors" aria-label="Twitter">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.1 4.3a.77.77 0 00-.5-.2 7.7 7.7 0 01-2.2.6c-.6-.6-1.5-1-2.6-1-2 0-3.6 1.6-3.6 3.6 0 .3 0 .5.1.7A10.3 10.3 0 004 7.6c-.3.5-.5 1-.5 1.7 0 1.2.6 2.2 1.5 2.8-.5 0-1-.2-1.4-.4 0 1.6 1.1 3 2.6 3.3-.2.1-.5.1-.7.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3 2.3-1.1 1-2.6 1.5-4.2 1.5-.3 0-.5 0-.8-.1 1.4 1 3 1.5 4.8 1.5 5.8 0 9-4.8 9-9.1 0-.1 0-.3 0-.4.6-.4 1.1-.9 1.5-1.5z" /></svg>
                            </a>
                            <a href="#" className="text-white hover:text-dotstark-primary transition-colors" aria-label="Facebook">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2c-3.1 0-5.7 2.4-6 5.5V9H5v3h3v10h4V12h3l1-3h-4V7.5c0-.6.4-1.1 1-1.1H15V2h-1z" /></svg>
                            </a>
                        </div> */}
                    </div>

                </div>

                {/* Bottom Bar: Copyright and Legal */}
                <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                    {/* MODIFIED: Using text-gray-400 for clear visibility of copyright */}
                    <p className="text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} RAG Chat. All rights reserved.
                    </p>
                    <div className="mt-3 space-x-3">
                        {/* MODIFIED: Using text-gray-400 for legal links */}
                        <Link href="/privacy" className="text-xs text-white hover:text-dotstark-primary">Privacy Policy</Link>
                        <Link href="/terms" className="text-xs text-white hover:text-dotstark-primary">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}