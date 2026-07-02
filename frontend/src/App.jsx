import React, { useState, useEffect } from 'react';

// 컴포넌트 외부로 jobs 데이터를 이동시켜 불필요한 재선언을 방지합니다.
const allJobs = [
    {
      id: 1,
      company: 'ESPEC Corp (에스펙)',
      catchphrase: '세계 최고 수준의 환경 시험기 제조사. IT 인프라로 글로벌 환경을 지킵니다.',
      description: '사내 네트워크 및 서버 인프라 구축, 클라우드(AWS) 환경 전환 프로젝트 담당. 리눅스 서버 관리 및 보안 강화.',
      industry: '기계/전자/IT 인프라',
      location: '오사카부 오사카시 기타구',
      jobType: '인프라 엔지니어 (서버/네트워크)',
      salary: '월급 235,000엔 (대졸 기준)',
      badges: ['엔트리 접수중', '설명회 예약중'],
      tech: ['Linux', 'Windows Server', 'AWS', 'Network']
    },
    {
      id: 2,
      company: 'AY Tech (에이와이테크)',
      catchphrase: '정밀 기계 부품 설계의 선두주자. 당신의 설계가 3D로 현실이 됩니다.',
      description: '자동차 및 산업용 정밀 부품의 3D CAD 모델링, 도면 작성 및 제품 설계 보조 업무. 신제품 개발 프로젝트 참여.',
      industry: '제조/기계설계',
      location: '오사카부 사카이시',
      jobType: '기계 설계 (3D CAD)',
      salary: '월급 220,000엔 (대졸/전문대졸 기준)',
      badges: ['엔트리 접수중', 'WEB 면접 가능'],
      tech: ['AutoCAD', 'JW CAD', 'SolidWorks']
    },
    {
      id: 3,
      company: '주식회사 오쿠무라구미 (Okumura-gumi)',
      catchphrase: '견고한 건설로 사회의 기반을 만듭니다. 차세대 건설 ICT를 이끌어갈 인재 모집.',
      description: '대형 건축/토목 프로젝트의 CAD 도면 작성 및 BIM 모델링 지원. 건설 현장의 ICT 기술 도입 기획.',
      industry: '건설/토목/건축',
      location: '오사카 본사 및 전국 지사',
      jobType: '건축 설계 및 현장 ICT 지원',
      salary: '월급 240,000엔 (대졸 기준)',
      badges: ['설명회 예약중'],
      tech: ['AutoCAD', 'Revit', 'BIM']
    },
    {
      id: 4,
      company: '주식회사 세라쿠 (Seraku)',
      catchphrase: 'IT 기술로 기업의 비즈니스를 가속화하다. 미경험자도 안심할 수 있는 연수 제도.',
      description: '시스템 운용 보수, 서버 구축, 클라우드 플랫폼 관리. 3개월간의 강도 높은 사내 연수 후 프로젝트 투입.',
      industry: 'IT/소프트웨어/통신',
      location: '오사카 지사 (우메다)',
      jobType: 'IT 인프라 엔지니어',
      salary: '월급 225,000엔 (대졸 기준)',
      badges: ['엔트리 접수중', '설명회 예약중'],
      tech: ['Linux', 'CCNA', 'AWS']
    },
    {
      id: 5,
      company: '주식회사 아스파크 (Aspark)',
      catchphrase: '엔지니어의 가치를 극대화하는 R&D 아웃소싱 플랫폼.',
      description: '로봇, 자동차, 의료기기 등 다양한 분야의 R&D 프로젝트에서 기계/전기 설계 및 서버 소프트웨어 개발 수행.',
      industry: '엔지니어링/기술파견',
      location: '간사이(오사카, 교토, 고베) 일대',
      jobType: 'R&D 설계 및 시스템 개발',
      salary: '월급 215,000엔 ~ (역량에 따라 상이)',
      badges: ['상시 채용'],
      tech: ['CAD', 'C++', 'Python']
    }
  ];

