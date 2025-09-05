import React, { ReactNode } from 'react';
import AppWrappers from './AppWrappers';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
// import '@asseinfo/react-kanban/dist/styles.css';
// import '/public/styles/Plugins.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body id={'root'}>
        <AuthProvider>
          <AppWrappers>{children}</AppWrappers>
          <Toaster
            position="top-right"
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
              // Default options for all toasts
              className: '',
              duration: 4000,
              style: {
                background: 'white',
                color: '#1f2937',
                fontSize: '14px',
                borderRadius: '12px',
                padding: '12px 16px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e5e7eb',
              },
              
              // Success toast style
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
                style: {
                  background: '#f0fdf4',
                  color: '#166534',
                  border: '1px solid #bbf7d0',
                },
              },
              
              // Error toast style
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
                style: {
                  background: '#fef2f2',
                  color: '#991b1b',
                  border: '1px solid #fecaca',
                },
              },
              
              // Loading toast style
              loading: {
                iconTheme: {
                  primary: '#422afb', // brand-500 color
                  secondary: '#fff',
                },
                style: {
                  background: '#f8fafc',
                  color: '#1e293b',
                  border: '1px solid #e2e8f0',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
