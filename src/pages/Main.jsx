import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Header from "../components/Header";
import axios from "axios";
import Banner from "../components/Banner"; // Banner 컴포넌트
import Partition from "../components/Partition"; // Partition 컴포넌트
import Loading from "../components/Loading";
import styled from "styled-components";

const Container = styled.div`
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
`;

const Main = () => {
    const [movies, setMovies] = useState({
        popular: [],
        nowPlaying: [],
        topRated: [],
        upcoming: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const password = localStorage.getItem("password"); // Local Storage에서 비밀번호(API 키) 가져오기

        if (!password) {
            toast.error("로그인이 필요합니다. 로그인 후 다시 시도해 주세요.");
            return;
        }

        const fetchMovies = async () => {
            try {
                setLoading(true);

                // 4개의 TMDB API 호출
                const [popular, nowPlaying, topRated, upcoming] = await Promise.all([
                    axios.get(
                        `https://api.themoviedb.org/3/movie/popular?api_key=${password}&language=ko-KR&page=1`
                    ),
                    axios.get(
                        `https://api.themoviedb.org/3/movie/now_playing?api_key=${password}&language=ko-KR&page=1`
                    ),
                    axios.get(
                        `https://api.themoviedb.org/3/movie/top_rated?api_key=${password}&language=ko-KR&page=1`
                    ),
                    axios.get(
                        `https://api.themoviedb.org/3/movie/upcoming?api_key=${password}&language=ko-KR&page=1`
                    ),
                ]);

                // 상태 업데이트
                setMovies({
                    popular: popular.data.results,
                    nowPlaying: nowPlaying.data.results,
                    topRated: topRated.data.results,
                    upcoming: upcoming.data.results,
                });

                setLoading(false);
                toast.success("영화 데이터를 성공적으로 불러왔습니다!");
            } catch (err) {
                console.error(err);
                toast.error("영화 데이터를 불러오는 중 오류가 발생했습니다.");
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <Toaster /> {/* Toast 메시지를 렌더링 */}
            <Header />
            <Container>
                <Banner movies={movies.upcoming} title="개봉 예정 영화" /> {/* Banner 컴포넌트 */}
                <Partition title="인기 영화" movies={movies.popular} /> {/* Partition 컴포넌트 */}
                <Partition title="현재 상영 영화" movies={movies.nowPlaying} /> {/* Partition 컴포넌트 */}
                <Partition title="최고 평점 영화" movies={movies.topRated} /> {/* Partition 컴포넌트 */}
            </Container>
        </>
    );
};

export default Main;
