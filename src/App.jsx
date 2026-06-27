import { useState } from 'react';
import { EDUCATION_OFFICES, searchSchools, getWeeklyMealInfo } from './api';
import './App.css';

function App() {
  const [selectedOffice, setSelectedOffice] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [schoolList, setSchoolList] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [mealData, setMealData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchError, setSearchError] = useState('');

  const handleSearchSchools = async () => {
    if (!selectedOffice) {
      setSearchError('시도교육청을 선택해주세요.');
      return;
    }
    if (!schoolName.trim()) {
      setSearchError('학교명을 입력해주세요.');
      return;
    }

    setLoading(true);
    setSearchError('');
    setSchoolList([]);
    setSelectedSchool(null);

    try {
      const results = await searchSchools(selectedOffice, schoolName);
      if (results.length === 0) {
        setSearchError('검색 결과가 없습니다. 학교명을 확인해주세요.');
        setSchoolList([]);
      } else {
        setSchoolList(results);
      }
    } catch (err) {
      setSearchError('학교 검색 중 오류가 발생했습니다: ' + err.message);
      setSchoolList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSchool = (school) => {
    setSelectedSchool(school);
    setSchoolList([]);
    setSearchError('');
  };

  const handleMealSearch = async () => {
    if (!selectedOffice) {
      setError('시도교육청을 선택해주세요.');
      return;
    }
    if (!selectedSchool) {
      setError('학교를 선택해주세요.');
      return;
    }
    if (!selectedDate) {
      setError('조회 기준일을 선택해주세요.');
      return;
    }

    setLoading(true);
    setError('');
    setMealData([]);

    try {
      const baseDate = new Date(selectedDate);
      const meals = await getWeeklyMealInfo(selectedOffice, selectedSchool.code, baseDate);
      
      if (meals.length === 0) {
        setError('해당 주의 급식 정보가 없습니다.');
      } else {
        setMealData(meals);
      }
    } catch (err) {
      setError('급식 정보 조회 중 오류가 발생했습니다: ' + err.message);
      setMealData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedOffice('');
    setSchoolName('');
    setSchoolList([]);
    setSelectedSchool(null);
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setMealData([]);
    setError('');
    setSearchError('');
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>🍱 학교 급식 조회</h1>
        <p>NEIS Open API를 활용한 학교 급식 정보 조회 서비스</p>
      </header>

      <main className="main-content">
        <section className="control-section">
          <div className="control-group">
            <label htmlFor="office-select">시도교육청 선택</label>
            <select
              id="office-select"
              value={selectedOffice}
              onChange={(e) => setSelectedOffice(e.target.value)}
              className="select-input"
            >
              <option value="">-- 시도교육청 선택 --</option>
              {EDUCATION_OFFICES.map((office) => (
                <option key={office.code} value={office.code}>
                  {office.name}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="school-input">학교명 입력 및 검색</label>
            <div className="search-input-group">
              <input
                id="school-input"
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchSchools()}
                placeholder="학교명을 입력하세요"
                className="text-input"
              />
              <button
                onClick={handleSearchSchools}
                disabled={loading}
                className="search-button"
              >
                {loading ? '검색 중...' : '검색'}
              </button>
            </div>

            {searchError && <p className="error-message">{searchError}</p>}

            {schoolList.length > 0 && (
              <div className="school-list">
                <p className="list-title">검색 결과:</p>
                {schoolList.map((school, idx) => (
                  <div
                    key={idx}
                    className="school-item"
                    onClick={() => handleSelectSchool(school)}
                  >
                    <span className="school-name">{school.name}</span>
                    <span className="school-code">{school.code}</span>
                  </div>
                ))}
              </div>
            )}

            {selectedSchool && (
              <div className="selected-school">
                <strong>선택된 학교:</strong> {selectedSchool.name} ({selectedSchool.code})
                <button
                  onClick={() => {
                    setSelectedSchool(null);
                    setSchoolName('');
                  }}
                  className="clear-button"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="control-group">
            <label htmlFor="date-input">조회 기준일 선택</label>
            <input
              id="date-input"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-input"
            />
          </div>

          <div className="button-group">
            <button
              onClick={handleMealSearch}
              disabled={loading || !selectedSchool}
              className="search-meal-button"
            >
              {loading ? '조회 중...' : '급식 조회'}
            </button>
            <button onClick={handleReset} className="reset-button">
              초기화
            </button>
          </div>

          {error && <p className="error-message main-error">{error}</p>}
        </section>

        {mealData.length > 0 && (
          <section className="meal-section">
            <h2>주간 중식 급식</h2>
            <div className="meal-grid">
              {mealData.map((meal, idx) => (
                <div key={idx} className="meal-card">
                  <h3 className="meal-date">{meal.displayDate}</h3>
                  <div className="meal-content">
                    {meal.meal.split('<br/>').map((dish, i) => (
                      <p key={i} className="meal-item">
                        {dish.trim() || '급식 정보 없음'}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <p>© 2024 NEIS 학교 급식 조회 | Powered by NEIS Open API</p>
      </footer>
    </div>
  );
}

export default App;
