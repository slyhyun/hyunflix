// AppRoutes.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Signin from '../pages/Signin';
import Main from '../pages/Main';
import Popular from '../pages/Popular';
import Search from '../pages/Search';
import Wishlist from '../pages/Wishlist';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/popular" element={<Popular />} />
            <Route path="/search" element={<Search />} />
            <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
    );
};

export default AppRoutes;