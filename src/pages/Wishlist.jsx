import React, { useEffect, useState } from "react";
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
    padding-top: 100px;
    padding-bottom: 100px;
    min-height: 80vh;
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

const WishlistIndicator = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 20px;
    color: gold;
`;

const Wishlist = () => {
    const [state, setState] = useState({
        wishlist: [],
        filteredMovies: [],
        itemsPerPage: 20,
    });

    useEffect(() => {
        const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        setState((prev) => ({
            ...prev,
            wishlist: storedWishlist,
            filteredMovies: storedWishlist.slice(0, prev.itemsPerPage),
        }));
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
                state.filteredMovies.length < state.wishlist.length
            ) {
                loadMoreMovies();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [state.filteredMovies, state.wishlist]);

    const loadMoreMovies = () => {
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
    };

    const handleRemoveFromWishlist = (movieId) => {
        const updatedWishlist = state.wishlist.filter((movie) => movie.id !== movieId);
        setState((prev) => ({
            ...prev,
            wishlist: updatedWishlist,
            filteredMovies: updatedWishlist.slice(0, prev.filteredMovies.length),
        }));
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    };

    return (
        <Container>
            <Header />
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
                        <WishlistIndicator>⭐</WishlistIndicator>
                    </MovieCard>
                ))}
            </MoviesGrid>
        </Container>
    );
};

export default Wishlist;
