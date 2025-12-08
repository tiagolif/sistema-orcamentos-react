import React from 'react';
import { Outlet } from 'react-router-dom';

const MobileLayout = () => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <Outlet />
        </div>
    );
};

export default MobileLayout;
