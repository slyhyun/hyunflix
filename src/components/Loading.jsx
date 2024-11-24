import styled, { keyframes } from "styled-components";
import { AiOutlineLoading } from "react-icons/ai";

// 360도 회전 애니메이션 정의
const rotate = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

const Container = styled.div`
    width: 100%;
    height: 100vh;
    background-color: #2f2d2d;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const LoadingIcon = styled(AiOutlineLoading)`
    color: white;
    margin: 0;
    padding: 0;
    width: 100px;
    height: 100px;
    animation: ${rotate} 1s linear infinite; /* 애니메이션 적용 */
`;

const Loading = () => {
    return (
        <Container>
            <LoadingIcon />
        </Container>
    );
};

export default Loading;