const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config(); // .env 파일 사용을 위해 추가

// .env 파일에서 API 키를 가져옵니다.
const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

if (!apiKey) {
    throw new Error("GOOGLE_BOOKS_API_KEY가 .env 파일에 설정되지 않았습니다. 서버를 종료합니다.");
}

const app = express();
const port = 3000;

// 정적 파일(HTML, CSS)을 제공하기 위한 설정
// __dirname은 현재 파일(server.js)이 위치한 디렉토리 경로입니다.
// 즉, /Users/kimjongheon/Desktop/mynavi-clone 폴더를 의미하게 됩니다.
app.use(express.static(__dirname));

app.get('/search', async (req, res) => {
    const keyword = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const maxResults = 12;
    const startIndex = (page - 1) * maxResults;

    if (!keyword) {
        return res.status(400).json({ message: '검색어를 입력하세요.' });
    }

    try {
        const apiResponse = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${keyword}&maxResults=${maxResults}&startIndex=${startIndex}&country=JP&key=${apiKey}`);
        const data = await apiResponse.json();
        res.json(data);
    } catch (error) {
        console.error('API 요청 오류:', error);
        res.status(500).json({ message: '서버에서 오류가 발생했습니다.' });
    }
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
