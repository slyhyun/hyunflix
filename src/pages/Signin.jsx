import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const Signin = () => {
    const [isLoginMode, setIsLoginMode] = useState(true); // 로그인/회원가입 전환 상태
    const [formData, setFormData] = useState({
        loginEmail: '',
        loginPassword: '',
        email: '',
        password: '',
        confirmPassword: '',
        rememberMe: false,
        termsAccepted: false,
    });
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

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
            navigate('/');
            if (formData.rememberMe) {
                localStorage.setItem('loginEmail', formData.loginEmail);
                localStorage.setItem('loginPassword', formData.loginPassword);
            } else {
                localStorage.removeItem('loginEmail');
                localStorage.removeItem('loginPassword');
            }
        } else {
            toast.error('아이디 또는 비밀번호가 잘못되었습니다.');
        }
    };

    useEffect(() => {
        const savedEmail = localStorage.getItem('loginEmail');
        const savedPassword = localStorage.getItem('loginPassword');
        setFormData((prev) => ({
            ...prev,
            loginEmail: savedEmail || '',
            loginPassword: savedPassword || '',
        }));
    }, []);

    return (
        <div className="container">
            <Toaster /> {/* Toast 메시지를 렌더링 */}
            {isLoginMode ? (
                <div className="login-wrapper">
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
                    <button onClick={handleLogin}>로그인</button>
                    <p>
                        회원이 아닌가요?{' '}
                        <span onClick={() => setIsLoginMode(false)}>지금 가입하세요</span>
                    </p>
                </div>
            ) : (
                <div className="signup-wrapper">
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
                    <button onClick={handleSignUp}>회원가입</button>
                    <p>
                        이미 계정이 있으신가요?{' '}
                        <span onClick={() => setIsLoginMode(true)}>로그인</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default Signin;
