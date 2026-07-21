import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SchoolTestHome from './pages/Home';

function SchoolTestApp() {
    return (
        <div className="schooltest-app-root">
            <Routes>
                <Route path="/" element={<SchoolTestHome />} />
                <Route path="*" element={<div className="p-10 text-center">Page Not Found</div>} />
            </Routes>
        </div>
    );
}

export default SchoolTestApp;
