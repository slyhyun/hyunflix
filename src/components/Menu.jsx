import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { BiSolidCameraMovie } from "react-icons/bi";
import { GrLogout } from "react-icons/gr";

const MenuWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
    color: #fff;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 20px;
`;

const CloseButton = styled.button`
    align-self: flex-end;
    background: none;
    border: none;
    color: #fff;
    font-size: 24px;
    position: fixed; /* 위치 고정 */
    right: 20px; /* 스크롤 바에 가리지 않도록 조정 */
    top: 35px; /* 상단 간격 조정 */
    cursor: pointer;
    transition: color 0.3s;
    
    &:hover {
        color: #946efd;
    }
`;

const Logo = styled.div`
    display: flex;n
    align-items: center;
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

    ${(props) =>
        props.active &&
        `
        color: #946efd;
    `}
`;

const LogoutButton = styled.div`
    display: flex;
    align-items: center;
    margin-top: 40px;
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

const Menu = ({ handleLogout, onClose }) => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
        onClose();
    };

    return (
        <MenuWrapper>
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
            <LogoutButton onClick={handleLogout}>
                <GrLogout />
                <span>로그아웃</span>
            </LogoutButton>
        </MenuWrapper>
    );
};

export default Menu;
