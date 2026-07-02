import React, { useState } from 'react';

function App() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({ applicantName: '', entrySheet: '' });

  // 마이나비 스타일의 풍부한 더미 데이터 (프론트엔드 단독 출력용)
  const jobs = [ // 모든 텍스트를 일본어로 수정
    {
      id: 1,
      company: 'ESPEC Corp (エスペック)',
      catchphrase: '世界最高水準の環境試験機メーカー。ITインフラでグローバルな環境を守ります。',
      description: '社内ネットワークおよびサーバーインフラの構築、クラウド(AWS)環境への移行プロジェクトを担当。Linuxサーバーの管理およびセキュリティ強化。',
      industry: '機械・電子・ITインフラ',
      location: '大阪府大阪市北区',
      jobType: 'インフラエンジニア（サーバー/ネットワーク）',
      salary: '月給235,000円（大卒）',
      badges: ['エントリー受付中', '説明会予約受付中'],
      tech: ['Linux', 'Windows Server', 'AWS', 'Network']
    },
    {
      id: 2,
      company: 'AY Tech (エイワイテック)',
      catchphrase: '精密機械部品設計のリーディングカンパニー。あなたの設計が3Dで現実になります。',
      description: '自動車および産業用精密部品の3D CADモデリング、図面作成、製品設計補助業務。新製品開発プロジェクトへの参加。',
      industry: '製造・機械設計',
      location: '大阪府堺市',
      jobType: '機械設計（3D CAD）',
      salary: '月給220,000円（大卒・専門卒）',
      badges: ['エントリー受付中', 'WEB面接可'],
      tech: ['AutoCAD', 'JW CAD', 'SolidWorks']
    },
    {
      id: 3,
      company: '株式会社奥村組 (Okumura-gumi)',
      catchphrase: '堅実な建設で社会の基盤を築きます。次世代の建設ICTをリードする人材を募集。',
      description: '大型建築・土木プロジェクトのCAD図面作成およびBIMモデリング支援。建設現場のICT技術導入企画。',
      industry: '建設・土木・建築',
      location: '大阪本社および全国支社',
      jobType: '建築設計および現場ICT支援',
      salary: '月給240,000円（大卒）',
      badges: ['説明会予約受付中'],
      tech: ['AutoCAD', 'Revit', 'BIM']
    },
    {
      id: 4,
      company: '株式会社セラク (Seraku)',
      catchphrase: 'IT技術で企業のビジネスを加速させる。未経験者も安心の研修制度。',
      description: 'システム運用保守、サーバー構築、クラウドプラットフォーム管理。3ヶ月間の手厚い社内研修後、プロジェクトに配属。',
      industry: 'IT・ソフトウェア・通信',
      location: '大阪支社（梅田）',
      jobType: 'ITインフラエンジニア',
      salary: '月給225,000円（大卒）',
      badges: ['エントリー受付中', '説明会予約受付中'],
      tech: ['Linux', 'CCNA', 'AWS']
    },
    {
      id: 5,
      company: '株式会社アスパーク (Aspark)',
      catchphrase: 'エンジニアの価値を最大化するR&Dアウトソーシングプラットフォーム。',
      description: 'ロボット、自動車、医療機器など多様な分野のR&Dプロジェクトで機械・電気設計やサーバーソフトウェア開発を遂行。',
      industry: 'エンジニアリング・技術派遣',
      location: '関西（大阪、京都、神戸）一帯',
      jobType: 'R&D設計およびシステム開発',
      salary: '月給215,000円～（能力に応じて変動）',
      badges: ['通年採用'],
      tech: ['CAD', 'C++', 'Python']
    }
  ];

  const handleApply = (e) => {
    e.preventDefault();
    alert('エントリーが完了しました！（マイページで確認できます）');
    setSelectedJob(null);
    setFormData({ applicantName: '', entrySheet: '' });
  };

  return (
    <div className="min-h-screen bg-[#f3f4f7] font-sans text-[#333]">
      {/* 1. 최상단 유틸리티 바 */}
      <div className="bg-[#f2f2f2] border-b border-gray-300 text-xs py-1 px-4 flex justify-between items-center">
        <div className="flex gap-4">
          <span className="text-gray-600">学生のための就職情報サイト</span>
          <a href="#" className="text-gray-600 hover:underline">マイナビ2026</a>
          <a href="#" className="text-gray-600 hover:underline">マイナビ2027</a>
        </div>
        <div className="flex gap-4 text-gray-600">
          <a href="#" className="hover:underline">会員登録</a>
          <a href="#" className="hover:underline">ログイン</a>
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
                placeholder="企業名、フリーワード（CAD、サーバーなど）で検索" 
                className="w-[400px] py-2 pl-3 pr-10 text-gray-800 text-sm rounded shadow-inner focus:outline-none"
              />
              <button className="absolute right-0 top-0 h-full px-3 text-[#0062b1]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </button>
            </div>
          </div>
          <div className="flex gap-4 text-sm font-bold">
            <button className="flex flex-col items-center hover:text-blue-200">
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              マイページ
            </button>
            <button className="flex flex-col items-center hover:text-blue-200">
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              エントリーボックス
            </button>
            <button className="flex flex-col items-center hover:text-blue-200">
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              検討リスト
            </button>
          </div>
        </div>
        
        {/* 네비게이션 탭 */}
        <div className="bg-white text-[#333] border-b-2 border-[#0062b1]">
          <ul className="max-w-[1200px] mx-auto flex text-sm font-bold">
            <li className="px-6 py-3 bg-[#0062b1] text-white cursor-pointer">企業検索</li>
            <li className="px-6 py-3 hover:bg-gray-100 border-r border-gray-200 cursor-pointer">セミナー・説明会検索</li>
            <li className="px-6 py-3 hover:bg-gray-100 border-r border-gray-200 cursor-pointer">就活準備ガイド</li>
            <li className="px-6 py-3 hover:bg-gray-100 border-r border-gray-200 cursor-pointer">就活イベント(EXPO)</li>
          </ul>
        </div>
      </header>

      {/* 3. 본문 레이아웃 (사이드바 + 메인 콘텐츠) */}
      <div className="max-w-[1200px] mx-auto mt-6 px-4 flex gap-6 pb-20">
        
        {/* 왼쪽 사이드바 (필터) */}
        <aside className="w-[240px] shrink-0">
          <div className="bg-white border border-gray-300 rounded mb-4">
            <h3 className="bg-[#f7f7f7] text-[#0062b1] font-bold py-2 px-3 border-b border-gray-300 text-sm">
              条件を絞り込んで探す
            </h3>
            <div className="p-3 space-y-4 text-sm">
              <div>
                <p className="font-bold mb-2 text-gray-700">希望勤務地</p>
                <label className="flex items-center gap-2 mb-1"><input type="checkbox" /> 関西（大阪など）</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> 関東（東京など）</label>
              </div>
              <hr className="border-gray-200" />
              <div>
                <p className="font-bold mb-2 text-gray-700">業種</p>
                <label className="flex items-center gap-2 mb-1"><input type="checkbox" /> ソフトウェア・情報処理</label>
                <label className="flex items-center gap-2 mb-1"><input type="checkbox" /> 機械・設計</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> 建設・土木</label>
              </div>
              <button className="w-full bg-[#efefef] text-gray-700 border border-gray-300 py-1 mt-2 text-xs hover:bg-gray-200">
                条件をクリア
              </button>
            </div>
          </div>
          <img src="https://via.placeholder.com/240x300?text=Ad+Banner" alt="広告バナー" className="w-full" />
        </aside>

        {/* 오른쪽 메인 콘텐츠 (기업 리스트) */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-4 border-b-2 border-gray-800 pb-2">
            <h2 className="text-xl font-bold">検索結果 <span className="text-[#0062b1]">{jobs.length}</span>件</h2>
            <select className="border border-gray-300 p-1 text-sm bg-white">
              <option>マイナビおすすめ順</option>
              <option>新着順</option>
              <option>エントリー締切間近順</option>
            </select>
          </div>

          <div className="space-y-6">
            {jobs.map(job => (
              <div key={job.id} className="bg-white border border-gray-300 rounded shadow-sm hover:shadow-md transition">
                {/* 카드 상단: 회사명 및 뱃지 */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-[#0062b1] mb-2">{job.company}</h3>
                    <div className="flex gap-2">
                      {job.badges.map(badge => (
                        <span key={badge} className={`text-xs font-bold text-white px-2 py-1 ${badge.includes('エントリー') ? 'bg-[#ff5a00]' : 'bg-[#00a7e1]'}`}>
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="flex flex-col items-center text-xs font-bold text-gray-500 hover:text-red-500">
                    <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    検討リストに追加
                  </button>
                </div>

                {/* 카드 중단: 캐치프레이즈 및 설명 */}
                <div className="p-4 flex gap-4">
                  <div className="w-[180px] h-[120px] bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-400 text-sm">
                    企業イメージ写真
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-bold mb-2">{job.catchphrase}</p>
                    <p className="text-sm text-gray-600 mb-3">{job.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {job.tech.map(t => (
                        <span key={t} className="bg-gray-100 border border-gray-300 text-gray-600 px-2 py-0.5 text-xs">
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
                        <th className="bg-[#f7f7f7] text-left py-2 px-3 w-[120px] text-gray-700">業種</th>
                        <td className="py-2 px-3 text-gray-600">{job.industry}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <th className="bg-[#f7f7f7] text-left py-2 px-3 w-[120px] text-gray-700">募集職種</th>
                        <td className="py-2 px-3 text-gray-600">{job.jobType}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <th className="bg-[#f7f7f7] text-left py-2 px-3 w-[120px] text-gray-700">勤務地</th>
                        <td className="py-2 px-3 text-gray-600">{job.location}</td>
                      </tr>
                      <tr>
                        <th className="bg-[#f7f7f7] text-left py-2 px-3 w-[120px] text-gray-700">初任給</th>
                        <td className="py-2 px-3 text-gray-600">{job.salary}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 카드 액션 버튼 영역 */}
                <div className="bg-[#f8f9fa] p-4 flex justify-center gap-4 border-t border-gray-200">
                  <button 
                    onClick={() => setSelectedJob(job)}
                    className="w-[240px] bg-[#ff5a00] hover:bg-[#e04f00] text-white font-bold py-3 rounded shadow text-lg flex items-center justify-center gap-2 transition"
                  >
                    エントリー
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </button>
                  <button className="w-[240px] bg-[#00a7e1] hover:bg-[#0092c4] text-white font-bold py-3 rounded shadow text-lg flex items-center justify-center gap-2 transition">
                    説明会・セミナー予約
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
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl border-t-8 border-[#0062b1] shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm mb-1">{selectedJob.company}</p>
                <h2 className="text-2xl font-bold text-gray-800">エントリーシート(ES)提出</h2>
              </div>
              <button onClick={() => setSelectedJob(null)} className="text-gray-400 hover:text-gray-700">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <form onSubmit={handleApply} className="p-6 bg-[#f7f7f7]">
              <div className="bg-white p-6 border border-gray-300">
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">氏名 (フリガナ含む) <span className="text-red-500 text-xs ml-1">必須</span></label>
                  <input 
                    type="text" 
                    required 
                    className="w-full border border-gray-300 p-2 text-sm focus:border-[#0062b1] focus:outline-none"
                    value={formData.applicantName}
                    onChange={(e) => setFormData({...formData, applicantName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">学生時代に最も打ち込んだこと (ガクチカ) <span className="text-red-500 text-xs ml-1">必須</span></label>
                  <textarea 
                    required 
                    rows="8"
                    className="w-full border border-gray-300 p-3 text-sm focus:border-[#0062b1] focus:outline-none resize-none"
                    placeholder="具体的なエピソードを交えて記入してください。"
                    value={formData.entrySheet}
                    onChange={(e) => setFormData({...formData, entrySheet: e.target.value})}
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center gap-4">
                <button 
                  type="button" 
                  onClick={() => setSelectedJob(null)}
                  className="w-40 bg-gray-400 text-white font-bold py-3 hover:bg-gray-500"
                >
                  キャンセル
                </button>
                <button 
                  type="submit" 
                  className="w-64 bg-[#ff5a00] text-white font-bold py-3 hover:bg-[#e04f00]"
                >
                  上記の内容でエントリーする
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