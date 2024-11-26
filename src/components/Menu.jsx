import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { BiSolidCameraMovie } from "react-icons/bi";
import { GrLogout } from "react-icons/gr";

const MenuWrapper = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    width: 300px;
    height: 100%;
    background-color: #000;
    color: #fff;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 20px;
    transform: ${(props) => (props.isOpen ? "translateX(0)" : "translateX(100%)")};
    transition: transform 0.3s ease-in-out;
`;

const CloseButton = styled.button`
    align-self: flex-end;
    background: none;
    border: none;
    color: #fff;
    font-size: 24px;
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
        color: #946efd;
    }
`;

const Logo = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40px;
    cursor: pointer;
    transition: color 0.3s;

    .movie-icon {
        font-size: 36px;
        margin-right: 10px;
    }

    .logo-text {
        font-size: 24px;
        font-weight: bold;
        line-height: 1;
    }

    &:hover {
        color: #946efd;
    }
`;

const MenuList = styled.ul`
    list-style: none;
    padding: 0;
    width: 100%;
`;

const MenuItem = styled.li`
    font-size: 18px;
    margin: 20px 0;
    text-align: center;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
        color: #946efd;
    }
`;

const LogoutButton = styled.div`
    display: flex;
    align-items: center;
    margin-top: 10px;
    cursor: pointer;
    color: white;
    transition: color 0.3s;

    &:hover {
        color: red;
    }

    span {
        margin-left: 8px;
        font-size: 16px;
    }
`;

const UsernameDisplay = styled.span`
    color: white;
    font-size: 16px;
    margin-top: 40px;  // 로그아웃 버튼 위의 여백
    transition: color 0.3s;

    &:hover {
        color: #946efd;
    }
`;

const Menu = ({ handleLogout, onClose, isOpen }) => {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            const name = storedUsername.split("@")[0];
            setUsername(name);
        }
    }, []);

    const handleNavigation = (path) => {
        navigate(path);
        onClose();
    };

    return (
        <MenuWrapper isOpen={isOpen}>
            <CloseButton onClick={onClose}>✖</CloseButton>
            <Logo onClick={() => handleNavigation("/")}>
                <BiSolidCameraMovie className="movie-icon" />
                <h1 className="logo-text">Hyunflix</h1>
            </Logo>
            <MenuList>
                <MenuItem onClick={() => handleNavigation("/")}>홈</MenuItem>
                <MenuItem onClick={() => handleNavigation("/popular")}>
                    대세 콘텐츠
                </MenuItem>
                <MenuItem onClick={() => handleNavigation("/search")}>
                    찾아보기
                </MenuItem>
                <MenuItem onClick={() => handleNavigation("/wishlist")}>
                    내가 찜한 리스트
                </MenuItem>
            </MenuList>
            {username && <UsernameDisplay>{username}님</UsernameDisplay>}
            <LogoutButton onClick={handleLogout}>
                <GrLogout />
                <span>로그아웃</span>
            </LogoutButton>
        </MenuWrapper>
    );
};

export default Menu;
