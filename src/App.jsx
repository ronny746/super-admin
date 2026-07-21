import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

// Lazy load the Admin App to reduce initial bundle size
const AdminApp = React.lazy(() => import('./super-admin-landing-page/AdminApp'));

// --- DISABLED APPS AS REQUESTED ---
// import LandingApp from './landing-page/LandingApp';
// const AbroadApp = React.lazy(() => import('./abrod-landing-page/AbroadApp'));
// const SchoolTestApp = React.lazy(() => import('./schooltest-landing-page/SchoolTestApp'));
// import VidhyakulamApp from './vidhyakulam-landing-page/VidhyakulamApp';
// const ResultSearchPage = React.lazy(() => import('./super-admin-landing-page/pages/ResultSearchPage'));
// const AdmitCardFlow = React.lazy(() => import('./super-admin-landing-page/pages/AdmitCardFlow'));

export default function App() {
    return (
        <HelmetProvider>
            <Toaster position="top-right" />
            <BrowserRouter>
                <Routes>
                    {/* Admin Panel mounted at /admin with Lazy Loading */}
                    <Route path="/admin/*" element={
                        <Suspense fallback={
                            <div className="flex items-center justify-center h-screen bg-gray-50">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                            </div>
                        }>
                            <AdminApp />
                        </Suspense>
                    } />

                    {/* Redirect root to admin */}
                    <Route path="*" element={<Navigate to="/admin" replace />} />

                    {/* --- DISABLED ROUTES --- */}
                    {/* 
                    <Route path="/result" element={<Suspense fallback={...}><ResultSearchPage /></Suspense>} />
                    <Route path="/cosmos/*" element={<Suspense fallback={...}><AbroadApp /></Suspense>} />
                    <Route path="/studymaterial/*" element={<Suspense fallback={...}><SchoolTestApp /></Suspense>} />
                    <Route path="/vidhyakulam/*" element={<VidhyakulamApp />} />
                    <Route path="/admitcard" element={<Suspense fallback={...}><AdmitCardFlow /></Suspense>} />
                    <Route path="/*" element={<LandingApp />} />
                    */}
                </Routes>
            </BrowserRouter>
        </HelmetProvider>
    );
}
