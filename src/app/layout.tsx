import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import ClientWrapper from '@/components/ClientWrapper';
import ErrorBoundary from '@/components/ErrorBoundary';
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
export const metadata: Metadata = {

  title: 'RAG Chat - Intelligent AI Chat Solutions',
  description: 'Admin panel for multi-tenant RAG application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* New font links: Nunito for headings, Roboto for body */}
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800&family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="">

        <ErrorBoundary fallback={<div>Something went wrong. Please refresh the page.</div>}>
          <ClientWrapper>
            <QueryProvider>
              <AuthProvider>
                <NavBar />
                {children}

              </AuthProvider>
            </QueryProvider>
          </ClientWrapper>
        </ErrorBoundary>
      </body>
    </html>
  );
}