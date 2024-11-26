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
    text-align: center;
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

const MovieCard = styled.div`
    flex: 0 0 auto;
    width: 200px; /* 기본 카드 폭 */
    margin-right: 10px;
    position: relative;
    cursor: pointer;
    transition: transform 0.3s;
    max-width: 200px;

    &:hover {
        transform: scale(1.05);
    }

    .wishlist-icon {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 20px;
        display: ${(props) => (props.isWishlisted ? "block" : "none")};
    }

    @media (max-width: 768px) {
        width: 150px; /* 화면 크기가 768px 이하일 때 카드 폭을 150px로 조정 */
        max-width: 150px;
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

const ArrowButton = styled.button`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    color: white;
    border: none;
    padding: 5px;
    cursor: pointer;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.3s;

    &:hover {
        color: #946efd; /* 마우스를 올리면 연보라색으로 변경 */
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const LeftButton = styled(ArrowButton)`
    left: 20px;
`;

const RightButton = styled(ArrowButton)`
    right: 20px;
`;

const Partition = ({ movies, title }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [wishlist, setWishlist] = useState(
        JSON.parse(localStorage.getItem("wishlist")) || []
    );
    const [itemsToShow, setItemsToShow] = useState(7); // 화면에 표시되는 영화 개수 초기값

    const cardWidth = 210; // 카드 폭 (200px + 간격 10px)

    // 화면 크기에 따라 itemsToShow 값을 업데이트
    useEffect(() => {
        const updateItemsToShow = () => {
            if (window.innerWidth < 768) {
                setItemsToShow(3);
            } else if (window.innerWidth < 1188) {
                setItemsToShow(5);
            } else {
                setItemsToShow(7);
            }
        };

        // 초기 설정
        updateItemsToShow();

        // 윈도우 리사이즈 이벤트 리스너 추가
        window.addEventListener("resize", updateItemsToShow);

        // 컴포넌트 언마운트 시 리스너 제거
        return () => {
            window.removeEventListener("resize", updateItemsToShow);
        };
    }, []);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => {
            const maxIndex = Math.ceil(movies.length / itemsToShow) - 1;
            return prevIndex < maxIndex ? prevIndex + 1 : 0;
        });
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => {
            const maxIndex = Math.ceil(movies.length / itemsToShow) - 1;
            return prevIndex > 0 ? prevIndex - 1 : maxIndex;
        });
    };

    const toggleWishlist = (movie) => {
        const exists = wishlist.some((item) => item.id === movie.id);
        const updatedWishlist = exists
            ? wishlist.filter((item) => item.id !== movie.id)
            : [...wishlist, movie];

        setWishlist(updatedWishlist);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    };

    const renderMovies = () => {
        return movies.map((movie) => (
            <MovieCard
                key={movie.id}
                isWishlisted={wishlist.some((item) => item.id === movie.id)}
                onClick={() => toggleWishlist(movie)}
            >
                <MovieImage
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                />
                <MovieOverlay>
                    <MovieTitle>{movie.title}</MovieTitle>
                    <MovieInfo>⭐ {movie.vote_average} / 10</MovieInfo>
                    <MovieInfo>{movie.release_date}</MovieInfo>
                </MovieOverlay>
                <div className="wishlist-icon">⭐</div>
            </MovieCard>
        ));
    };

    return (
        <RowWrapper>
            <RowTitle>{title}</RowTitle>
            <SliderContainer>
                <LeftButton onClick={handlePrev}>
                    <FaChevronLeft size={20} />
                </LeftButton>
                <SliderWindow>
                    <MovieSlider
                        style={{
                            transform: `translateX(-${
                                currentIndex * itemsToShow * cardWidth
                            }px)`,
                        }}
                    >
                        {renderMovies()}
                    </MovieSlider>
                </SliderWindow>
                <RightButton onClick={handleNext}>
                    <FaChevronRight size={20} />
                </RightButton>
            </SliderContainer>
        </RowWrapper>
    );
};

export default Partition;
