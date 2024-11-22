import React from "react";
import { useNavigate } from "react-router-dom";

const Menu = ({ handleLogout, username, onClose }) => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
        onClose(); // 메뉴 닫기
    };

    return (
        <div className="menu-wrapper">
            <button className="close-button" onClick={onClose}>
                ✖
            </button>
            <ul className="menu-list">
                <li className="menu-username">
                    {username ? (
                        <>
                            {username}님
                            <p className="welcome-message">환영합니다!</p>
                        </>
                    ) : (
                        "로그인 해주세요"
                    )}
                </li>
                <li className="menu-item" onClick={() => handleNavigation("/")}>
                    홈
                </li>
                <li
                    className="menu-item"
                    onClick={() => handleNavigation("/popular")}
                >
                    대세 콘텐츠
                </li>
                <li
                    className="menu-item"
                    onClick={() => handleNavigation("/search")}
                >
                    찾아보기
                </li>
                <li
                    className="menu-item"
                    onClick={() => handleNavigation("/wishlist")}
                >
                    내가 찜한 리스트
                </li>
                <li className="menu-item logout" onClick={handleLogout}>
                    로그아웃
                </li>
            </ul>
        </div>
    );
};

export default Menu;
