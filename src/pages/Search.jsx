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

const FiltersContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 20px;
    position: relative;

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

const SearchHistoryDropdown = styled.ul`
    position: absolute;
    top: 30px;
    left: 5px;
    background-color: #2f2f2f;
    border-radius: 5px;
    width: 90%;
    max-width: 250px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 10;
    padding: 10px 0;
    list-style: none;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

    li {
        padding: 10px 15px;
        color: white;
        cursor: pointer;
        transition: color 0.3s;

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
        grid-template-columns: repeat(3, 1fr);
    }

    @media (min-width: 769px) and (max-width: 1188px) {
        grid-template-columns: repeat(5, 1fr);
    }

    @media (min-width: 1189px) {
        grid-template-columns: repeat(7, 1fr);
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

const Search = () => {
    const [filters, setFilters] = useState({
        genre: "all",
        minRating: "all",
        sortBy: "popularity.desc",
        query: "",
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [wishlist, setWishlist] = useState([]);
    const [showTopButton, setShowTopButton] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const API_KEY = localStorage.getItem("password");

    const fetchFilteredMovies = useCallback(
        async (reset = false) => {
            if (!API_KEY) {
                console.error("API Key가 필요합니다.");
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
                setLoading(false);
            }
        },
        [API_KEY, filters, currentPage] // 정확한 종속성 배열 설정
    );

    const handleScroll = useCallback(() => {
        if (
            window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
            !loading
        ) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
        setShowTopButton(window.scrollY > 300);
    }, [loading]);

    // Filters 변경 시 페이지를 1로 리셋
    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    // 페이지 변경 시 데이터 로드
    useEffect(() => {
        fetchFilteredMovies(currentPage === 1);
    }, [currentPage, fetchFilteredMovies]);

    // 초기 로드 및 스크롤 이벤트 추가
    useEffect(() => {
        const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        setWishlist(storedWishlist);
        const storedHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
        setSearchHistory(storedHistory);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    const handleSearchClick = () => {
        setFilters({ ...filters, query: searchQuery });
        updateSearchHistory(searchQuery);
    };

    const updateSearchHistory = (query) => {
        if (!query) return;

        const updatedHistory = [query, ...searchHistory.filter((item) => item !== query)];

        if (updatedHistory.length > 10) {
            updatedHistory.pop();
        }

        setSearchHistory(updatedHistory);
        localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    };

    const resetFilters = () => {
        setFilters({
            genre: "all",
            minRating: "all",
            sortBy: "popularity.desc",
            query: "",
        });
        setSearchQuery("");
    };

    const toggleWishlist = (movie) => {
        const updatedWishlist = wishlist.some((item) => item.id === movie.id)
            ? wishlist.filter((item) => item.id !== movie.id)
            : [...wishlist, movie];
        setWishlist(updatedWishlist);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    };

    const handleSearchHistoryClick = (query) => {
        setSearchQuery(query);
        setFilters({ ...filters, query });
        setShowDropdown(false);
    };

    return (
        <Container>
            <Header />
            <FiltersContainer>
                <input
                    type="text"
                    placeholder="영화 제목 검색"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setShowDropdown(false)}
                />
                {showDropdown && searchHistory.length > 0 && (
                    <SearchHistoryDropdown>
                        {searchHistory.map((historyItem, index) => (
                            <li
                                key={index}
                                onMouseDown={() => handleSearchHistoryClick(historyItem)}
                            >
                                {historyItem}
                            </li>
                        ))}
                    </SearchHistoryDropdown>
                )}
                <button onClick={handleSearchClick}>검색</button>
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
                {movies.map((movie) => {
                    const isWishlisted = wishlist.some((item) => item.id === movie.id);
                    return (
                        <MovieCard key={movie.id} onClick={() => toggleWishlist(movie)}>
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
                })}
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
