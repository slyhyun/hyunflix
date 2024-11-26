import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "./approutes/AppRoutes";

const App = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLogin') !== null; // isLogin 값 확인
        if (!isLoggedIn) {
            navigate('/signin'); // isLogin이 null이면 /signin으로 이동
        }
    }, [navigate]);

    return (
        <>
            <AppRoutes />
        </>
    );
};

export default App;
