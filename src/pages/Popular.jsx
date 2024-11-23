import React, { useEffect, useState } from "react";
import styled from "styled-components";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Header from "../components/Header";
import Loading from "../components/Loading";

const Container = styled.div`
    width: calc(100%);
    margin: 0;
    padding: 0;
    background-color: #0d1117;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 120px;
    padding-bottom: 120px;
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
    grid-template-columns: repeat(7, 1fr); // 한 줄에 7개씩 배치
    gap: 20px;
    justify-items: center;
    margin-bottom: 20px;
`;

const MovieCard = styled.div`
    position: relative;
    width: 100%;
    max-width: 150px;
    cursor: pointer;
    transition: transform 0.3s;

    &:hover {
        transform: scale(1.05);
    }

    img {
        width: 100%;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
    }

    p {
        margin-top: 10px;
        font-size: 0.9rem;
        text-align: center;
        color: white;
    }

    div {
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: rgba(0, 0, 0, 0.7);
        color: gold;
        border-radius: 50%;
        padding: 5px;
        font-size: 0.8rem;
    }
`;

const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

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
        margin: 0 10px;
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

// Component
const Popular = () => {
    const [movies, setMovies] = useState({
        table: [],
        scroll: [],
    });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [view, setView] = useState("table");
    const [wishlist, setWishlist] = useState(
        JSON.parse(localStorage.getItem("wishlist")) || []
    );
    const [showTopButton, setShowTopButton] = useState(false);

    const fetchMoviesForTable = async () => {
        const password = localStorage.getItem("password");
        if (!password) {
            toast.error("로그인이 필요합니다. 로그인 후 다시 시도해 주세요.");
            return;
        }

        try {
            setLoading(true);
            const allMovies = [];
            for (let page = 1; page <= 20; page++) {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/movie/popular?api_key=${password}&language=ko-KR&page=${page}`
                );
                response.data.results.forEach((movie) => {
                    if (!allMovies.some((m) => m.id === movie.id)) {
                        allMovies.push(movie);
                    }
                });
            }
            setMovies((prev) => ({ ...prev, table: allMovies }));
            setLoading(false);
            toast.success("Table View 영화 데이터를 성공적으로 불러왔습니다!");
        } catch (error) {
            console.error(error);
            toast.error("영화 데이터를 불러오는 중 오류가 발생했습니다.");
            setLoading(false);
        }
    };

    const fetchMoviesForScroll = async (page) => {
        const password = localStorage.getItem("password");
        if (!password) {
            toast.error("로그인이 필요합니다. 로그인 후 다시 시도해 주세요.");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(
                `https://api.themoviedb.org/3/movie/popular?api_key=${password}&language=ko-KR&page=${page}`
            );
            setMovies((prev) => ({
                ...prev,
                scroll: [...prev.scroll, ...response.data.results],
            }));
            setLoading(false);
            toast.success("Infinite Scroll 영화 데이터를 성공적으로 불러왔습니다!");
        } catch (error) {
            console.error(error);
            toast.error("영화 데이터를 불러오는 중 오류가 발생했습니다.");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (view === "table") {
            fetchMoviesForTable();
        } else if (view === "infinite") {
            fetchMoviesForScroll(currentPage);
        }
    }, [view, currentPage]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                view === "infinite" &&
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
                !loading
            ) {
                setCurrentPage((prev) => prev + 1);
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
        toast.success(
            exists ? "추천 영화에서 제거되었습니다." : "추천 영화에 추가되었습니다."
        );
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const renderMovies = (movies) =>
        movies.map((movie) => (
            <MovieCard key={movie.id} onClick={() => toggleWishlist(movie)}>
                <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                />
                <p>{movie.title}</p>
                {wishlist.some((item) => item.id === movie.id) && <div>★</div>}
            </MovieCard>
        ));

    const currentMovies = movies.table.slice(
        (currentPage - 1) * 14,
        currentPage * 14
    );

    return (
        <>
            <Toaster />
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
                                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                            >
                                이전
                            </button>
                            <span>
                                {currentPage} / {Math.ceil(movies.table.length / 14)}
                            </span>
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(
                                            Math.ceil(movies.table.length / 14),
                                            prev + 1
                                        )
                                    )
                                }
                                disabled={
                                    currentPage === Math.ceil(movies.table.length / 14)
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
