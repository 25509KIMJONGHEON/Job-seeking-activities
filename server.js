const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config(); // .env 파일 사용을 위해 추가
const { OAuth2Client } = require('google-auth-library');
const session = require('express-session');
const fs = require('fs').promises;
const FileStore = require('session-file-store')(session);

// .env 파일에서 API 키를 가져옵니다.
const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const sessionSecret = process.env.SESSION_SECRET;

if (!apiKey) {
    throw new Error("GOOGLE_BOOKS_API_KEY가 .env 파일에 설정되지 않았습니다. 서버를 종료합니다.");
}
if (!googleClientId || !googleClientSecret) {
    throw new Error("GOOGLE_CLIENT_ID 또는 GOOGLE_CLIENT_SECRET이 .env 파일에 설정되지 않았습니다.");
}
if (!sessionSecret) {
    throw new Error("SESSION_SECRET이 .env 파일에 설정되지 않았습니다.");
}

const client = new OAuth2Client(googleClientId);

const app = express();
const port = 3000;

// 정적 파일(HTML, CSS)을 제공하기 위한 설정
// __dirname은 현재 파일(server.js)이 위치한 디렉토리 경로입니다.
// 즉, /Users/kimjongheon/Desktop/mynavi-clone 폴더를 의미하게 됩니다.
app.use(express.static(__dirname));
app.use(express.json()); // POST 요청의 body를 파싱하기 위해 추가

// 프로덕션 환경인지 확인 (Heroku, Vercel 등 대부분의 호스팅 환경에서 NODE_ENV를 'production'으로 설정)
const isProduction = process.env.NODE_ENV === 'production';

// 세션 설정
app.use(session({
    secret: sessionSecret, // .env 파일에서 불러온 비밀 키 사용
    store: new FileStore(),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: isProduction, httpOnly: true, sameSite: 'lax' } // 프로덕션에서는 secure: true
}));

app.get('/search', async (req, res) => {
    const keyword = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const maxResults = 12;
    const orderBy = req.query.orderBy || 'relevance'; // 'relevance' or 'newest'
    const startIndex = (page - 1) * maxResults;

    if (!keyword) {
        return res.status(400).json({ message: '검색어를 입력하세요.' });
    }

    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${keyword}&maxResults=${maxResults}&startIndex=${startIndex}&orderBy=${orderBy}&country=JP&key=${apiKey}`;

    try {
        const apiResponse = await fetch(apiUrl);
        const data = await apiResponse.json();
        res.json(data);
    } catch (error) {
        console.error('API 요청 오류:', error);
        res.status(500).json({ message: '서버에서 오류가 발생했습니다.' });
    }
});

// --- Favorites (My List) API ---
// 메모리 내 저장을 위한 간단한 객체. 프로덕션 환경에서는 데이터베이스(예: SQLite, MongoDB) 사용을 권장합니다.
const userFavoritesStore = {}; 

// Helper function to read favorites
async function readFavorites() {
    // return userFavoritesStore;
    // 파일 기반 저장 방식을 유지하고 싶다면 이 부분을 주석 해제하고 아래 writeFavorites와 함께 사용하세요.
     try {
         const data = await fs.readFile('./favorites.json', 'utf8');
         return JSON.parse(data);
     } catch (error) {
         if (error.code === 'ENOENT') return {}; // 파일이 없으면 빈 객체 반환
         throw error;
     }
}

// Helper function to write favorites
async function writeFavorites(data) {
    // userFavoritesStore = data;
    await fs.writeFile('./favorites.json', JSON.stringify(data, null, 2));
}

// Get user's favorites
app.get('/api/mylist', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: '로그인이 필요합니다.' });
    }
    const allFavorites = await readFavorites();
    const userFavorites = allFavorites[req.session.user.id] || [];
    res.json(userFavorites);
});

// Add a book to favorites
app.post('/api/mylist', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: '로그인이 필요합니다.' });
    }
    const { bookId } = req.body;
    const allFavorites = await readFavorites();
    const userId = req.session.user.id;
    
    if (!allFavorites[userId]) allFavorites[userId] = [];
    if (!allFavorites[userId].includes(bookId)) {
        allFavorites[userId].push(bookId);
        await writeFavorites(allFavorites);
    }
    res.status(200).json(allFavorites[userId]);
});

// Remove a book from favorites
app.delete('/api/mylist/:bookId', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: '로그인이 필요합니다.' });
    }
    const { bookId } = req.params;
    const allFavorites = await readFavorites();
    const userId = req.session.user.id;

    if (allFavorites[userId]) {
        allFavorites[userId] = allFavorites[userId].filter(id => id !== bookId);
        await writeFavorites(allFavorites);
    }
    res.status(200).json(allFavorites[userId] || []);
});

// --- API for book details ---
app.get('/api/book/:bookId', async (req, res) => {
    const { bookId } = req.params;
    const apiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`;
    try {
        const apiResponse = await fetch(apiUrl);
        const data = await apiResponse.json();
        res.json(data);
    } catch (error) {
        console.error('Book details API request error:', error);
        res.status(500).json({ message: 'Error fetching book details.' });
    }
});

app.post('/auth/google/callback', async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: googleClientId,
        });
        const payload = ticket.getPayload();
        const { sub, email, name, picture } = payload;

        // 세션에 사용자 정보 저장
        req.session.user = { id: sub, email, name, picture };
        res.status(200).json(req.session.user);
    } catch (error) {
        console.error("Google token verification failed:", error);
        res.status(401).json({ message: '인증에 실패했습니다.' });
    }
});

// 클라이언트에 Google Client ID를 제공하는 엔드포인트
app.get('/api/config', (req, res) => {
    res.json({ clientId: googleClientId });
});

// 현재 로그인 상태 확인 API
app.get('/api/me', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(401).json({ message: '로그인되지 않았습니다.' });
    }
});

// 로그아웃 API
app.get('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send('Could not log out.');
        res.redirect('/');
    });
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
