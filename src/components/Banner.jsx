import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Loading from "./Loading";

const BannerWrapper = styled.div`
    height: 60vh;
    width: 100%;
    overflow: hidden;
    position: relative;
    margin-top: 50px;
`;

const BannerSlider = styled.div`
    display: flex;
    transition: transform 0.5s ease-in-out;
    width: 100%;
`;

const BannerItem = styled.div`
    flex: 0 0 100%;
    height: 60vh;
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: flex-end;
    position: relative;
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

    color: white; /* 텍스트를 항상 흰색으로 설정 */
`;

const BannerTitle = styled.h1`
    font-size: 3rem;
    margin-bottom: 0.5rem;

    @media screen and (max-height: 768px) {
        font-size: 2.5rem;
    }

    color: white; /* 제목 색상 흰색으로 설정 */
`;

const BannerDescription = styled.p`
    font-size: 1rem;
    max-width: 500px;
    margin-bottom: 1rem;
    text-align: left;

    @media screen and (max-height: 768px) {
        font-size: 0.9rem;
    }

    color: white; /* 설명 색상 흰색으로 설정 */
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

const ArrowButton = styled.button`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    color: white; /* 화살표 색상 흰색 */
    border: none;
    padding: 10px;
    cursor: pointer;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.3s;

    &:hover {
        color: #946efd; /* 마우스 올리면 연보라색 */
    }
`;

const LeftArrow = styled(ArrowButton)`
    left: 20px;
`;

const RightArrow = styled(ArrowButton)`
    right: 20px;
`;

const Banner = ({ movies }) => {
    const [selectedMovieIndex, setSelectedMovieIndex] = useState(0);

    const handleNext = useCallback(() => {
        setSelectedMovieIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, [movies.length]);

    useEffect(() => {
        if (movies.length === 0) return;

        const interval = setInterval(() => {
            handleNext();
        }, 5000);

        return () => clearInterval(interval);
    }, [movies, handleNext]);

    const handlePrev = () => {
        setSelectedMovieIndex((prevIndex) =>
            prevIndex === 0 ? movies.length - 1 : prevIndex - 1
        );
    };

    if (movies.length === 0) {
        return <Loading />;
    }

    return (
        <BannerWrapper>
            <LeftArrow onClick={handlePrev}>
                <FaChevronLeft size={20} />
            </LeftArrow>
            <BannerSlider
                style={{
                    transform: `translateX(-${selectedMovieIndex * 100}%)`,
                }}
            >
                {movies.map((movie, index) => (
                    <BannerItem
                        key={index}
                        style={{
                            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie?.backdrop_path || ""})`,
                        }}
                    >
                        <BannerContent>
                            <BannerTitle>{movie?.title || "제목 없음"}</BannerTitle>
                            <BannerDescription>{movie?.overview || "설명이 없습니다."}</BannerDescription>
                            <div>
                                <Button>재생</Button>
                                <Button>자세히</Button>
                            </div>
                        </BannerContent>
                    </BannerItem>
                ))}
            </BannerSlider>
            <RightArrow onClick={handleNext}>
                <FaChevronRight size={20} />
            </RightArrow>
        </BannerWrapper>
    );
};

export default Banner;
