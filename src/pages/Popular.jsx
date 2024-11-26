import React, { useEffect, useState, useCallback } from "react";
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
    min-height: 80vh;
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
    gap: 20px;
    justify-items: center;
    margin-bottom: 20px;

    @media (max-width: 768px) {
        grid-template-columns: repeat(3, 1fr); /* 화면 너비 768px 이하일 때 3열 */
    }

    @media (min-width: 769px) and (max-width: 1188px) {
        grid-template-columns: repeat(5, 1fr); /* 화면 너비 769px ~ 1188px일 때 5열 */
    }

    @media (min-width: 1189px) {
        grid-template-columns: repeat(7, 1fr); /* 화면 너비 1189px 이상일 때 7열 */
    }
`;

const MovieCard = styled.div`
    flex: 0 0 auto;
    width: 100%;
    position: relative;
    cursor: pointer;
    max-width: 200px;
    transition: transform 0.3s;

    &:hover {
        transform: scale(1.05);
    }
`;

const MovieImage = styled.img`
    width: 100%;
    height: auto;
    border-radius: 5px;
`;

const MovieOverlay = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 90%;
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
        color: white;
    }
`;

const TopButton = styled.button`
    position: fixed;
    bottom: 50px;
    right: 50px;
    background-color: #2f2f2f;
    color: white;
    border: none;
    padding: 10px 15px;
    font-size: 1rem;
    border-radius: 5px;
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
    const [scrollLoading, setScrollLoading] = useState(false); 
    const [tablePage, setTablePage] = useState(1);
    const [scrollPage, setScrollPage] = useState(1); 
    const [view, setView] = useState("table");
    const [wishlist, setWishlist] = useState(
        JSON.parse(localStorage.getItem("wishlist")) || []
    );
    const [showTopButton, setShowTopButton] = useState(false);
    const [cardsPerPage, setCardsPerPage] = useState(14); 

    useEffect(() => {
        if (view === "table") {
            document.body.style.overflow = "hidden"; 
        } else {
            document.body.style.overflow = "auto"; 
        }
        return () => {
            document.body.style.overflow = "auto"; 
        };
    }, [view]);

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

    const fetchMoviesForScroll = useCallback(async () => {
        const password = localStorage.getItem("password");
        if (!password) {
            console.error("로그인이 필요합니다.");
            return;
        }

        try {
            setScrollLoading(true); 
            const response = await axios.get(
                `https://api.themoviedb.org/3/movie/popular?api_key=${password}&language=ko-KR&page=${scrollPage}`
            );
            setMovies((prev) => ({
                ...prev,
                scroll: [...prev.scroll, ...response.data.results],
            }));
            setScrollLoading(false); 
        } catch (error) {
            console.error("영화 데이터를 불러오는 중 오류가 발생했습니다.");
            setScrollLoading(false); 
        }
    }, [scrollPage]);

    useEffect(() => {
        if (view === "table") {
            fetchMoviesForTable();
        } else if (view === "infinite" && scrollPage === 1) {
            fetchMoviesForScroll();
        }
    }, [scrollPage, view, fetchMoviesForScroll]);

    useEffect(() => {
        if (view === "infinite" && scrollPage > 1) {
            fetchMoviesForScroll();
        }
    }, [scrollPage, view, fetchMoviesForScroll]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                view === "infinite" &&
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
                !scrollLoading
            ) {
                setScrollPage((prev) => prev + 1); 
            }
            setShowTopButton(window.scrollY > 300);
        };

        if (view === "infinite") {
            window.addEventListener("scroll", handleScroll);
            return () => window.removeEventListener("scroll", handleScroll);
        }
    }, [view, scrollLoading]);

    useEffect(() => {
        const calculateCardsPerPage = () => {
            const width = window.innerWidth;
            if (width <= 768) return 6; 
            if (width <= 1188) return 10; 
            return 14; 
        };

        setCardsPerPage(calculateCardsPerPage());

        const handleResize = () => {
            setCardsPerPage(calculateCardsPerPage());
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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

    const renderMovies = (moviesList) =>
        moviesList.map((movie) => {
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
        const startIndex = (tablePage - 1) * cardsPerPage;
        const endIndex = startIndex + cardsPerPage;
        return movies.table.slice(startIndex, endIndex);
    }, [movies.table, tablePage, cardsPerPage]);

    return (
        <>
            <Header />
            <Container>
                <ButtonContainer>
                    <button onClick={() => setView("table")}>Table View</button>
                    <button onClick={() => setView("infinite")}>Infinite Scroll</button>
                </ButtonContainer>

                {view === "table" && loading ? (
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
                                {tablePage} / {Math.ceil(movies.table.length / cardsPerPage)}
                            </span>
                            <button
                                onClick={() =>
                                    setTablePage((prev) =>
                                        Math.min(
                                            Math.ceil(movies.table.length / cardsPerPage),
                                            prev + 1
                                        )
                                    )
                                }
                                disabled={
                                    tablePage === Math.ceil(movies.table.length / cardsPerPage)
                                }
                            >
                                다음
                            </button>
                        </PaginationContainer>
                    </>
                ) : (
                    <>
                        <MoviesGrid>{renderMovies(movies.scroll)}</MoviesGrid>
                        {scrollLoading && <Loading />}
                    </>
                )}

                {showTopButton && <TopButton onClick={scrollToTop}>Top</TopButton>}
            </Container>
        </>
    );
};

export default Popular;
