import React, { useEffect, useState } from "react";
import styled from "styled-components";
import toast, { Toaster } from "react-hot-toast";
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
    padding-top: 120px;
    padding-bottom: 120px;
`;

const FiltersContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 20px;

    input,
    select,
    button {
        background-color: #2f2f2f;
        color: white;
        border: none;
        padding: 10px 15px;
        font-size: 1rem;
        margin: 0 10px 10px;
        border-radius: 5px;
        cursor: pointer;
        transition: color 0.3s, background-color 0.3s;

        &:hover {
            color: #946efd;
        }

        &::placeholder {
            color: #aaa;
        }
    }
`;

const MoviesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
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

const Search = () => {
    const [filters, setFilters] = useState({
        genre: "all",
        minRating: "all",
        sortBy: "popularity.desc",
        query: "",
    });
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [wishlist, setWishlist] = useState([]);
    const [showTopButton, setShowTopButton] = useState(false);
    const [loading, setLoading] = useState(false);

    const API_KEY = localStorage.getItem("password");

    const fetchFilteredMovies = async (reset = false) => {
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

            const apiEndpoint = query
                ? `https://api.themoviedb.org/3/search/movie`
                : `https://api.themoviedb.org/3/discover/movie`;

            const response = await axios.get(
                `${apiEndpoint}?api_key=${API_KEY}&language=ko-KR&page=${currentPage}${genreFilter}${ratingFilter}${sortFilter}${queryFilter}`
            );

            setMovies((prevMovies) =>
                reset ? response.data.results : [...prevMovies, ...response.data.results]
            );

            setLoading(false);
        } catch (error) {
            console.error("영화 데이터를 불러오는 중 오류가 발생했습니다:", error);
            toast.error("영화 데이터를 불러오는 중 오류가 발생했습니다.");
            setLoading(false);
        }
    };

    // 필터 변경 시 페이지와 영화 데이터 초기화 후 다시 요청
    useEffect(() => {
        setCurrentPage(1);
        fetchFilteredMovies(true);
    }, [filters]);

    // 페이지 변경 시 영화 데이터 추가 요청
    useEffect(() => {
        if (currentPage > 1) {
            fetchFilteredMovies();
        }
    }, [currentPage]);

    const handleScroll = () => {
        if (
            window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
            !loading
        ) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
        setShowTopButton(window.scrollY > 300);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading]);

    const resetFilters = () => {
        setFilters({
            genre: "all",
            minRating: "all",
            sortBy: "popularity.desc",
            query: "",
        });
    };

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
        <Container>
            <Toaster />
            <Header />
            <FiltersContainer>
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
            </FiltersContainer>
            <MoviesGrid>
                {movies.map((movie) => (
                    <MovieCard key={movie.id}>
                        <MovieImage
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            onClick={() => toggleWishlist(movie)}
                        />
                        <MovieOverlay>
                            <MovieTitle>{movie.title}</MovieTitle>
                            <MovieInfo>⭐ {movie.vote_average} / 10</MovieInfo>
                            <MovieInfo>{movie.release_date}</MovieInfo>
                        </MovieOverlay>
                    </MovieCard>
                ))}
            </MoviesGrid>
            {loading && <Loading />}
            {showTopButton && (
                <TopButton onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                    Top
                </TopButton>
            )}
        </Container>
    );
};

export default Search;