import axios from 'axios';

const API_KEY = '3aeace82f952472ab2151a44cf0e736b';
const NEIS_BASE_URL = 'https://open.neis.go.kr/hub';

async function debugDaeguAPI() {
  try {
    console.log('\n🔍 대구교육청(B30) API 디버깅');
    console.log('========================================\n');
    
    // 테스트 1: 공백 검색
    console.log('[테스트 1] 검색어 없음 (빈 문자열)');
    try {
      const res1 = await axios.get(`${NEIS_BASE_URL}/schoolInfo`, {
        params: {
          KEY: API_KEY,
          TYPE: 'json',
          ATPT_OFCDC_SC_CODE: 'B30',
          SCHUL_NM: '',
        },
      });
      console.log('상태:', res1.status);
      console.log('응답 데이터 키:', Object.keys(res1.data));
      if (res1.data.schoolInfo) {
        console.log('schoolInfo 구조:', res1.data.schoolInfo.length > 0 ? '배열' : 'undefined');
        if (res1.data.schoolInfo[1]) {
          const row = res1.data.schoolInfo[1].row;
          console.log('row 타입:', Array.isArray(row) ? `배열 (${row.length}개)` : typeof row);
          if (Array.isArray(row)) {
            console.log('첫 3개:', row.slice(0, 3).map(s => `${s.SCHUL_NM} (${s.SD_SCHUL_CODE})`));
          }
        }
      }
    } catch (e) {
      console.log('❌ 오류:', e.response?.status, e.message);
    }
    
    // 테스트 2: "학교" 검색
    console.log('\n[테스트 2] 검색어: "학교"');
    try {
      const res2 = await axios.get(`${NEIS_BASE_URL}/schoolInfo`, {
        params: {
          KEY: API_KEY,
          TYPE: 'json',
          ATPT_OFCDC_SC_CODE: 'B30',
          SCHUL_NM: '학교',
        },
      });
      console.log('상태:', res2.status);
      if (res2.data.schoolInfo?.[1]?.row) {
        const rows = Array.isArray(res2.data.schoolInfo[1].row) 
          ? res2.data.schoolInfo[1].row 
          : [res2.data.schoolInfo[1].row];
        console.log('결과:', rows.length, '개');
        console.log('첫 5개:', rows.slice(0, 5).map(s => `${s.SCHUL_NM} (${s.SD_SCHUL_CODE})`));
      } else {
        console.log('응답 데이터:', res2.data);
      }
    } catch (e) {
      console.log('❌ 오류:', e.response?.status, e.message);
    }
    
    // 테스트 3: "중" 검색 (중학교 찾기)
    console.log('\n[테스트 3] 검색어: "중"');
    try {
      const res3 = await axios.get(`${NEIS_BASE_URL}/schoolInfo`, {
        params: {
          KEY: API_KEY,
          TYPE: 'json',
          ATPT_OFCDC_SC_CODE: 'B30',
          SCHUL_NM: '중',
        },
      });
      console.log('상태:', res3.status);
      if (res3.data.schoolInfo?.[1]?.row) {
        const rows = Array.isArray(res3.data.schoolInfo[1].row) 
          ? res3.data.schoolInfo[1].row 
          : [res3.data.schoolInfo[1].row];
        console.log('결과:', rows.length, '개');
        console.log('첫 5개:', rows.slice(0, 5).map(s => `${s.SCHUL_NM} (${s.SD_SCHUL_CODE})`));
      } else {
        console.log('응답 데이터:', res3.data);
      }
    } catch (e) {
      console.log('❌ 오류:', e.response?.status, e.message);
    }
    
    // 테스트 4: 비교용 서울 "강남" 검색
    console.log('\n[테스트 4] 서울(B10) + "강남" 검색 (비교용)');
    try {
      const res4 = await axios.get(`${NEIS_BASE_URL}/schoolInfo`, {
        params: {
          KEY: API_KEY,
          TYPE: 'json',
          ATPT_OFCDC_SC_CODE: 'B10',
          SCHUL_NM: '강남',
        },
      });
      console.log('상태:', res4.status);
      if (res4.data.schoolInfo?.[1]?.row) {
        const rows = Array.isArray(res4.data.schoolInfo[1].row) 
          ? res4.data.schoolInfo[1].row 
          : [res4.data.schoolInfo[1].row];
        console.log('결과:', rows.length, '개');
        console.log('목록:', rows.map(s => `${s.SCHUL_NM} (${s.SD_SCHUL_CODE})`));
      }
    } catch (e) {
      console.log('❌ 오류:', e.response?.status, e.message);
    }
    
  } catch (error) {
    console.error('❌ 전체 오류:', error.message);
  }
}

debugDaeguAPI();
