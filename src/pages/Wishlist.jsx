import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Header from "../components/Header";

const Wishlist = () => {
    const [state, setState] = useState({
        wishlist: [],
        filteredMovies: [],
        searchTerm: "",
        recentSearches: [],
        currentPage: 1,
        itemsPerPage: 10,
    });

    useEffect(() => {
        const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        const storedSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
        
        updateItemsPerPage();
        
        setState((prev) => ({
            ...prev,
            wishlist: storedWishlist,
            filteredMovies: storedWishlist,
            recentSearches: storedSearches.slice(0, 3),
        }));
        
        window.addEventListener("resize", updateItemsPerPage);
        return () => window.removeEventListener("resize", updateItemsPerPage);
    }, []);

    const updateItemsPerPage = () => {
        const width = window.innerWidth;
        let itemsPerPage = 10;
        if (width <= 768) itemsPerPage = width > 650 ? 12 : 16;
        setState((prev) => ({ ...prev, itemsPerPage }));
    };

    const handleRemoveFromWishlist = (movieId) => {
        const updatedWishlist = state.wishlist.filter((movie) => movie.id !== movieId);
        setState((prev) => ({
            ...prev,
            wishlist: updatedWishlist,
            filteredMovies: updatedWishlist,
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
            filteredMovies: filtered,
            currentPage: 1,
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

    const currentMovies = state.filteredMovies.slice(
        (state.currentPage - 1) * state.itemsPerPage,
        state.currentPage * state.itemsPerPage
    );
    const totalPages = Math.ceil(state.filteredMovies.length / state.itemsPerPage);

    const handleNextPage = () => {
        if (state.currentPage < totalPages) {
            setState((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }));
        }
    };

    const handlePreviousPage = () => {
        if (state.currentPage > 1) {
            setState((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }));
        }
    };

    return (
        <>
            <Toaster />
            <Header />
            <section>
                <div className="filter-container">
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
                    </div>
                    <div>
                        {state.recentSearches.map((term, index) => (
                            <div key={index}>
                                <span onClick={() => handleRecentSearchClick(term)}>{term}</span>
                                <button onClick={() => handleRemoveRecentSearch(term)}>X</button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="movies-container">
                    {currentMovies.map((movie) => (
                        <div key={movie.id}>
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                            />
                            <h3>{movie.title}</h3>
                            <button onClick={() => handleRemoveFromWishlist(movie.id)}>제거</button>
                        </div>
                    ))}
                </div>
                <div className="pagination">
                    <button onClick={handlePreviousPage} disabled={state.currentPage === 1}>
                        이전
                    </button>
                    <span>
                        {state.currentPage} / {totalPages}
                    </span>
                    <button onClick={handleNextPage} disabled={state.currentPage === totalPages}>
                        다음
                    </button>
                </div>
            </section>
        </>
    );
};

export default Wishlist;
