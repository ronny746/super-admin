import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CosmosLanding from './pages/CosmosLanding';
import AbroadHome from './pages/Home';
import MbbsLanding from './pages/MbbsLanding';

function AbroadApp() {
    return (
        <div className="abroad-app-root">
            <Routes>
                <Route path="/" element={<CosmosLanding />} />
                <Route path="/sat" element={<AbroadHome />} />
                <Route path="/mbbs" element={<MbbsLanding />} />
                <Route path="*" element={<div className="p-10 text-center">Page Not Found</div>} />
            </Routes>
        </div>
    );
}

export default AbroadApp;
