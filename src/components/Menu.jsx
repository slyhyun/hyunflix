import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { BiSolidCameraMovie } from "react-icons/bi";
import { GrLogout } from "react-icons/gr";

const MenuWrapper = styled.div`
    position: fixed;
    top: 0;
    right: 0; /* 메뉴가 오른쪽에서 나타나도록 설정 */
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
    top: 25px;
    right: 20px;
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

const Menu = ({ handleLogout, onClose, isOpen }) => {
    const navigate = useNavigate();

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
            <LogoutButton onClick={handleLogout}>
                <GrLogout />
                <span>로그아웃</span>
            </LogoutButton>
        </MenuWrapper>
    );
};

export default Menu;
