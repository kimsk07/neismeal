// 테스트용 파일 - Node.js 환경에서 실행
// 사용법: node src/test.js

import axios from 'axios';

const API_KEY = '3aeace82f952472ab2151a44cf0e736b';
const NEIS_BASE_URL = 'https://open.neis.go.kr/hub';

/**
 * 학교 정보 검색
 */
const searchSchools = async (atptOfcdcScCode, schoolName) => {
  try {
    console.log(`\n🔍 학교 검색 중: [${atptOfcdcScCode}] ${schoolName}`);
    
    const response = await axios.get(`${NEIS_BASE_URL}/schoolInfo`, {
      params: {
        KEY: API_KEY,
        TYPE: 'json',
        ATPT_OFCDC_SC_CODE: atptOfcdcScCode,
        SCHUL_NM: schoolName,
      },
    });

    console.log('API 응답 구조:', Object.keys(response.data));
    
    if (response.data && response.data.schoolInfo && response.data.schoolInfo[1]) {
      const rows = response.data.schoolInfo[1].row;
      if (!Array.isArray(rows)) {
        return [];
      }
      
      const results = rows.map((school) => ({
        code: school.SD_SCHUL_CODE,
        name: school.SCHUL_NM,
      }));
      
      console.log(`✅ 검색 결과 (${results.length}개):`, results);
      return results;
    }
    
    console.log('❌ 응답 구조 에러');
    return [];
  } catch (error) {
    console.error('❌ 학교 검색 오류:', error.message);
    throw error;
  }
};

/**
 * 주간 중식 급식 정보 조회
 */
const getWeeklyMealInfo = async (atptOfcdcScCode, sdSchulCode, baseDate) => {
  try {
    console.log(`\n🍱 급식 정보 조회 중: [${atptOfcdcScCode}] ${sdSchulCode}`);
    
    // 기준 날짜가 포함된 주의 월요일 찾기
    const date = new Date(baseDate);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));

    const allMeals = [];

    // 월요일부터 금요일까지 조회
    for (let i = 0; i < 5; i++) {
      const currentDate = new Date(monday);
      currentDate.setDate(currentDate.getDate() + i);

      const mlsvYmd = currentDate.toISOString().slice(0, 10).replace(/-/g, '');

      try {
        console.log(`  조회 날짜: ${mlsvYmd}`);
        
        const response = await axios.get(`${NEIS_BASE_URL}/mealServiceDietInfo`, {
          params: {
            KEY: API_KEY,
            TYPE: 'json',
            ATPT_OFCDC_SC_CODE: atptOfcdcScCode,
            SD_SCHUL_CODE: sdSchulCode,
            MLSV_YMD: mlsvYmd,
            MMEAL_SC_CODE: '2',
          },
        });

        if (response.data && response.data.mealServiceDietInfo && response.data.mealServiceDietInfo[1]) {
          const rows = response.data.mealServiceDietInfo[1].row;
          if (Array.isArray(rows)) {
            rows.forEach((meal) => {
              allMeals.push({
                date: mlsvYmd,
                displayDate: currentDate.toLocaleDateString('ko-KR', { weekday: 'short', month: 'numeric', day: 'numeric' }),
                meal: meal.DDISH_NM || '급식 정보 없음',
              });
            });
            console.log(`    ✅ 급식 정보 발견`);
          }
        } else {
          console.log(`    ℹ️  급식 정보 없음`);
        }
      } catch (error) {
        console.log(`    ℹ️  오류 (무시): ${error.message}`);
      }
    }

    console.log(`✅ 총 ${allMeals.length}개 급식 정보 조회됨`);
    return allMeals;
  } catch (error) {
    console.error('❌ 급식 정보 조회 오류:', error.message);
    throw error;
  }
};

// 테스트 실행
async function runTests() {
  console.log('========================================');
  console.log('🧪 NEIS API 함수 단위 테스트');
  console.log('========================================');

  try {
    // 테스트 1: 학교 검색
    console.log('\n[테스트 1] 학교 검색: 서울(B10) + 오금중학교');
    const schools = await searchSchools('B10', '오금중학교');
    
    const ogumMiddle = schools.find(s => s.code === '7130197' && s.name === '오금중학교');
    if (ogumMiddle) {
      console.log('✅ 테스트 1 PASS: 오금중학교(7130197) 발견됨');
    } else {
      console.log('❌ 테스트 1 FAIL: 오금중학교(7130197)를 찾을 수 없음');
    }

    // 테스트 2: 급식 정보 조회
    if (ogumMiddle) {
      console.log('\n[테스트 2] 급식 정보 조회: 오금중학교');
      const baseDate = new Date(); // 오늘 날짜
      const meals = await getWeeklyMealInfo('B10', '7130197', baseDate);
      
      if (meals && meals.length > 0) {
        console.log('✅ 테스트 2 PASS: 급식 데이터 배열 반환됨');
        console.log('\n급식 정보 샘플:');
        meals.slice(0, 2).forEach(meal => {
          const dishPreview = meal.meal.substring(0, 50) + (meal.meal.length > 50 ? '...' : '');
          console.log(`  - ${meal.displayDate}: ${dishPreview}`);
        });
      } else {
        console.log('❌ 테스트 2 FAIL: 급식 데이터가 반환되지 않음 (또는 해당 주에 급식 없음)');
      }
    }

    console.log('\n========================================');
    console.log('✅ 모든 테스트 완료');
    console.log('========================================\n');
  } catch (error) {
    console.error('\n❌ 테스트 중 오류 발생:', error.message);
    process.exit(1);
  }
}

runTests();
