import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';
import { AppProvider } from './context/AppContext';

export default function StudentLayout() {
    return (
        <AppProvider>
            <Toaster position="top-right" />
            <Outlet />
        </AppProvider>
    );
}
