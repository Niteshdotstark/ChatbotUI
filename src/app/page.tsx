// app/page.tsx
import Link from 'next/link'; // For navigation links
import Image from 'next/image'; // For optimized images
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="section gradient-bg text-white py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20" />
        {/* Floating Elements (for CSS animations defined in globals.css) */}
        <div
          className="absolute top-20 left-10 w-20 h-20 bg-dotstark-primary opacity-10 rounded-full float"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="absolute top-40 right-20 w-16 h-16 bg-white opacity-5 rounded-full float"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute bottom-32 left-1/4 w-12 h-12 bg-dotstark-primary opacity-15 rounded-full float"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute bottom-20 right-1/3 w-24 h-24 bg-white opacity-5 rounded-full float"
          style={{ animationDelay: '0.5s' }}
        />
        <div className="max-w-7xl mx-auto px-3 px-sm-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1
            className="text-6xl font-bold mb-8 bounce-in font-heading leading-tight"
            style={{ fontSize: '3.75rem' }}
          >
            Intelligent AI Chat Solutions
          </h1>
          <p
            className="text-2xl mb-12 text-gray-200 max-w-4xl mx-auto slide-up leading-relaxed font-light"
            style={{ animationDelay: '0.3s' }}
          >
            Transform your customer experience with advanced RAG-powered AI chat
            that understands context and delivers accurate responses.
          </p>
          <div
            className="flex flex-col align-items-center sm:flex-row gap-6 justify-center slide-up"
            style={{ animationDelay: '0.6s' }}
          >
            <Link href="/register" legacyBehavior>
              <a className="btn-dotstark text-white">
                Start Free Trial
              </a>
            </Link>
            {/* ADDED View Pricing Button */}
            <Link href="/pricing" legacyBehavior>
              <a
                className="btn-outline-dotstark border-white text-white  "
              >
                View Pricing
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-5xl text-dotstark-dark mb-4 fs-1 font-heading">Why Choose RAG Chat?</h2>
            <p className="text-muted text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
              Powerful features designed to enhance your customer interactions and streamline support operations.
            </p>
          </div>

          <div className="row gy-4">

            {/* Benefit Card 1 */}
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm text-center p-4 rounded-4 card-hover bg-white dotstark-shadow">
                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl">
                  <svg className="text-dotstark-primary" width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h5 className="fw-700 fs-4">Accurate AI Responses</h5>
                <p className="text-muted">
                  Advanced RAG technology ensures contextually relevant and accurate answers to customer queries.
                </p>
              </div>
            </div>

            {/* Benefit Card 2 */}
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm text-center p-4 rounded-4 card-hover bg-white dotstark-shadow">
                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl"
                >
                  <svg className="text-dotstark-primary" width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h5 className="fw-700 fs-4">Secure & Compliant</h5>
                <p className="text-muted">
                  Enterprise-grade security with GDPR compliance and data encryption at rest and in transit.
                </p>
              </div>
            </div>

            {/* Benefit Card 3 */}
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm text-center p-4 rounded-4 card-hover bg-white dotstark-shadow">
                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl"
                >
                  <svg className="text-dotstark-primary" width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h5 className="fw-700 fs-4">Easy Integration</h5>
                <p className="text-muted">
                  Simple API integration with your existing systems. Get up and running in minutes, not hours.
                </p>
              </div>
            </div>

            {/* Benefit Card 4 */}
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm text-center p-4 rounded-4 card-hover bg-white dotstark-shadow">
                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl"
                >
                  <svg className="text-dotstark-primary" width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h5 className="fw-700 fs-4">Analytics & Insights</h5>
                <p className="text-muted">
                  Comprehensive dashboard with chat analytics, performance metrics, and customer insights.
                </p>
              </div>
            </div>

            {/* Benefit Card 5 */}
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm text-center p-4 rounded-4 card-hover bg-white dotstark-shadow">
                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl"
                >
                  <svg className="text-dotstark-primary" width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h5 className="fw-700 fs-4">24/7 Support</h5>
                <p className="text-muted">
                  Round-the-clock technical support and dedicated account management for enterprise clients.
                </p>
              </div>
            </div>

            {/* Benefit Card 6 */}
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm text-center p-4 rounded-4 card-hover bg-white dotstark-shadow">
                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl"
                >
                  <svg className="text-dotstark-primary" width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h5 className="fw-700 fs-4">Chat History</h5>
                <p className="text-muted">
                  Complete conversation history with search capabilities and export functionality for analysis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />

    </>
  );
}