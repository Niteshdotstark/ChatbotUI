// src/app/pricing/page.tsx
'use client';
import Link from 'next/link';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
    const { isLoggedIn, updatePlan } = useAuth();
    const router = useRouter();

    // Handler for the Standard Plan
    const handleStandardPlanPurchase = (e: React.MouseEvent) => {
        e.preventDefault();

        if (!isLoggedIn) {
            // Redirect to registration, appending 'plan=standard' query param
            router.push('/register?plan=standard');
            return;
        }

        // Update the plan to 'standard'
        updatePlan('standard', null);
        router.push('/dashboard');
        alert('Successfully upgraded to Standard Plan!');
    };

    // Handler for the NEW Lite Plan
    const handleLitePlanPurchase = (e: React.MouseEvent) => {
        e.preventDefault();

        if (!isLoggedIn) {
            // Redirect to registration, appending 'plan=lite' query param
            router.push('/register?plan=lite');
            return;
        }

        // Update the plan to 'lite'
        updatePlan('lite' as any, null);
        router.push('/dashboard');
        alert('Successfully upgraded to Lite Plan!');
    };

    // Helper component for checkmark SVG (Success/Included)
    // ... (CheckIcon and DisabledIcon remain the same)
    const CheckIcon = () => (
        <svg className="w-6 h-6 text-dotstark-primary me-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
        </svg>
    );

    // Helper component for disabled feature (to ensure equal height across cards)
    const DisabledIcon = () => (
        <svg className="w-6 h-6 text-gray-300 me-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
        </svg>
    );

    // New Helper component for the SVG image (Arrow Icon)
    const ArrowLinkIcon = () => (
        <span className="ms-1 d-inline-flex align-items-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" data-rtl-flip="">
                <path d="M11.3349 10.3301V5.60547L4.47065 12.4707C4.21095 12.7304 3.78895 12.7304 3.52925 12.4707C3.26955 12.211 3.26955 11.789 3.52925 11.5293L10.3945 4.66504H5.66011C5.29284 4.66504 4.99507 4.36727 4.99507 4C4.99507 3.63273 5.29284 3.33496 5.66011 3.33496H11.9999L12.1337 3.34863C12.4369 3.41057 12.665 3.67857 12.665 4V10.3301C12.6649 10.6973 12.3672 10.9951 11.9999 10.9951C11.6327 10.9951 11.335 10.6973 11.3349 10.3301ZM11.333 4.66699L11.3349 4.66797L11.332 4.66504H11.331L11.333 4.66699Z"></path>
            </svg>
        </span>
    );

    return (
        <section className="py-5 bg-light min-vh-100 d-flex align-items-center">
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="display-4 fw-bold text-dark mb-3">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="fs-4 text-muted mx-auto" style={{ maxWidth: 800 }}>
                        Choose the perfect plan for your business needs. Start with our 7-day free trial.
                    </p>
                </div>

                {/* Grid uses col-lg-4 to fit 3 cards with original shadow and padding */}
                <div className="row justify-content-center g-4 ">

                    {/* 1. Free Plan (8 list items for height consistency) */}
                    <div className="col-lg-4 col-md-6 mb-4">
                        <div className="card border position-relative h-100 shadow-sm rounded-5 dotstark-shadow-lg card-hover">
                            <div className="card-body d-flex flex-column py-5 px-lg-3 px-xl-5">
                                <h3 className="h2 fw-bold text-dark text-center mb-3 text-dotstark-dark">Free</h3>
                                <div className="display-6 fw-bold text-dotstark-primary text-center mb-2">
                                    ₹0<span className="fs-5 text-muted ">/month</span>
                                </div>
                                <p className="text-muted mb-4 text-gray-600 font-medium text-center">7 days free trial</p>

                                <ul className="list-unstyled text-start mb-5 flex-grow-1">
                                    <li className="d-flex align-items-center mb-3"><CheckIcon /><span className="text-gray-700 text-lg me-3">Basic AI capabilities</span></li>
                                    <li className="d-flex align-items-center mb-3"><CheckIcon /><span className="text-gray-700 text-lg">Dashboard access</span></li>
                                    <li className="d-flex align-items-center mb-3"><CheckIcon /><span className="text-gray-700 text-lg">Website integration</span></li>
                                    <li className="d-flex align-items-center mb-3"><CheckIcon /><span className="text-gray-700 text-lg">Email support</span></li>

                                    {/* Filler Items (to match 8 items in total) */}
                                    <li className="d-flex align-items-center mb-3"><DisabledIcon /><span className="text-gray-500 text-lg">Limited Analytics</span></li>
                                    <li className="d-flex align-items-center mb-3"><DisabledIcon /><span className="text-gray-500 text-lg">1 Team User</span></li>
                                    <li className="d-flex align-items-center mb-3"><DisabledIcon /><span className="text-gray-500 text-lg">No Social Media Integration</span></li>
                                    <li className="d-flex align-items-center mb-3"><DisabledIcon /><span className="text-gray-500 text-lg">No Priority Support</span></li>
                                </ul>

                                <Link href="/register" className=" btn-dotstark btn btn-primary btn-lg w-100" >
                                    <span className='d-flex justify-content-center align-items-center'>
                                        Get Started
                                        <ArrowLinkIcon />
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* 2. Lite Plan (Mid Tier - 8 list items, Most Popular badge retained) */}
                    <div className="col-lg-4 col-md-6 mb-4">
                        <div className="card border position-relative h-100 shadow-sm rounded-5 dotstark-shadow-lg card-hover">
                            <div className="position-absolute top-0 start-50 translate-middle">
                                <span className="badge text-white px-5 py-3 rounded-pill text-uppercase fw-bold bg-dotstark-primary rounded-full text-sm font-bold uppercase tracking-wide">
                                    Most Popular
                                </span>
                            </div>
                            <div className="card-body text-center d-flex flex-column py-5 px-lg-3 px-xl-5 ">
                                <h3 className="h2 fw-bold text-dark text-center mb-3 text-dotstark-dark">Lite</h3>
                                <div className="display-6 fw-bold mb-2 text-center text-dotstark-primary">
                                    ₹49<span className="fs-5 text-muted">/month</span>
                                </div>
                                <p className="text-muted mb-4 text-gray-600 font-medium text-center">Perfect for growing businesses</p>

                                <ul className="list-unstyled text-start mb-5 flex-grow-1">
                                    <li className="d-flex align-items-center mb-3"><CheckIcon /><span className="text-gray-700 text-lg">Advanced AI capabilities</span></li>
                                    <li className="d-flex align-items-center mb-3"><CheckIcon /><span className="text-gray-700 text-lg">Full dashboard & analytics</span></li>
                                    <li className="d-flex align-items-center mb-3"><CheckIcon /><span className="text-gray-700 text-lg">Website integration</span></li>
                                    <li className="d-flex align-items-center mb-3"><CheckIcon /><span className="text-gray-700 text-lg">Instagram integration</span></li>
                                    <li className="d-flex align-items-center mb-3"><CheckIcon /><span className="text-gray-700 text-lg">Facebook integration</span></li>
                                    <li className="d-flex align-items-center mb-3"><CheckIcon /><span className="text-gray-700 text-lg">Team support (up to 3 users)</span></li>

                                    {/* Filler Items to reach 8 total */}
                                    <li className="d-flex align-items-center mb-3"><DisabledIcon /><span className="text-gray-500 text-lg">No Telegram Integration</span></li>
                                    <li className="d-flex align-items-center mb-3"><DisabledIcon /><span className="text-gray-500 text-lg">No Phone Support</span></li>
                                </ul>

                                {/* **UPDATED** to use handleLitePlanPurchase */}
                                <button onClick={handleLitePlanPurchase} className="btn-dotstark btn btn-primary btn-lg w-100">
                                    <span className='d-flex justify-content-center align-items-center'>
                                        Get Lite
                                        <ArrowLinkIcon />
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 3. Standard Plan  */}
                    <div className="col-lg-4 col-md-6 mb-4">
                        <div className="card border position-relative h-100 shadow-sm rounded-5 dotstark-shadow-lg card-hover">
                            <div className="card-body text-center d-flex flex-column py-5 px-lg-3 px-xl-5">
                                <h3 className="h2 fw-bold text-dark mb-3 text-center text-dotstark-dark">Standard</h3>
                                <div className="display-6 fw-bold mb-2 text-center text-dotstark-primary">
                                    ₹99<span className="fs-5 text-muted">/month</span>
                                </div>
                                <p className="text-muted mb-4 text-gray-600 font-medium text-center">Best for scaling organizations</p>

                                <ul className="list-unstyled text-start mb-5 flex-grow-1">
                                    {/* All 8 requested features for Standard */}
                                    <li className="d-flex align-items-center mb-3"><CheckIcon /><span className="text-gray-700 text-lg">Advanced AI capabilities</span></li>
                                    <li className="d-flex align-items-center mb-3"><CheckIcon /><span className="text-gray-700 text-lg">Full dashboard & analytics</span></li>
                                    <li className="d-flex align-items-center mb-3"><CheckIcon /><span className="text-gray-700 text-lg">Website integration</span></li>
                                    <li className="d-flex align-items-center mb-3"><CheckIcon /><span className="text-gray-700 text-lg">Instagram integration</span></li>
                                    <li className="d-flex align-items-center mb-3"><CheckIcon /><span className="text-gray-700 text-lg">Facebook integration</span></li>
                                    <li className="d-flex align-items-center mb-3"><CheckIcon /><span className="text-gray-700 text-lg">Telegram integration</span></li>
                                    <li className="d-flex align-items-center mb-3"><CheckIcon /><span className="text-gray-700 text-lg">Team support (up to 10 users)</span></li>
                                    <li className="d-flex align-items-center mb-3"><CheckIcon /><span className="text-gray-700 text-lg">Priority support & phone</span></li>
                                </ul>

                                {/* **CORRECTED** to use handleStandardPlanPurchase */}
                                <button onClick={handleStandardPlanPurchase} className="btn-dotstark btn btn-primary btn-lg w-100">
                                    <span className='d-flex justify-content-center align-items-center'>
                                        Get Standard
                                        <ArrowLinkIcon />
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}