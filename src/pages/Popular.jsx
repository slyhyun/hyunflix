import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Header from "../components/Header";
import Loading from "../components/Loading";

const Popular = () => {
    const [movies, setMovies] = useState({
        table: [], // Table View 데이터를 저장
        scroll: [], // Infinite Scroll 데이터를 저장
    });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [view, setView] = useState("table"); // "table" or "infinite"
    const [wishlist, setWishlist] = useState(
        JSON.parse(localStorage.getItem("wishlist")) || []
    );
    const [showTopButton, setShowTopButton] = useState(false);

    // Fetch Movies for Table View
    const fetchMoviesForTable = async () => {
        const password = localStorage.getItem("password"); // API Key
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

    // Fetch Movies for Infinite Scroll
    const fetchMoviesForScroll = async (page) => {
        const password = localStorage.getItem("password"); // API Key
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

    // Fetch Movies based on View
    useEffect(() => {
        if (view === "table") {
            fetchMoviesForTable();
        } else if (view === "infinite") {
            fetchMoviesForScroll(currentPage);
        }
    }, [view, currentPage]);

    // Infinite Scroll Event Listener
    useEffect(() => {
        const handleScroll = () => {
            if (
                view === "infinite" &&
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
                !loading
            ) {
                setCurrentPage((prev) => prev + 1);
            }
            setShowTopButton(window.scrollY > 300); // Show Top Button
        };

        if (view === "infinite") {
            window.addEventListener("scroll", handleScroll);
            return () => window.removeEventListener("scroll", handleScroll);
        }
    }, [view, loading]);

    // Wishlist Management
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

    // Scroll to Top
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Render Movies
    const renderMovies = (movies) =>
        movies.map((movie) => (
            <div key={movie.id} onClick={() => toggleWishlist(movie)}>
                <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                />
                <p>{movie.title}</p>
                {wishlist.some((item) => item.id === movie.id) && <div>★</div>}
            </div>
        ));

    // Pagination for Table View
    const currentMovies = movies.table.slice(
        (currentPage - 1) * 10,
        currentPage * 10
    );

    return (
        <>
            <Toaster />
            <Header />
            <div>
                <div>
                    <button onClick={() => setView("table")}>Table View</button>
                    <button onClick={() => setView("infinite")}>Infinite Scroll</button>
                </div>
                {loading ? (
                    <Loading />
                ) : view === "table" ? (
                    <div>{renderMovies(currentMovies)}</div>
                ) : (
                    <div>{renderMovies(movies.scroll)}</div>
                )}
                {view === "table" && (
                    <div>
                        <button
                            onClick={() =>
                                setCurrentPage((prev) => Math.max(1, prev - 1))
                            }
                            disabled={currentPage === 1}
                        >
                            이전
                        </button>
                        <span>
                            {currentPage} / {Math.ceil(movies.table.length / 10)}
                        </span>
                        <button
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(
                                        Math.ceil(movies.table.length / 10),
                                        prev + 1
                                    )
                                )
                            }
                            disabled={
                                currentPage ===
                                Math.ceil(movies.table.length / 10)
                            }
                        >
                            다음
                        </button>
                    </div>
                )}
                {showTopButton && (
                    <button onClick={scrollToTop}>Top</button>
                )}
            </div>
        </>
    );
};

export default Popular;
