# NEIS 학교 급식 조회 웹 앱

React + Vite로 구축한 학교 급식 조회 웹 애플리케이션입니다. NEIS Open API를 활용하여 전국 학교의 중식 급식 정보를 제공합니다.

## 기능

- 🏫 **시도교육청 선택**: 17개 시도교육청 중 선택
- 🔍 **학교 검색**: 입력한 학교명으로 검색 (schoolInfo API)
- 📅 **주간 급식 조회**: 선택한 날짜가 포함된 주의 월요일~금요일 중식 조회
- 📊 **급식 정보 표시**: 체계적인 카드 형태로 급식 내역 표시

## 기술 스택

- **React** 18.2.0
- **Vite** 5.0.0
- **Axios** 1.6.0 (API 통신)
- **CSS3** (반응형 디자인)

## 설치 및 실행

### 필수 요구사항
- Node.js 14.0 이상
- npm 또는 yarn

### 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속합니다.

### 빌드
```bash
npm run build
```

### 프리뷰
```bash
npm run preview
```

## Netlify 배포

### 방법 1: Netlify CLI를 사용한 배포
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### 방법 2: GitHub 저장소 연결
1. GitHub에 저장소 생성
2. 코드 푸시
3. Netlify에 로그인
4. "New site from Git" 클릭
5. GitHub 저장소 선택
6. 빌드 설정:
   - Build command: `npm run build`
   - Publish directory: `dist`

## API 명세

### 학교 검색 (schoolInfo)
```javascript
searchSchools(atptOfcdcScCode, schoolName)
// 반환: [{code: string, name: string}, ...]
```

**예시:**
```javascript
const schools = await searchSchools('B10', '오금중학교');
// 결과: [{code: '7130197', name: '오금중학교'}]
```

### 주간 급식 조회 (mealServiceDietInfo)
```javascript
getWeeklyMealInfo(atptOfcdcScCode, sdSchulCode, baseDate)
// 반환: [{date: string, displayDate: string, meal: string}, ...]
```

**예시:**
```javascript
const meals = await getWeeklyMealInfo('B10', '7130197', new Date('2024-06-27'));
```

## 시도교육청 코드

| 코드 | 교육청명 |
|------|---------|
| B10 | 서울특별시교육청 |
| B20 | 부산광역시교육청 |
| B30 | 대구광역시교육청 |
| B40 | 인천광역시교육청 |
| B50 | 광주광역시교육청 |
| B60 | 대전광역시교육청 |
| B70 | 울산광역시교육청 |
| C10 | 세종특별자치시교육청 |
| C20 | 경기도교육청 |
| C30 | 강원도교육청 |
| D10 | 충청북도교육청 |
| D20 | 충청남도교육청 |
| E10 | 전라북도교육청 |
| E20 | 전라남도교육청 |
| F10 | 경상북도교육청 |
| F20 | 경상남도교육청 |
| G10 | 제주특별자치도교육청 |

## 주의사항

- NEIS API KEY는 환경변수로 관리하는 것이 좋습니다. (현재는 코드에 포함)
- 급식 정보는 학교별로 등록 여부가 다를 수 있습니다.
- 휴일이나 토일은 급식 정보가 없을 수 있습니다.
- API 응답 시간이 걸릴 수 있으므로 로딩 상태를 표시합니다.
- ⚠️ **NEIS Open API 데이터 가용성**: 모든 시도교육청이 NEIS에 등록되어 있지 않습니다.
  - 일부 교육청(예: 대구)은 아직 NEIS에 학교 급식 정보를 등록하지 않았습니다.
  - 데이터가 없는 교육청에서 검색하면 "검색 결과가 없습니다" 메시지가 표시됩니다.
  - 이는 앱의 오류가 아닌 NEIS 데이터베이스 미등록 상태입니다.

## 라이선스

MIT

## 참고 문서

- [NEIS Open API 공식 문서](https://open.neis.go.kr/portal/data/service/selectServicePage.do)
