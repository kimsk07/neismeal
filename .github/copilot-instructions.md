# NEIS 학교 급식 조회 앱 - 프로젝트 구조 및 배포 가이드

## 프로젝트 완료 내역

### ✅ 구현 완료

#### 1. React + Vite 프로젝트 구조
- **package.json**: React 18.2.0, Vite 5.0.0, Axios 1.6.0 설정
- **vite.config.js**: Vite 빌드 설정
- **index.html**: 진입점
- **src/main.jsx**: React 앱 마운트
- **netlify.toml**: Netlify 배포 설정

#### 2. API 함수 구현 (src/api.js)
- `searchSchools(atptOfcdcScCode, schoolName)`: 학교 검색 API
  - 응답 구조: `mealServiceDietInfo[1].row` 파싱
  - 반환: `[{code: string, name: string}, ...]`
  
- `getWeeklyMealInfo(atptOfcdcScCode, sdSchulCode, baseDate)`: 주간 급식 조회
  - 기준날짜의 주의 월요일~금요일 중식 조회
  - 응답 구조: `mealServiceDietInfo[1].row` 파싱
  - MLSV_YMD 파라미터 사용

#### 3. UI 컴포넌트 (src/App.jsx)
- 시도교육청 선택 드롭다운 (17개 교육청)
- 학교명 입력/검색 필드
- 검색 결과 리스트 표시
- 학교 선택 표시
- 조회 기준일 선택 캘린더
- 조회 버튼
- 주간 급식 카드 레이아웃
- 에러 상태 표시

#### 4. 반응형 스타일 (src/App.css)
- 모바일/태블릿/데스크톱 대응
- 그래디언트 배경
- 카드 기반 레이아웃
- 호버 효과 및 애니메이션

#### 5. 검증 및 테스트 (src/test.js)
- **테스트 1 통과**: 서울(B10) + 오금중학교 검색 → 7130197 발견됨
- **테스트 2 통과**: 오금중학교의 주간 급식 5개 조회됨

### 17개 시도교육청 코드
```
B10: 서울특별시교육청 ✓
B20: 부산광역시교육청
B30: 대구광역시교육청
B40: 인천광역시교육청
B50: 광주광역시교육청
B60: 대전광역시교육청
B70: 울산광역시교육청
C10: 세종특별자치시교육청
C20: 경기도교육청
C30: 강원도교육청
D10: 충청북도교육청
D20: 충청남도교육청
E10: 전라북도교육청
E20: 전라남도교육청
F10: 경상북도교육청
F20: 경상남도교육청
G10: 제주특별자치도교육청
```

## Netlify 배포 방법

### 전제 조건
- Node.js 14.0 이상
- npm 또는 yarn
- GitHub 계정 (GitHub과 연결한 경우)

### 방법 1: GitHub 저장소 연결 (권장)

1. **GitHub에 저장소 생성**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/neismeal.git
   git push -u origin main
   ```

2. **Netlify에 연결**
   - https://app.netlify.com 접속
   - "Add new site" → "Import an existing project"
   - GitHub 연결 승인
   - 저장소 선택
   
3. **빌드 설정**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - 저장 및 배포

### 방법 2: Netlify CLI 사용

1. **Netlify CLI 설치**
   ```bash
   npm install -g netlify-cli
   ```

2. **배포**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

3. **프롬프트에 따라 인증**

### 방법 3: 드래그 앤 드롭

1. `npm run build` 실행
2. Netlify에 로그인
3. `dist` 폴더를 Netlify 배포 영역에 드래그

## 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드된 앱 미리보기
npm run preview

# API 테스트
node src/test.js
```

## API 상세

### NEIS Open API
- **Base URL**: https://open.neis.go.kr/hub
- **API Key**: 3aeace82f952472ab2151a44cf0e736b (in code)
- **Rate Limit**: 일 1000건 (개발용으로 충분)

### schoolInfo API
```
GET /schoolInfo
Params:
  - KEY: API 키
  - TYPE: json
  - ATPT_OFCDC_SC_CODE: 시도교육청 코드
  - SCHUL_NM: 학교명
  
Response: schoolInfo[1].row[]
```

### mealServiceDietInfo API
```
GET /mealServiceDietInfo
Params:
  - KEY: API 키
  - TYPE: json
  - ATPT_OFCDC_SC_CODE: 시도교육청 코드
  - SD_SCHUL_CODE: 학교 행정표준코드
  - MLSV_YMD: 조회 날짜 (YYYYMMDD)
  - MMEAL_SC_CODE: 2 (중식)

Response: mealServiceDietInfo[1].row[]
```

## 알려진 제한사항

1. **CORS 정책**: NEIS API는 CORS를 지원하므로 브라우저에서 직접 호출 가능
2. **급식 정보 가용성**: 모든 학교가 급식 정보를 제공하지는 않음
3. **API Rate Limit**: 일 1000건 제한
4. **휴일 급식 없음**: 토일/휴일 급식 정보는 없을 수 있음

## 보안 권장사항

- **API Key 환경변수화**: 프로덕션에서는 API Key를 `.env` 파일로 관리
- **Backend 프록시**: CORS 이슈나 Rate Limit 우회를 위해 Backend 프록시 구성 권장

## 폴더 구조

```
neismeal/
├── src/
│   ├── api.js              # API 함수
│   ├── App.jsx             # 메인 컴포넌트
│   ├── App.css             # 스타일
│   ├── main.jsx            # 진입점
│   ├── index.css           # 전역 스타일
│   └── test.js             # 테스트 파일
├── dist/                   # 빌드 출력 (배포용)
├── node_modules/
├── package.json
├── vite.config.js
├── netlify.toml            # Netlify 배포 설정
├── index.html              # HTML 템플릿
├── README.md
├── .gitignore
└── .github/
    └── copilot-instructions.md (이 파일)
```

## 다음 단계

1. ✅ GitHub 저장소에 푸시
2. ✅ Netlify에 연결
3. ✅ 자동 배포 확인
4. (선택) 환경변수로 API Key 관리
5. (선택) Backend 프록시 구성

## 참고

- [NEIS Open API 공식 문서](https://open.neis.go.kr/portal/data/service/selectServicePage.do)
- [Netlify 배포 가이드](https://docs.netlify.com/get-started/build-and-deploy/)
- [Vite 공식 문서](https://vitejs.dev/)
