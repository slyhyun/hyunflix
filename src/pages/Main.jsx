import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Header from "../components/Header";
import axios from "axios";
import MainSection from "../components/MainSection"; // MainSection 컴포넌트
import MainHeader from "../components/MainHeader";
import Loading from "../components/Loading";

const Main = () => {
    const [movies, setMovies] = useState({
        popular: [],
        nowPlaying: [],
        topRated: [],
        upcoming: [],
    }); // 영화 데이터를 객체 기반 상태로 관리
    const [loading, setLoading] = useState(true); // 로딩 상태 관리

    useEffect(() => {
        const password = localStorage.getItem("password"); // Local Storage에서 비밀번호(TMDB API Key) 가져오기

        if (!password) {
            toast.error("로그인이 필요합니다. 로그인 후 다시 시도해 주세요.");
            return;
        }

        const options = {
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${password}`, // API 키로 인증
            },
        };

        const fetchMovies = async () => {
            try {
                setLoading(true);

                // 4개의 TMDB API 호출
                const [popular, nowPlaying, topRated, upcoming] = await Promise.all([
                    axios.get(
                        "https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1",
                        options
                    ),
                    axios.get(
                        "https://api.themoviedb.org/3/movie/now_playing?language=ko-KR&page=1",
                        options
                    ),
                    axios.get(
                        "https://api.themoviedb.org/3/movie/top_rated?language=ko-KR&page=1",
                        options
                    ),
                    axios.get(
                        "https://api.themoviedb.org/3/movie/upcoming?language=ko-KR&page=1",
                        options
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
                <MainHeader movies={movies.upcoming} title="개봉 예정 영화" />
                <MainSection title="인기 영화" movies={movies.popular} />
                <MainSection title="현재 상영 영화" movies={movies.nowPlaying} />
                <MainSection title="최고 평점 영화" movies={movies.topRated} />
            </Container>
        </>
    );
};

export default Main;