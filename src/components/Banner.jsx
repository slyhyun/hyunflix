import React, { useState, useEffect } from "react";
import Loading from "./Loading";

const Banner = ({ movies }) => {
    const [selectedMovieIndex, setSelectedMovieIndex] = useState(0);

    // 자동 슬라이더 기능
    useEffect(() => {
        if (movies.length === 0) return;

        const interval = setInterval(() => {
            setSelectedMovieIndex(
                (prevIndex) => (prevIndex + 1) % movies.length
            );
        }, 5000); // 5초 간격

        return () => clearInterval(interval);
    }, [movies]);

    if (movies.length === 0) {
        return <Loading />; // 영화 데이터가 없으면 로딩 컴포넌트 렌더링
    }

    const selectedMovie = movies[selectedMovieIndex];
    const backgroundImage = `https://image.tmdb.org/t/p/w500${selectedMovie?.backdrop_path || ""}`;

    return (
        <div>
            <div>
                <img src={backgroundImage} alt="배경 이미지" />
            </div>
            <div>
                <h2>{selectedMovie?.title || "제목 없음"}</h2>
                <p>{selectedMovie?.overview || "설명이 없습니다."}</p>
                <button>재생</button>
            </div>
        </div>
    );
};

export default Banner;
