import axios from 'axios';

const API_KEY = '3aeace82f952472ab2151a44cf0e736b';
const NEIS_BASE_URL = 'https://open.neis.go.kr/hub';

// 17개 시도교육청 정보
export const EDUCATION_OFFICES = [
  { code: 'B10', name: '서울특별시교육청' },
  { code: 'B20', name: '부산광역시교육청' },
  { code: 'B30', name: '대구광역시교육청' },
  { code: 'B40', name: '인천광역시교육청' },
  { code: 'B50', name: '광주광역시교육청' },
  { code: 'B60', name: '대전광역시교육청' },
  { code: 'B70', name: '울산광역시교육청' },
  { code: 'C10', name: '세종특별자치시교육청' },
  { code: 'C20', name: '경기도교육청' },
  { code: 'C30', name: '강원도교육청' },
  { code: 'D10', name: '충청북도교육청' },
  { code: 'D20', name: '충청남도교육청' },
  { code: 'E10', name: '전라북도교육청' },
  { code: 'E20', name: '전라남도교육청' },
  { code: 'F10', name: '경상북도교육청' },
  { code: 'F20', name: '경상남도교육청' },
  { code: 'G10', name: '제주특별자치도교육청' },
];

/**
 * 학교 정보 검색
 * @param {string} atptOfcdcScCode - 시도교육청 코드
 * @param {string} schoolName - 학교명 (검색어)
 * @returns {Promise<Array>} 학교 정보 배열 [{code: string, name: string}, ...]
 */
export const searchSchools = async (atptOfcdcScCode, schoolName) => {
  try {
    const response = await axios.get(`${NEIS_BASE_URL}/schoolInfo`, {
      params: {
        KEY: API_KEY,
        TYPE: 'json',
        ATPT_OFCDC_SC_CODE: atptOfcdcScCode,
        SCHUL_NM: schoolName,
      },
    });

    // 데이터가 없을 경우 RESULT 응답
    if (response.data && response.data.RESULT) {
      console.log('NEIS API 메시지:', response.data.RESULT.MESSAGE);
      return [];
    }

    // 응답 구조: response.data.schoolInfo[1].row
    if (response.data && response.data.schoolInfo && response.data.schoolInfo[1]) {
      let rows = response.data.schoolInfo[1].row;
      
      // 단일 결과인 경우 객체, 복수 결과인 경우 배열로 반환됨
      if (!rows) {
        return [];
      }
      
      // 단일 객체를 배열로 변환
      if (!Array.isArray(rows)) {
        rows = [rows];
      }
      
      return rows.map((school) => ({
        code: school.SD_SCHUL_CODE,
        name: school.SCHUL_NM,
      }));
    }
    return [];
  } catch (error) {
    console.error('학교 검색 오류:', error);
    throw error;
  }
};

/**
 * 주간 중식 급식 정보 조회
 * @param {string} atptOfcdcScCode - 시도교육청 코드
 * @param {string} sdSchulCode - 학교 행정표준코드
 * @param {Date} baseDate - 기준 날짜
 * @returns {Promise<Array>} 월요일~금요일 급식 배열
 */
export const getWeeklyMealInfo = async (atptOfcdcScCode, sdSchulCode, baseDate) => {
  try {
    // 기준 날짜가 포함된 주의 월요일 찾기
    const date = new Date(baseDate);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // 월요일 날짜
    const monday = new Date(date.setDate(diff));

    const allMeals = [];

    // 월요일부터 금요일까지 조회
    for (let i = 0; i < 5; i++) {
      const currentDate = new Date(monday);
      currentDate.setDate(currentDate.getDate() + i);

      // MLSV_YMD 형식: YYYYMMDD
      const mlsvYmd = currentDate.toISOString().slice(0, 10).replace(/-/g, '');

      try {
        const response = await axios.get(`${NEIS_BASE_URL}/mealServiceDietInfo`, {
          params: {
            KEY: API_KEY,
            TYPE: 'json',
            ATPT_OFCDC_SC_CODE: atptOfcdcScCode,
            SD_SCHUL_CODE: sdSchulCode,
            MLSV_YMD: mlsvYmd,
            MMEAL_SC_CODE: '2', // 2 = 중식
          },
        });

        // 응답 구조: response.data.mealServiceDietInfo[1].row
        if (response.data && response.data.mealServiceDietInfo && response.data.mealServiceDietInfo[1]) {
          let rows = response.data.mealServiceDietInfo[1].row;
          
          // 단일 결과인 경우 객체, 복수 결과인 경우 배열로 반환됨
          if (rows) {
            // 단일 객체를 배열로 변환
            if (!Array.isArray(rows)) {
              rows = [rows];
            }
            
            rows.forEach((meal) => {
              allMeals.push({
                date: mlsvYmd,
                displayDate: currentDate.toLocaleDateString('ko-KR', { weekday: 'short', month: 'numeric', day: 'numeric' }),
                meal: meal.DDISH_NM || '급식 정보 없음',
              });
            });
          }
        }
      } catch (error) {
        // 해당 날짜의 급식이 없을 수 있으므로 계속 진행
        console.log(`${mlsvYmd}에 급식 정보가 없습니다.`);
      }
    }

    return allMeals;
  } catch (error) {
    console.error('급식 정보 조회 오류:', error);
    throw error;
  }
};
