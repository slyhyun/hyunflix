import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GrLogout } from "react-icons/gr";
import { BiSolidCameraMovie } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import Menu from './Menu';
import { CSSTransition } from 'react-transition-group';
import styled from "styled-components";

const HeaderWrapper = styled.header`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
    background-color: ${(props) => (props.isScrolled ? "#000" : "transparent")};
    color: #fff;
    transition: background-color 0.3s;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
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

    .username {
        font-size: 14px;
    }

    .logout {
        display: flex;
        align-items: center;
        cursor: pointer;

        span {
            margin-left: 5px;
        }

        &:hover {
            color: #946efd;
        }
    }
`;

const HamburgerIcon = styled(GiHamburgerMenu)`
    font-size: 24px;
    cursor: pointer;
`;

const Header = () => {
    const [username, setUsername] = useState(''); // 사용자 이름
    const [menu, setMenu] = useState(false); // 모바일 메뉴 열림/닫힘 상태
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // 현재 화면 크기 상태
    const navigate = useNavigate();

    // 초기 사용자 이름 설정 및 화면 크기 변화 감지
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            const name = storedUsername.split('@')[0]; // 이메일에서 '@' 이전의 이름만 표시
            setUsername(name);
        }

        // 화면 크기 변화 감지
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth > 768) {
                setMenu(false); // 768px 이상일 때 메뉴 닫기
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // 로그아웃 처리
    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        setUsername('');
        navigate('/signin'); // 로그아웃 후 로그인 페이지로 이동
    };

    // 모바일 메뉴 토글
    const toggleMenu = () => {
        setMenu((prev) => !prev);
    };

    // 메뉴 닫기
    const closeMenu = () => {
        setMenu(false);
    };

    // 네비게이션 처리
    const navigateTo = (path) => {
        navigate(path);
        closeMenu(); // 메뉴 닫기
    };

    return (
        <CSSTransition in={true} appear={true} timeout={300} classNames="header">
            <header className="header">
                {/* 로고 */}
                <div className="logo" onClick={() => navigateTo('/')}>
                    <BiSolidCameraMovie className="movie-icon" />
                    <h1 className="logo-text">Hyunflix</h1>
                </div>

                {/* 데스크톱 메뉴 */}
                {!isMobile && (
                    <nav className="menu">
                        <p onClick={() => navigateTo('/')}>홈</p>
                        <p onClick={() => navigateTo('/popular')}>대세 콘텐츠</p>
                        <p onClick={() => navigateTo('/search')}>찾아보기</p>
                        <p onClick={() => navigateTo('/wishlist')}>내가 찜한 리스트</p>
                    </nav>
                )}

                {/* 사용자 정보 및 로그아웃 */}
                {!isMobile && (
                    <div className="user-actions">
                        {username ? (
                            <>
                                <p className="username">{username}님 환영합니다!</p>
                                <div className="logout" onClick={handleLogout}>
                                    <GrLogout />
                                    <span>로그아웃</span>
                                </div>
                            </>
                        ) : (
                            <p onClick={() => navigateTo('/signin')}>로그인</p>
                        )}
                    </div>
                )}

                {/* 모바일 햄버거 메뉴 */}
                {isMobile && (
                    <GiHamburgerMenu className="hamburger-icon" onClick={toggleMenu} />
                )}

                {/* 모바일 메뉴 표시 */}
                {menu && isMobile && (
                    <Menu
                        handleLogout={handleLogout}
                        username={username}
                        onClose={closeMenu}
                    />
                )}
            </header>
        </CSSTransition>
    );
};

export default Header;
