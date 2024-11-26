# hyunflix

영화 정보를 제공하는 웹 애플리케이션입니다. React를 사용하여 제작했습니다.

## 📋 프로젝트 기본 정보

- **프로젝트명**: hyunflix
- **목적**: React를 사용하여 넷플릭스와 비슷한 영화 정보를 제공하는 웹 애플리케이션 개발
- **주요 기능**:
  - 로그인 및 회원가입 기능
  - 인기 영화 목록 제공 기능
  - 검색 및 필터링 기능
  - 위시리스트 기능
  
## 🛠 기술 스택

- **프론트엔드**: React, JavaScript, CSS-in-JS (styled-components)
- **상태 관리**: React Hooks
- **라우팅**: React Router
- **API**: [TMDB API](https://www.themoviedb.org/documentation/api)
- **유저 관리**: LocalStorage
- **기타**: Axios (HTTP 요청)

## 🚀 설치 및 실행 가이드

프로젝트를 로컬 환경에서 실행하려면 다음 단계를 따르세요.

```bash
### 1. 프로젝트 클론
git clone https://github.com/slyhyun/hyunflix.git

### 2. 패키지 설치
npm install

### 3. 애플리케이션 실행
npm start

기본적으로 <http://localhost:3000>에서 실행됩니다

### 4. 회원가입

회원가입 시 비밀번호는 본인 **TMDB** API키로 사용해야합니다

### 5. 빌드 및 배포
npm run build

```

## 📂 프로젝트 주요구조 설명
```bash
hyunflix/
├── src
│   ├── approutes
│   │   └── AppRoutes.jsx          # 애플리케이션 라우트 설정
│   ├── components
│   │   ├── Banner.jsx             # 배너 컴포넌트
│   │   ├── Header.jsx             # 헤더 컴포넌트
│   │   ├── Loading.jsx            # 로딩 컴포넌트
│   │   ├── Menu.jsx               # 메뉴 컴포넌트
│   │   └── Partition.jsx          # 파티션 컴포넌트
│   ├── img                        # 이미지 파일
│   └── pages
│       ├── Main                   # 메인 페이지
│       ├── Popular                # 인기 콘텐츠 페이지
│       ├── Search                 # 콘텐츠 검색 페이지
│       ├── Signin                 # 로그인 페이지
│       └── Wishlist               # 위시리스트 페이지  
│── App.js                         # 메인 컴포넌트 및 라우팅
│── index.js                       
└── README.md                      # 프로젝트 설명 파일
```
