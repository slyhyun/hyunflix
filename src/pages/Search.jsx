import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Header from "../components/Header";
import Loading from "../components/Loading";

const Search = () => {
    const [filters, setFilters] = useState({
        genre: "all",
        minRating: "all",
        sortBy: "popularity.desc",
        query: "", // 검색어 필드 추가
    });
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [wishlist, setWishlist] = useState([]);
    const [showTopButton, setShowTopButton] = useState(false);
    const [loading, setLoading] = useState(false);

    // API Key 가져오기
    const API_KEY = localStorage.getItem("password");

    const fetchFilteredMovies = async () => {
        if (!API_KEY) {
            toast.error("API Key가 필요합니다. 로그인 후 다시 시도해 주세요.");
            return;
        }

        try {
            setLoading(true);
            const { genre, minRating, sortBy, query } = filters;
            const genreFilter = genre !== "all" ? `&with_genres=${genre}` : "";
            const ratingFilter =
                minRating !== "all"
                    ? `&vote_average.gte=${minRating.split("-")[0]}&vote_average.lte=${minRating.split("-")[1]}`
                    : "";
            const sortFilter = sortBy ? `&sort_by=${sortBy}` : "";
            const queryFilter = query ? `&query=${encodeURIComponent(query)}` : "";

            // 검색어가 있으면 search API 사용, 없으면 discover API 사용
            const apiEndpoint = query
                ? `https://api.themoviedb.org/3/search/movie`
                : `https://api.themoviedb.org/3/discover/movie`;

            const response = await axios.get(
                `${apiEndpoint}?api_key=${API_KEY}&language=ko-KR&page=${currentPage}${genreFilter}${ratingFilter}${sortFilter}${queryFilter}`
            );

            if (currentPage === 1) {
                setMovies(response.data.results);
            } else {
                setMovies((prevMovies) => [...prevMovies, ...response.data.results]);
            }

            setLoading(false);
            toast.success("영화 데이터를 성공적으로 불러왔습니다!");
        } catch (error) {
            console.error("영화 데이터를 불러오는 중 오류가 발생했습니다:", error);
            toast.error("영화 데이터를 불러오는 중 오류가 발생했습니다.");
            setLoading(false);
        }
    };

    // 필터나 페이지 변경 시 영화 데이터 요청
    useEffect(() => {
        fetchFilteredMovies();
    }, [filters, currentPage]);

    // 스크롤 로드 및 Top 버튼 처리
    const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !loading) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
        setShowTopButton(window.scrollY > 300);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading]);

    // 필터 초기화
    const resetFilters = () => {
        setFilters({
            genre: "all",
            minRating: "all",
            sortBy: "popularity.desc",
            query: "",
        });
        setCurrentPage(1);
        setMovies([]);
    };

    // 위시리스트 추가/제거
    const toggleWishlist = (movie) => {
        const updatedWishlist = wishlist.some((item) => item.id === movie.id)
            ? wishlist.filter((item) => item.id !== movie.id)
            : [...wishlist, movie];

        setWishlist(updatedWishlist);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        toast.success(
            wishlist.some((item) => item.id === movie.id)
                ? "위시리스트에서 제거되었습니다."
                : "위시리스트에 추가되었습니다."
        );
    };

    useEffect(() => {
        const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        setWishlist(storedWishlist);
    }, []);

    return (
        <>
            <Toaster />
            <Header />
            <div className="filter-container">
                <input
                    type="text"
                    placeholder="영화 제목 검색"
                    value={filters.query}
                    onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                />
                <select
                    value={filters.genre}
                    onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
                >
                    <option value="all">모든 장르</option>
                    <option value="28">액션</option>
                    <option value="878">SF</option>
                    <option value="12">모험</option>
                    <option value="16">애니메이션</option>
                    <option value="10751">가족 영화</option>
                </select>
                <select
                    value={filters.minRating}
                    onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                >
                    <option value="all">모든 평점</option>
                    <option value="9-10">9~10</option>
                    <option value="8-9">8~9</option>
                    <option value="7-8">7~8</option>
                    <option value="6-7">6~7</option>
                    <option value="5-6">5~6</option>
                    <option value="0-5">5 이하</option>
                </select>
                <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                >
                    <option value="popularity.desc">인기순</option>
                    <option value="release_date.desc">최신순</option>
                    <option value="vote_average.desc">평점 높은 순</option>
                </select>
                <button onClick={resetFilters}>필터 초기화</button>
            </div>
            <div className="movies-container">
                {movies.map((movie) => (
                    <div key={movie.id} className="movie-card">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            onClick={() => toggleWishlist(movie)}
                        />
                        <h3>{movie.title}</h3>
                    </div>
                ))}
            </div>
            {loading && <Loading />}
            {showTopButton && (
                <button className="top-button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                    Top
                </button>
            )}
        </>
    );
};

export default Search;
