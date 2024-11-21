import React, { useState, useEffect } from "react";

const Partition = ({ movies, title }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsToShow, setItemsToShow] = useState(5); // 기본 표시 항목 수 설정
    const [wishlist, setWishlist] = useState(JSON.parse(localStorage.getItem('wishlist')) || []);

    // 창 크기에 따라 표시할 항목 수 조정
    useEffect(() => {
        const updateItemsToShow = () => {
            const width = window.innerWidth;
            if (width >= 1200) setItemsToShow(4);
            else if (width >= 992) setItemsToShow(3);
            else if (width >= 768) setItemsToShow(2);
            else setItemsToShow(1);
        };

        window.addEventListener("resize", updateItemsToShow);
        updateItemsToShow();

        return () => {
            window.removeEventListener("resize", updateItemsToShow);
        };
    }, []);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => {
            const nextIndex = prevIndex + itemsToShow;
            return nextIndex >= movies.length ? 0 : nextIndex;
        });
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => {
            const nextIndex = prevIndex - itemsToShow;
            return nextIndex < 0 ? Math.max(0, movies.length - itemsToShow) : nextIndex;
        });
    };

    const handleAddToWishlist = (movie) => {
        const exists = wishlist.some((item) => item.id === movie.id);
        const updatedWishlist = exists
            ? wishlist.filter((item) => item.id !== movie.id)
            : [...wishlist, movie];
        setWishlist(updatedWishlist);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    };

    // 현재 인덱스 기준으로 영화 목록 렌더링
    const renderMovies = () => {
        const visibleMovies = movies.slice(currentIndex, currentIndex + itemsToShow);
        return visibleMovies.map((movie) => (
            <div key={movie.id} onClick={() => handleAddToWishlist(movie)}>
                <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                />
                <h4>{movie.title}</h4>
                <p>평점: {movie.vote_average} / 10</p>
                {wishlist.some((item) => item.id === movie.id) && <span>★ 즐겨찾기</span>}
            </div>
        ));
    };

    return (
        <div>
            <h2>{title}</h2>
            <div>
                <button onClick={handlePrev}>이전</button>
                <div>{renderMovies()}</div>
                <button onClick={handleNext}>다음</button>
            </div>
        </div>
    );
};

export default Partition;
