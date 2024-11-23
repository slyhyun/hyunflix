import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Header from "../components/Header";
import Loading from "../components/Loading";

const Container = styled.div`
    width: 100%;
    margin: 0;
    padding: 0;
    background-color: #0d1117;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 100px;
    padding-bottom: 100px;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 20px;

    button {
        background-color: #2f2f2f;
        color: white;
        border: none;
        padding: 10px 20px;
        font-size: 1rem;
        margin: 0 10px;
        border-radius: 5px;
        cursor: pointer;
        transition: color 0.3s, background-color 0.3s;

        &:hover {
            color: #946efd;
        }
    }
`;

const MoviesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr); /* 한 줄에 7개 */
    gap: 20px;
    justify-items: center;
    margin-bottom: 20px;
`;

const MovieCard = styled.div`
    flex: 0 0 auto;
    width: 200px;
    position: relative;
    cursor: pointer;
    transition: transform 0.3s;

    &:hover {
        transform: scale(1.05);
    }
`;

const MovieImage = styled.img`
    width: 100%;
    height: auto;
    border-radius: 4px;
`;

const MovieOverlay = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 10px;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;

    ${MovieCard}:hover & {
        opacity: 1;
    }
`;

const MovieTitle = styled.h4`
    font-size: 16px;
    margin: 0;
`;

const MovieInfo = styled.p`
    font-size: 14px;
    margin: 5px 0 0;
`;

const WishlistIndicator = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 20px;
    color: gold;
`;

const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;

    button {
        background-color: #2f2f2f;
        color: white;
        border: none;
        padding: 10px 15px;
        font-size: 1rem;
        margin: 0 10px;
        border-radius: 5px;
        cursor: pointer;
        transition: color 0.3s, background-color 0.3s;

        &:hover {
            color: #946efd;
        }

        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    }

    span {
        font-size: 1rem;
        color: white; /* 페이지 번호 텍스트 색상 흰색 */
    }
`;

const TopButton = styled.button`
    position: fixed;
    bottom: 50px;
    right: 50px;
    background-color: #2f2f2f;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 1rem;
    border-radius: 50%;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
        color: #946efd;
    }
`;

const Popular = () => {
    const [movies, setMovies] = useState({
        table: [],
        scroll: [],
    });
    const [loading, setLoading] = useState(true);
    const [tablePage, setTablePage] = useState(1);
    const [scrollPage, setScrollPage] = useState(1); // 스크롤 페이지 상태 추가
    const [view, setView] = useState("table");
    const [wishlist, setWishlist] = useState(
        JSON.parse(localStorage.getItem("wishlist")) || []
    );
    const [showTopButton, setShowTopButton] = useState(false);

    const fetchMoviesForTable = async () => {
        const password = localStorage.getItem("password");
        if (!password) {
            console.error("로그인이 필요합니다.");
            return;
        }

        try {
            setLoading(true);
            const allMovies = [];
            for (let page = 1; page <= 50; page++) {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/movie/popular?api_key=${password}&language=ko-KR&page=${page}`
                );
                allMovies.push(
                    ...response.data.results.map((movie, index) => ({
                        ...movie,
                        _uniqueId: `${movie.id}-${index}`,
                    }))
                );
            }
            setMovies((prev) => ({ ...prev, table: allMovies }));
            setLoading(false);
        } catch (error) {
            console.error("영화 데이터를 불러오는 중 오류가 발생했습니다:", error);
            setLoading(false);
        }
    };

    const fetchMoviesForScroll = async () => {
        const password = localStorage.getItem("password");
        if (!password) {
            console.error("로그인이 필요합니다.");
            return;
        }

        try {
            const response = await axios.get(
                `https://api.themoviedb.org/3/movie/popular?api_key=${password}&language=ko-KR&page=${scrollPage}`
            );
            setMovies((prev) => ({
                ...prev,
                scroll: [...prev.scroll, ...response.data.results],
            }));
        } catch (error) {
            console.error("영화 데이터를 불러오는 중 오류가 발생했습니다.");
        }
    };

    useEffect(() => {
        if (view === "table") {
            fetchMoviesForTable();
        } else if (view === "infinite" && scrollPage === 1) {
            fetchMoviesForScroll();
        }
    }, [view]);

    useEffect(() => {
        if (view === "infinite" && scrollPage > 1) {
            fetchMoviesForScroll();
        }
    }, [scrollPage]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                view === "infinite" &&
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
                !loading
            ) {
                setScrollPage((prev) => prev + 1);
            }
            setShowTopButton(window.scrollY > 300);
        };

        if (view === "infinite") {
            window.addEventListener("scroll", handleScroll);
            return () => window.removeEventListener("scroll", handleScroll);
        }
    }, [view, loading]);

    const toggleWishlist = (movie) => {
        const exists = wishlist.some((item) => item.id === movie.id);
        const updatedWishlist = exists
            ? wishlist.filter((item) => item.id !== movie.id)
            : [...wishlist, movie];
        setWishlist(updatedWishlist);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const renderMovies = (movies) =>
        movies.map((movie) => {
            const isWishlisted = wishlist.some((item) => item.id === movie.id);
            return (
                <MovieCard key={movie._uniqueId} onClick={() => toggleWishlist(movie)}>
                    <MovieImage
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                    />
                    <MovieOverlay>
                        <MovieTitle>{movie.title}</MovieTitle>
                        <MovieInfo>⭐ {movie.vote_average} / 10</MovieInfo>
                        <MovieInfo>{movie.release_date}</MovieInfo>
                    </MovieOverlay>
                    {isWishlisted && <WishlistIndicator>⭐</WishlistIndicator>}
                </MovieCard>
            );
        });

    const currentMovies = React.useMemo(() => {
        return movies.table.slice((tablePage - 1) * 14, tablePage * 14);
    }, [movies.table, tablePage]);

    return (
        <>
            <Header />
            <Container>
                <ButtonContainer>
                    <button onClick={() => setView("table")}>Table View</button>
                    <button onClick={() => setView("infinite")}>Infinite Scroll</button>
                </ButtonContainer>

                {loading ? (
                    <Loading />
                ) : view === "table" ? (
                    <>
                        <MoviesGrid>{renderMovies(currentMovies)}</MoviesGrid>
                        <PaginationContainer>
                            <button
                                onClick={() => setTablePage((prev) => Math.max(1, prev - 1))}
                                disabled={tablePage === 1}
                            >
                                이전
                            </button>
                            <span>
                                {tablePage} / {Math.ceil(movies.table.length / 14)}
                            </span>
                            <button
                                onClick={() =>
                                    setTablePage((prev) =>
                                        Math.min(
                                            Math.ceil(movies.table.length / 14),
                                            prev + 1
                                        )
                                    )
                                }
                                disabled={
                                    tablePage === Math.ceil(movies.table.length / 14)
                                }
                            >
                                다음
                            </button>
                        </PaginationContainer>
                    </>
                ) : (
                    <MoviesGrid>{renderMovies(movies.scroll)}</MoviesGrid>
                )}

                {showTopButton && <TopButton onClick={scrollToTop}>Top</TopButton>}
            </Container>
        </>
    );
};

export default Popular;
