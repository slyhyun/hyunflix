// src/App.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "./approutes/AppRoutes";

const App = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('username') !== null; // 로그인 상태 확인
        if (!isLoggedIn) {
            navigate('/signin'); // 로그인이 되어 있지 않으면 /signin으로 이동
        }
    }, [navigate]);

    return (
        <>
            <AppRoutes />
        </>
    );
};

export default App;