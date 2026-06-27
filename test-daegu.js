import axios from 'axios';

const API_KEY = '3aeace82f952472ab2151a44cf0e736b';
const NEIS_BASE_URL = 'https://open.neis.go.kr/hub';

async function testDaeguSchools() {
  try {
    console.log('\n🔍 대구교육청(B30) 학교 검색');
    console.log('========================================');
    
    const response = await axios.get(`${NEIS_BASE_URL}/schoolInfo`, {
      params: {
        KEY: API_KEY,
        TYPE: 'json',
        ATPT_OFCDC_SC_CODE: 'B30',
        SCHUL_NM: '대구',
      },
    });

    if (response.data && response.data.schoolInfo && response.data.schoolInfo[1]) {
      let rows = response.data.schoolInfo[1].row;
      if (!Array.isArray(rows)) {
        rows = [rows];
      }
      
      console.log(`✅ 검색 결과: ${rows.length}개\n`);
      rows.slice(0, 20).forEach((school, i) => {
        console.log(`${i + 1}. ${school.SCHUL_NM} (${school.SD_SCHUL_CODE})`);
      });
      
      // 상원 학교 찾기
      console.log('\n🔍 "상원"이 포함된 학교:');
      const sawonSchools = rows.filter(s => s.SCHUL_NM.includes('상원'));
      if (sawonSchools.length > 0) {
        sawonSchools.forEach(s => {
          console.log(`  - ${s.SCHUL_NM} (${s.SD_SCHUL_CODE})`);
        });
      } else {
        console.log('  - 없음');
      }
    }
  } catch (error) {
    console.error('❌ 오류:', error.message);
  }
}

testDaeguSchools();
