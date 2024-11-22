import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Loading from "./Loading";

const BannerWrapper = styled.div`
    height: 60vh;
    max-width: 95svw;
    background-size: cover;
    background-position: center;
    color: white;
    display: flex;
    align-items: flex-end;
    margin-top: 50px;
`;

const BannerContent = styled.div`
    padding: 50px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    @media screen and (max-height: 768px) {
        padding: 15px;
    }
`;

const BannerTitle = styled.h1`
    font-size: 3rem;
    margin-bottom: 0.5rem;

    @media screen and (max-height: 768px) {
        font-size: 2.5rem;
    }
`;

const BannerDescription = styled.p`
    font-size: 1rem;
    max-width: 500px;
    margin-bottom: 1rem;
    text-align: left;

    @media screen and (max-height: 768px) {
        font-size: 0.9rem;
    }
`;

const Button = styled.button`
    padding: 10px 20px;
    margin-right: 10px;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    background-color: white;
    color: black;
    transition: background-color 0.3s, color 0.3s;

    &:hover {
        background-color: #946efd;
        color: white;
    }
`;

const TitleButton = styled(Button)`
    margin-top: 5px;
    width: 150px;

    @media screen and (max-height: 768px) {
        width: 100px;
        font-size: 0.75rem;
    }
`;

const Banner = ({ movies }) => {
    const [selectedMovieIndex, setSelectedMovieIndex] = useState(0);

    useEffect(() => {
        if (movies.length === 0) return;

        const interval = setInterval(() => {
            setSelectedMovieIndex((prevIndex) => (prevIndex + 1) % movies.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [movies]);

    if (movies.length === 0) {
        return <Loading />;
    }

    const selectedMovie = movies[selectedMovieIndex];
    const backgroundImage = `https://image.tmdb.org/t/p/w500${selectedMovie?.backdrop_path || ""}`;

    return (
        <BannerWrapper style={{ backgroundImage: `url(${backgroundImage})` }}>
            <BannerContent>
                <BannerTitle>{selectedMovie?.title || "제목 없음"}</BannerTitle>
                <BannerDescription>{selectedMovie?.overview || "설명이 없습니다."}</BannerDescription>
                <div>
                    <Button>재생</Button>
                    <Button>정보</Button>
                </div>
                <TitleButton>추가 작업</TitleButton>
            </BannerContent>
        </BannerWrapper>
    );
};

export default Banner;
