import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GrLogout } from "react-icons/gr";
import { BiSolidCameraMovie } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import Menu from "./Menu";
import styled from "styled-components";

const HEADER_HEIGHT = "60px"; // 헤더 높이 설정

const HeaderWrapper = styled.header`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
    background-color: ${(props) => (props.isHovered || props.isScrolled ? "#000" : "transparent")};
    color: #fff;
    transition: background-color 0.3s;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    height: ${HEADER_HEIGHT};
`;

const PageWrapper = styled.div`
    padding-top: ${HEADER_HEIGHT}; // 헤더 높이만큼 위에 여백 추가
    background-color: #1a1a1a; // 배경색 설정 (필요하면 조정 가능)
    min-height: 100vh; // 페이지 전체를 차지하도록 설정
`;

const Logo = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;

    .movie-icon {
        font-size: 24px;
        margin-right: 10px;
    }

    .logo-text {
        font-size: 20px;
        font-weight: bold;
    }

    &:hover {
        color: #946efd;
    }
`;

const Nav = styled.nav`
    display: flex;
    gap: 20px;

    p {
        cursor: pointer;

        &:hover {
            color: #946efd;
        }
    }
`;

const UserActions = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;

    .logout {
        display: flex;
        align-items: center;
        cursor: pointer;

        span {
            margin-left: 5px;
        }

        &:hover {
            color: red;
        }
    }
`;

const HamburgerIcon = styled(GiHamburgerMenu)`
    font-size: 24px;
    cursor: pointer;
`;

const Header = () => {
    const [username, setUsername] = useState('');
    const [menu, setMenu] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            const name = storedUsername.split('@')[0];
            setUsername(name);
        }

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth > 768) {
                setMenu(false);
            }
        };

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        setUsername('');
        navigate('/signin');
    };

    const toggleMenu = () => {
        setMenu((prev) => !prev);
    };

    const closeMenu = () => {
        setMenu(false);
    };

    const navigateTo = (path) => {
        navigate(path);
        closeMenu();
    };

    return (
        <>
            <HeaderWrapper
                isScrolled={isScrolled}
                isHovered={isHovered}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Logo onClick={() => navigateTo('/')}>
                    <BiSolidCameraMovie className="movie-icon" />
                    <h1 className="logo-text">Hyunflix</h1>
                </Logo>

                {!isMobile && (
                    <Nav>
                        <p onClick={() => navigateTo('/')}>홈</p>
                        <p onClick={() => navigateTo('/popular')}>대세 콘텐츠</p>
                        <p onClick={() => navigateTo('/search')}>찾아보기</p>
                        <p onClick={() => navigateTo('/wishlist')}>내가 찜한 리스트</p>
                    </Nav>
                )}

                {!isMobile && (
                    <UserActions>
                        <div className="logout" onClick={handleLogout}>
                            <GrLogout />
                            <span>로그아웃</span>
                        </div>
                    </UserActions>
                )}

                {isMobile && <HamburgerIcon onClick={toggleMenu} />}

                {menu && isMobile && (
                    <Menu
                        handleLogout={handleLogout}
                        username={username}
                        onClose={closeMenu}
                    />
                )}
            </HeaderWrapper>
            <PageWrapper>
                {/* 페이지 콘텐츠를 여기에 렌더링 */}
                <p style={{ color: "white" }}>헤더가 콘텐츠와 겹치지 않도록 설정되었습니다!</p>
            </PageWrapper>
        </>
    );
};

export default Header;