function App() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({ applicantName: '', entrySheet: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState(allJobs);


  const handleApply = (e) => {
    e.preventDefault();
    alert('엔트리가 완료되었습니다! (마이페이지에서 확인 가능합니다)');
    setSelectedJob(null);
    setFormData({ applicantName: '', entrySheet: '' });
  };

  // 검색어(searchTerm)가 변경될 때마다 실행되는 실시간 검색 기능
  useEffect(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    if (lowercasedTerm === '') {
      setFilteredJobs(allJobs); // 검색어가 없으면 전체 목록 표시
    } else {
      const results = allJobs.filter(job => {
        const companyMatch = job.company.toLowerCase().includes(lowercasedTerm);
        const techMatch = job.tech.some(t => t.toLowerCase().includes(lowercasedTerm));
        return companyMatch || techMatch;
      });
      setFilteredJobs(results);
    }
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#f3f4f7] font-sans text-[#333] text-sm">
      {/* 1. 최상단 유틸리티 바 */}
      <div className="bg-[#f2f2f2] border-b border-gray-300 text-xs py-1 px-4 flex justify-between items-center">
        <div className="flex gap-4">
          <span className="text-gray-600">학생을 위한 취업정보사이트</span>
          <a href="#" className="text-gray-600 hover:underline">마이나비 2026</a>
          <a href="#" className="text-gray-600 hover:underline">마이나비 2027</a>
        </div>
        <div className="flex gap-4 text-gray-600">
          <a href="#" className="hover:underline">회원가입</a>
          <a href="#" className="hover:underline">로그인</a>
        </div>
      </div>

      {/* 2. 메인 헤더 (마이나비 블루) */}
      <header className="bg-[#0062b1] text-white">
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-3xl font-extrabold italic tracking-tighter">MyJobNavi</h1>
            <div className="relative">
              <input 
                type="text" 
                placeholder="기업명, 프리워드(CAD, 서버 등)로 검색" 
                className="w-[400px] py-2 pl-3 pr-10 text-gray-800 text-sm rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="absolute right-0 top-0 h-full px-3 text-[#0062b1]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </button>
            </div>
          </div>
          <div className="flex gap-4 text-sm font-bold">
            <button className="flex flex-col items-center hover:text-blue-200 transition-colors">
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              마이페이지
            </button>
            <button className="flex flex-col items-center hover:text-blue-200 transition-colors">
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              엔트리 박스
            </button>
            <button className="flex flex-col items-center hover:text-blue-200 transition-colors">
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              검토 리스트
            </button>
          </div>
        </div>
        
        {/* 네비게이션 탭 */}
        <div className="bg-white text-[#333] border-b-2 border-[#0062b1] text-center">
          <ul className="max-w-[1200px] mx-auto flex text-sm font-bold ">
            <li className="flex-1 px-4 py-3 bg-[#0062b1] text-white cursor-pointer border-r border-[#007ad0]">기업 검색</li>
            <li className="flex-1 px-4 py-3 hover:bg-gray-100 border-r border-gray-200 cursor-pointer">세미나·설명회 검색</li>
            <li className="flex-1 px-4 py-3 hover:bg-gray-100 border-r border-gray-200 cursor-pointer">취업 준비 가이드</li>
            <li className="flex-1 px-4 py-3 hover:bg-gray-100 cursor-pointer">취업 행사 (EXPO)</li>
          </ul>
        </div>
      </header>

      {/* 3. 본문 레이아웃 (사이드바 + 메인 콘텐츠) */}
      <div className="max-w-[1200px] mx-auto mt-6 px-4 flex gap-6 pb-20">
        
        {/* 왼쪽 사이드바 (필터) */}
        <aside className="w-[240px] shrink-0">
          <div className="bg-white border border-gray-200 rounded-sm mb-4">
            <h3 className="bg-gray-50 text-[#0062b1] font-bold py-2 px-3 border-b border-gray-200 text-sm">
              조건을 좁혀서 검색
            </h3>
            <div className="p-3 space-y-4 text-sm">
              <div>
                <p className="font-bold mb-2 text-gray-700">희망 근무지</p>
                <label className="flex items-center gap-2 mb-1"><input type="checkbox" className="form-checkbox h-4 w-4 text-[#0062b1] border-gray-300 rounded focus:ring-[#0062b1]" /> 간사이 (오사카 등)</label>
                <label className="flex items-center gap-2"><input type="checkbox" className="form-checkbox h-4 w-4 text-[#0062b1] border-gray-300 rounded focus:ring-[#0062b1]" /> 간토 (도쿄 등)</label>
              </div>
              <hr className="border-gray-200" />
              <div>
                <p className="font-bold mb-2 text-gray-700">업종</p>
                <label className="flex items-center gap-2 mb-1"><input type="checkbox" className="form-checkbox h-4 w-4 text-[#0062b1] border-gray-300 rounded focus:ring-[#0062b1]" /> 소프트웨어·정보처리</label>
                <label className="flex items-center gap-2 mb-1"><input type="checkbox" className="form-checkbox h-4 w-4 text-[#0062b1] border-gray-300 rounded focus:ring-[#0062b1]" /> 기계·설계</label>
                <label className="flex items-center gap-2"><input type="checkbox" className="form-checkbox h-4 w-4 text-[#0062b1] border-gray-300 rounded focus:ring-[#0062b1]" /> 건축·토목</label>
              </div>
              <button className="w-full bg-white text-gray-700 border border-gray-300 py-1 mt-2 text-xs hover:bg-gray-100 rounded-sm">
                조건 클리어
              </button>
            </div>
          </div>
          <img src="https://via.placeholder.com/240x300?text=Ad+Banner" alt="광고 배너" className="w-full border border-gray-200" />
        </aside>

        {/* 오른쪽 메인 콘텐츠 (기업 리스트) */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-4 border-b-2 border-gray-800 pb-2">
            <h2 className="text-xl font-bold">검색 결과 <span className="text-[#0062b1] text-2xl">{filteredJobs.length}</span>건</h2>
            <select className="border border-gray-300 p-1 text-sm bg-white">
              <option>마이나비 추천순</option>
              <option>신착순</option>
              <option>엔트리 마감 임박순</option>
            </select>
          </div>

          <div className="space-y-6">
            {filteredJobs.map(job => (
              <div key={job.id} className="bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-lg transition-shadow duration-300">
                {/* 카드 상단: 회사명 및 뱃지 */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-[#0062b1] mb-2">{job.company}</h3>
                    <div className="flex gap-2">
                      {job.badges.map(badge => (
                        <span key={badge} className={`text-xs font-bold text-white px-2 py-1 rounded-sm ${badge.includes('엔트리') ? 'bg-[#ff5a00]' : 'bg-[#00a7e1]'}`}>
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="flex flex-col items-center text-xs font-bold text-gray-500 hover:text-red-500">
                    <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    검토 리스트에 추가
                  </button>
                </div>

                {/* 카드 중단: 캐치프레이즈 및 설명 */}
                <div className="p-4 flex gap-4">
                  <div className="w-[180px] h-[120px] bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center text-gray-400 text-sm rounded-sm">
                    기업 이미지 사진
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-bold text-gray-800 mb-2">{job.catchphrase}</p>
                    <p className="text-sm text-gray-600 mb-3">{job.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {job.tech.map(t => (
                        <span key={t} className="bg-gray-100 border border-gray-200 text-gray-700 px-2 py-0.5 text-xs rounded-sm">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 카드 하단: 표 형태의 상세 정보 */}
                <div className="px-4 pb-4">
                  <table className="w-full text-sm border-t border-gray-200">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <th className="bg-[#f7f7f7] text-left py-2 px-3 w-[120px] text-gray-700">업종</th>
                        <td className="py-2 px-3 text-gray-600">{job.industry}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <th className="bg-[#f7f7f7] text-left py-2 px-3 text-gray-700">모집 직종</th>
                        <td className="py-2 px-3 text-gray-600">{job.jobType}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <th className="bg-[#f7f7f7] text-left py-2 px-3 text-gray-700">근무지</th>
                        <td className="py-2 px-3 text-gray-600">{job.location}</td>
                      </tr>
                      <tr>
                        <th className="bg-[#f7f7f7] text-left py-2 px-3 text-gray-700">초임 급여</th>
                        <td className="py-2 px-3 text-gray-600">{job.salary}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 카드 액션 버튼 영역 */}
                <div className="bg-[#f8f9fa] p-4 flex justify-center gap-4 border-t border-gray-200">
                  <button 
                    onClick={() => setSelectedJob(job)}
                    className="w-[240px] bg-[#ff5a00] hover:bg-[#e04f00] text-white font-bold py-3 rounded-sm shadow-md hover:shadow-lg text-lg flex items-center justify-center gap-2 transition-all"
                  >
                    엔트리
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </button>
                  <button className="w-[240px] bg-white hover:bg-blue-50 border border-[#00a7e1] text-[#00a7e1] font-bold py-3 rounded-sm shadow-md hover:shadow-lg text-lg flex items-center justify-center gap-2 transition-all">
                    설명회 · 세미나 예약
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* 마이나비 스타일 입사 지원 모달 창 */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4 z-50 text-base">
          <div className="bg-white w-full max-w-2xl border-t-8 border-[#0062b1] shadow-2xl rounded-sm">
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm mb-1">{selectedJob.company}</p>
                <h2 className="text-2xl font-bold text-gray-800">엔트리 시트 (ES) 제출</h2>
              </div>
              <button onClick={() => setSelectedJob(null)} className="text-gray-400 hover:text-gray-700">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <form onSubmit={handleApply} className="p-8 bg-[#f7f7f7]">
              <div className="bg-white p-8 border border-gray-300">
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">성명 (가타카나 입력 포함) <span className="text-red-500 text-xs ml-1">필수</span></label>
                  <input 
                    type="text" 
                    required 
                    className="w-full border border-gray-300 p-2 text-base focus:border-[#0062b1] focus:outline-none focus:ring-1 focus:ring-[#0062b1]"
                    value={formData.applicantName}
                    onChange={(e) => setFormData({...formData, applicantName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">학생시대에 가장 힘썼던 일 (가쿠치카) <span className="text-red-500 text-xs ml-1">필수</span></label>
                  <textarea 
                    required 
                    rows="8"
                    className="w-full border border-gray-300 p-3 text-base focus:border-[#0062b1] focus:outline-none resize-none focus:ring-1 focus:ring-[#0062b1]"
                    placeholder="구체적인 에피소드를 바탕으로 작성해 주십시오."
                    value={formData.entrySheet}
                    onChange={(e) => setFormData({...formData, entrySheet: e.target.value})}
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center gap-4">
                <button 
                  type="button" 
                  onClick={() => setSelectedJob(null)}
                  className="w-40 bg-gray-400 text-white font-bold py-3 hover:bg-gray-500 transition-colors"
                >
                  취소
                </button>
                <button 
                  type="submit" 
                  className="w-64 bg-[#ff5a00] text-white font-bold py-3 hover:bg-[#e04f00] transition-colors"
                >
                  위 내용으로 엔트리 제출
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;