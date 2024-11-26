import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import styled, { css } from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0d1117;
  overflow: hidden;
`;

const Container = styled.div`
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
  position: relative;
  width: 768px;
  min-height: 480px;
  overflow: hidden;
  background: #161b22;
  ${({ isSignUp }) =>
    isSignUp &&
    css`
      .sign-in-container {
        transform: translateX(100%);
        opacity: 0;
      }
      .sign-up-container {
        transform: translateX(100%);
        opacity: 1;
        z-index: 2;
      }
    `}
`;

const FormContainer = styled.div`
  position: absolute;
  width: 50%;
  height: 100%;
  transition: all 0.5s;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  z-index: ${({ isVisible }) => (isVisible ? 2 : 1)};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 50px;
  height: 100%;

  input[type='text'],
  input[type='email'],
  input[type='password'] {
    background: #21262d;
    color: #c9d1d9;
    padding: 16px;
    margin: 8px 0;
    width: 85%;
    border: 0;
    outline: none;
    border-radius: 20px;
    box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.4),
      inset -2px -2px 5px rgba(255, 255, 255, 0.1);
  }

  input[type='checkbox'] {
    margin-right: 8px;
    width: 16px;
    height: 16px;
    border: 1px solid #ccc;
    appearance: none;
    outline: none;
    cursor: pointer;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 0px;
      left: 4px;
      width: 5px;
      height: 10px;
      border: solid #ccc;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
      display: none;
    }

    &:checked::after {
      display: block;
    }
  }

  label {
    color: #ffffff; /* 체크박스 문구 흰색 */
    display: flex;
    align-items: center;
  }

button {
  border-radius: 20px;
  border: none;
  font-size: 12px;
  font-weight: bold;
  padding: 15px 45px;
  margin: 14px;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 150ms ease-in-out, transform 80ms ease-in;
  background: #946efd;
  color: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);

  &:hover {
    background: #7d5ed5; /* 호버 시 살짝 어두워지는 효과 */
  }

  &:active {
    box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.4),
      inset -2px -2px 5px rgba(255, 255, 255, 0.1);
  }
}

  h2 {
    margin: 0 0 20px;
    color: #c9d1d9;
    font-weight: bold;
  }

  p {
    font-size: 16px;
    font-weight: bold;
    margin: 20px 0 30px;
    color: #c9d1d9;

    span {
      cursor: pointer;
      color: #946efd;
      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  background-color: #946efd;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: transform 0.5s ease-in-out;

  ${({ isLoginMode }) =>
    isLoginMode
      ? css`
          transform: translateX(0);
        `
      : css`
          transform: translateX(-100%);
        `}
`;

const OverlayText = styled.div`
  text-align: center;

  h2 {
    font-size: 24px;
    margin-bottom: 10px;
  }

  p {
    margin: 0 0 20px;
    font-size: 16px;
  }

  button {
    border-radius: 20px;
    border: none;
    font-size: 12px;
    font-weight: bold;
    padding: 15px 45px;
    margin: 14px;
    letter-spacing: 1px;
    text-transform: uppercase;
    cursor: pointer;
    transition: background-color 150ms ease-in-out, transform 80ms ease-in;
    background: #161b22; /* 박스 디자인 적용 */
    color: white;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);

    &:hover {
      background: #292d36; /* 버튼 호버 효과 */
    }

    &:active {
      box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.4),
        inset -2px -2px 5px rgba(255, 255, 255, 0.1);
    }
  }
`;

const Signin = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    loginEmail: '',
    loginPassword: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
    isLogin: false,
    termsAccepted: false,
  });
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSignUp = () => {
    if (!validateEmail(formData.email)) {
      toast.error('이메일 주소가 유효하지 않습니다.');
      return;
    }
    if (!formData.password) {
      toast.error('비밀번호를 입력하지 않았습니다.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!formData.termsAccepted) {
      toast.error('약관에 동의하지 않았습니다.');
      return;
    }
    localStorage.setItem('username', formData.email);
    localStorage.setItem('password', formData.password);
    toast.success('회원가입이 완료되었습니다.');
    setIsLoginMode(true);
  };

  const handleLogin = () => {
    const storedEmail = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    if (formData.loginEmail === storedEmail && formData.loginPassword === storedPassword) {
        toast.success('로그인 성공!');
        localStorage.setItem('isLogin', 'true'); // 로그인 성공 시 isLogin을 true로 설정
        if (formData.rememberMe) {
            localStorage.setItem('loginEmail', formData.loginEmail);
            localStorage.setItem('loginPassword', formData.loginPassword);
            localStorage.setItem('rememberMe', 'true');
        } else {
            localStorage.removeItem('loginEmail');
            localStorage.removeItem('loginPassword');
            localStorage.removeItem('rememberMe');
        }
        navigate('/');
    } else {
        toast.error('아이디 또는 비밀번호가 잘못되었습니다.');
    }
};


  useEffect(() => {
    const savedEmail = localStorage.getItem('loginEmail');
    const savedPassword = localStorage.getItem('loginPassword');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';

    setFormData((prev) => ({
      ...prev,
      loginEmail: savedEmail || '',
      loginPassword: savedPassword || '',
      rememberMe: savedRememberMe,
    }));
  }, []);

  return (
    <Wrapper>
      <Toaster />
      <Container isSignUp={!isLoginMode}>
        <FormContainer className="sign-in-container" isVisible={isLoginMode}>
          <Form>
            <h2>로그인</h2>
            <input
              type="email"
              name="loginEmail"
              placeholder="이메일을 입력해주세요"
              value={formData.loginEmail}
              onChange={handleChange}
            />
            <input
              type="password"
              name="loginPassword"
              placeholder="비밀번호를 입력해주세요"
              value={formData.loginPassword}
              onChange={handleChange}
            />
            <label>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              로그인 정보 저장
            </label>
            <button type="button" onClick={handleLogin}>
              로그인
            </button>
          </Form>
        </FormContainer>

        <FormContainer className="sign-up-container" isVisible={!isLoginMode}>
          <Form>
            <h2>회원가입</h2>
            <input
              type="email"
              name="email"
              placeholder="이메일을 입력해주세요"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="비밀번호를 입력해주세요"
              value={formData.password}
              onChange={handleChange}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="비밀번호를 재입력해주세요"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <label>
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
              />
              약관에 동의합니다
            </label>
            <button type="button" onClick={handleSignUp}>
              회원가입
            </button>
          </Form>
        </FormContainer>

        <OverlayContainer isLoginMode={isLoginMode}>
          {isLoginMode ? (
            <OverlayText>
              <h2>안녕하세요!</h2>
              <p>회원가입 후 다양한 서비스를 이용해보세요.</p>
              <button onClick={() => setIsLoginMode(false)}>회원가입</button>
            </OverlayText>
          ) : (
            <OverlayText>
              <h2>환영합니다!</h2>
              <p>기존 계정으로 다시 로그인하세요.</p>
              <button onClick={() => setIsLoginMode(true)}>로그인</button>
            </OverlayText>
          )}
        </OverlayContainer>
      </Container>
    </Wrapper>
  );
};

export default Signin;
