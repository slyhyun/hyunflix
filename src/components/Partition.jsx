import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const RowWrapper = styled.div`
    margin-bottom: 40px;
    position: relative;
    width: 100%;
    overflow: hidden;
`;

const RowTitle = styled.h2`
    text-align: left;
    margin-left: 30px;
    color: white;
`;

const SliderContainer = styled.div`
    position: relative;
    touch-action: pan-y;
`;

const SliderWindow = styled.div`
    overflow: hidden;
    margin: 0 60px; /* 좌우 공백 */
`;

const MovieSlider = styled.div`
    display: flex;
    transition: transform 0.5s ease-in-out;
    padding: 20px 0;
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
`;

const MovieCard = styled.div`
    flex: 0 0 auto;
    width: 200px;
    margin-right: 10px;
    position: relative;
    cursor: pointer;
    transition: transform 0.3s;

    &:hover {
        transform: scale(1.05);
    }

    &:hover ${MovieOverlay} {
        opacity: 1;
    }
`;

const MovieImage = styled.img`
    width: 100%;
    height: auto;
    border-radius: 4px;
`;

const MovieTitle = styled.h4`
    font-size: 16px;
    margin: 0;
`;

const MovieInfo = styled.p`
    font-size: 14px;
    margin: 5px 0 0;
`;

const SliderButton = styled.button`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 15px;
    cursor: pointer;
    z-index: 10;
    transition: opacity 0.3s, background-color 0.3s;

    &:hover {
        background-color: rgba(0, 0, 0, 0.8);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const LeftButton = styled(SliderButton)`
    left: 0;
`;

const RightButton = styled(SliderButton)`
    right: 0;
`;

const Partition = ({ movies, title }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsToShow = 5; // 화면에 표시되는 영화 개수
    const cardWidth = 210; // 카드 폭 (200px + 간격 10px)

    const handleNext = () => {
        setCurrentIndex((prevIndex) => {
            const maxIndex = Math.ceil(movies.length / itemsToShow) - 1; // 최대 이동 가능 인덱스 계산
            return prevIndex < maxIndex ? prevIndex + 1 : 0; // 마지막 슬라이드 후 다시 처음으로
        });
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => {
            const maxIndex = Math.ceil(movies.length / itemsToShow) - 1;
            return prevIndex > 0 ? prevIndex - 1 : maxIndex; // 첫 번째 슬라이드에서 마지막으로 이동
        });
    };

    const renderMovies = () => {
        return movies.map((movie) => (
            <MovieCard key={movie.id}>
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
        ));
    };

    return (
        <RowWrapper>
            <RowTitle>{title}</RowTitle>
            <SliderContainer>
                <LeftButton onClick={handlePrev}>
                    <FaChevronLeft />
                </LeftButton>
                <SliderWindow>
                    <MovieSlider
                        style={{
                            transform: `translateX(-${currentIndex * itemsToShow * cardWidth}px)`, // 이동량 계산
                        }}
                    >
                        {renderMovies()}
                    </MovieSlider>
                </SliderWindow>
                <RightButton onClick={handleNext}>
                    <FaChevronRight />
                </RightButton>
            </SliderContainer>
        </RowWrapper>
    );
};

export default Partition;
