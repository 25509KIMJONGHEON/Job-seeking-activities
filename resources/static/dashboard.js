// dashboard.js

// DOM이 완전히 로드된 후 스크립트를 실행합니다.
document.addEventListener('DOMContentLoaded', function() {
    fetchJobs();
    fetchNews();
});

/**
 * 백엔드의 스크레이핑 API로부터 채용 정보를 가져와 화면에 표시하는 함수
 */
function fetchJobs() {
    const jobBoard = document.getElementById('job-board');

    fetch('/api/jobs')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(jobs => {
            jobBoard.innerHTML = ''; // 로딩 스켈레톤 UI를 지웁니다.

            if (jobs.length === 0) {
                jobBoard.innerHTML = '<p>新着の求人はありません。</p>';
                return;
            }

            jobs.forEach(job => {
                const item = document.createElement('div');
                item.className = 'job-item';

                const tagsHtml = job.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

                item.innerHTML = `
                    <h4 class="company-name"><a href="${job.url}" target="_blank" rel="noopener noreferrer">${job.company}</a></h4>
                    <p class="catch-copy">${job.title}</p>
                    <div class="tags">${tagsHtml}</div>
                    <p class="location">勤務地: ${job.location}</p>
                `;
                jobBoard.appendChild(item);
            });
        })
        .catch(error => {
            console.error('채용 정보를 가져오는 데 실패했습니다:', error);
            jobBoard.innerHTML = '<p>求人情報の読み込みに失敗しました。後でもう一度お試しください。</p>';
        });
}

/**
 * 백엔드의 뉴스 API로부터 최신 뉴스를 가져와 화면에 표시하는 함수
 */
function fetchNews() {
    const newsBoard = document.getElementById('news-board');
    
    fetch('/api/news?category=technology')
        .then(response => response.json())
        .then(data => {
            newsBoard.innerHTML = '';

            if (!data.articles || data.articles.length === 0) {
                newsBoard.innerHTML = '<p>ニュースがありません。</p>';
                return;
            }

            // 최대 5개의 뉴스만 표시
            data.articles.slice(0, 5).forEach(article => {
                const item = document.createElement('div');
                item.className = 'news-item';
                item.innerHTML = `<a href="${article.url}" target="_blank" rel="noopener noreferrer">${article.title}</a>`;
                newsBoard.appendChild(item);
            });
        })
        .catch(error => {
            console.error('뉴스 정보를 가져오는 데 실패했습니다:', error);
            newsBoard.innerHTML = '<p>ニュースの読み込みに失敗しました。</p>';
        });
}