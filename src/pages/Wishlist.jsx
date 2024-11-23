import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import styled from "styled-components";
import Header from "../components/Header";

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

const MoviesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 20px;
    justify-items: center;
    margin-bottom: 20px;
`;

const MovieCard = styled.div`
    position: relative;
    width: 200px;
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

const Wishlist = () => {
    const [state, setState] = useState({
        wishlist: [],
        filteredMovies: [],
        searchTerm: "",
        recentSearches: [],
        itemsPerPage: 20,
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        const storedSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];

        setState((prev) => ({
            ...prev,
            wishlist: storedWishlist,
            filteredMovies: storedWishlist.slice(0, prev.itemsPerPage),
            recentSearches: storedSearches.slice(0, 3),
        }));
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
                !loading &&
                state.filteredMovies.length < state.wishlist.length
            ) {
                loadMoreMovies();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [state.filteredMovies, state.wishlist, loading]);

    const loadMoreMovies = () => {
        setLoading(true);
        setTimeout(() => {
            setState((prev) => ({
                ...prev,
                filteredMovies: [
                    ...prev.filteredMovies,
                    ...prev.wishlist.slice(
                        prev.filteredMovies.length,
                        prev.filteredMovies.length + prev.itemsPerPage
                    ),
                ],
            }));
            setLoading(false);
        }, 500);
    };

    const handleRemoveFromWishlist = (movieId) => {
        const updatedWishlist = state.wishlist.filter((movie) => movie.id !== movieId);
        setState((prev) => ({
            ...prev,
            wishlist: updatedWishlist,
            filteredMovies: updatedWishlist.slice(0, prev.filteredMovies.length),
        }));
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        toast.success("영화를 위시리스트에서 제거했습니다.");
    };

    const handleSearch = () => {
        const { wishlist, searchTerm, recentSearches } = state;
        if (!searchTerm.trim()) {
            toast.error("검색어를 입력하세요.");
            return;
        }

        const filtered = wishlist.filter((movie) =>
            movie.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setState((prev) => ({
            ...prev,
            filteredMovies: filtered.slice(0, prev.itemsPerPage),
            searchTerm: searchTerm.trim(),
        }));

        if (!recentSearches.includes(searchTerm)) {
            const updatedSearches = [searchTerm, ...recentSearches.slice(0, 2)];
            setState((prev) => ({ ...prev, recentSearches: updatedSearches }));
            localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
        }
    };

    const handleRecentSearchClick = (term) => {
        setState((prev) => ({ ...prev, searchTerm: term }));
        handleSearch();
    };

    const handleRemoveRecentSearch = (term) => {
        const updatedSearches = state.recentSearches.filter((item) => item !== term);
        setState((prev) => ({ ...prev, recentSearches: updatedSearches }));
        localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    };

    return (
        <Container>
            <Toaster />
            <Header />
            <div>
                <input
                    type="text"
                    placeholder="영화 제목 검색"
                    value={state.searchTerm}
                    onChange={(e) =>
                        setState((prev) => ({ ...prev, searchTerm: e.target.value }))
                    }
                />
                <button onClick={handleSearch}>검색</button>
                <div>
                    {state.recentSearches.map((term, index) => (
                        <div key={index}>
                            <span onClick={() => handleRecentSearchClick(term)}>{term}</span>
                            <button onClick={() => handleRemoveRecentSearch(term)}>X</button>
                        </div>
                    ))}
                </div>
            </div>
            <MoviesGrid>
                {state.filteredMovies.map((movie) => (
                    <MovieCard key={movie.id} onClick={() => handleRemoveFromWishlist(movie.id)}>
                        <MovieImage
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                        />
                        <MovieOverlay>
                            <MovieTitle>{movie.title}</MovieTitle>
                            <MovieInfo>⭐ {movie.vote_average} / 10</MovieInfo>
                            <MovieInfo>{movie.release_date}</MovieInfo>
                        </MovieOverlay>
                    </MovieCard>
                ))}
            </MoviesGrid>
            {loading && <p>로딩 중...</p>}
        </Container>
    );
};

export default Wishlist;
