import React, { useState, useEffect } from 'react';

function App() {
  // 처음 화면을 켰을 때 휑하지 않도록, 귀여운 고양이 관련 책들을 기본으로 불러오게 설정했습니다.
  const [query, setQuery] = useState('고양이');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  // 구글 도서 API에서 데이터를 가져오는 함수
  const searchBooks = async (searchQuery) => {
    if (!searchQuery) return;
    setLoading(true);
    
    try {
      // 구글 무료 도서 API 호출 (API 키 필요 없음)
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&maxResults=12`);
      const data = await response.json();
      
      // 검색 결과가 있으면 상태 업데이트, 없으면 빈 배열
      setBooks(data.items || []);
    } catch (error) {
      console.error('책 정보를 불러오는데 실패했습니다:', error);
      alert('데이터를 불러오는 중 오류가 발생했습니다.');
    }
    
    setLoading(false);
  };

  // 사이트가 처음 열릴 때 기본 검색어('고양이')로 책을 한 번 검색함
  useEffect(() => {
    searchBooks(query);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 검색 버튼을 눌렀을 때 실행되는 함수
  const handleSearch = (e) => {
    e.preventDefault();
    searchBooks(query);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* 헤더 및 검색창 영역 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-extrabold text-indigo-600 tracking-tight flex items-center gap-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.292.477-4.5 1.253"></path></svg>
            BookFinder
          </h1>
          
          <form onSubmit={handleSearch} className="flex w-full md:w-auto">
            <input 
              type="text" 
              placeholder="읽고 싶은 책 제목이나 키워드를 검색해보세요" 
              className="w-full md:w-80 px-4 py-2 border border-slate-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-r-lg font-bold transition-colors shadow-md"
            >
              검색
            </button>
          </form>
        </div>
      </header>

      {/* 메인 도서 갤러리 영역 */}
      <main className="max-w-5xl mx-auto px-4 py-10">
        {loading ? (
          // 로딩 중일 때 보여줄 화면
          <div className="flex justify-center items-center h-64">
            <p className="text-xl font-bold text-slate-500 animate-pulse">책을 찾고 있습니다...</p>
          </div>
        ) : books.length > 0 ? (
          // 검색 결과가 있을 때 보여줄 갤러리 그리드
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => {
              // 구글 API에서 넘어오는 데이터들 (책 정보)
              const info = book.volumeInfo;
              const thumbnail = info.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192?text=No+Cover';
              
              return (
                <div key={book.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
                  {/* 책 표지 이미지 */}
                  <div className="h-64 bg-slate-100 flex justify-center items-center p-4 overflow-hidden">
                    <img 
                      src={thumbnail} 
                      alt={info.title} 
                      className="h-full object-contain group-hover:scale-105 transition-transform duration-300 shadow-md"
                    />
                  </div>
                  
                  {/* 책 상세 정보 */}
                  <div className="p-4 flex flex-col flex-grow">
                    <h2 className="font-bold text-slate-800 text-lg leading-tight mb-2 line-clamp-2" title={info.title}>
                      {info.title}
                    </h2>
                    <p className="text-sm text-slate-500 mb-1 line-clamp-1">
                      {info.authors ? info.authors.join(', ') : '저자 미상'}
                    </p>
                    <p className="text-xs text-slate-400 mt-auto">
                      {info.publishedDate ? info.publishedDate.substring(0, 4) + '년 출간' : '출간일 미상'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // 검색 결과가 없을 때
          <div className="text-center py-20">
            <p className="text-xl text-slate-500">검색 결과가 없습니다. 다른 검색어를 입력해 보세요!</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;