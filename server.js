const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config(); // .env 파일 사용을 위해 추가
const { OAuth2Client } = require('google-auth-library');
const session = require('express-session');
const fs = require('fs').promises;
const FileStore = require('session-file-store')(session);
const sqlite3 = require('sqlite3').verbose();

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

// --- Database Setup (SQLite) ---
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        db.run('CREATE TABLE IF NOT EXISTS favorites (userId TEXT, bookId TEXT, UNIQUE(userId, bookId))');
    }
});

// --- Simple In-Memory Cache ---
const apiCache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10분

function getCache(key) {
    const record = apiCache.get(key);
    if (!record) return null;

    // TTL(Time To Live) 확인
    if (Date.now() > record.expiry) {
        apiCache.delete(key);
        return null;
    }

    return record.data;
}

function setCache(key, data) {
    apiCache.set(key, { data, expiry: Date.now() + CACHE_TTL });
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
    let keyword = req.query.q; // let으로 변경하여 수정 가능하게 함
    const page = parseInt(req.query.page) || 1;
    const maxResults = 12;
    const orderBy = req.query.orderBy || 'relevance'; // 'relevance' or 'newest'
    const category = req.query.category; // 카테고리 파라미터 추가
    const startIndex = (page - 1) * maxResults;

    if (!keyword) {
        return res.status(400).json({ message: '검색어를 입력하세요.' });
    }

    // 카테고리가 지정된 경우, 검색어에 추가합니다.
    if (category) {
        keyword = `${keyword}+subject:${category}`;
    }

    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(keyword)}&maxResults=${maxResults}&startIndex=${startIndex}&orderBy=${orderBy}&country=JP&key=${apiKey}`;

    try {
        // 1. 캐시 확인
        const cachedData = getCache(apiUrl);
        if (cachedData) {
            return res.json(cachedData);
        }

        // 2. 캐시가 없으면 API 호출
        const apiResponse = await fetch(apiUrl);
        const data = await apiResponse.json();

        // 클라이언트에 필요한 데이터만 추출하여 전송
        const optimizedData = {
            totalItems: data.totalItems,
            items: data.items ? data.items.map(item => ({
                id: item.id,
                volumeInfo: {
                    title: item.volumeInfo.title,
                    authors: item.volumeInfo.authors,
                    description: item.volumeInfo.description,
                    imageLinks: item.volumeInfo.imageLinks,
                    publisher: item.volumeInfo.publisher,
                    publishedDate: item.volumeInfo.publishedDate,
                }
            })) : []
        };

        // 3. 결과를 캐시에 저장
        setCache(apiUrl, optimizedData);

        res.json(optimizedData);
    } catch (error) {
        console.error('API 요청 오류:', error);
        res.status(500).json({ message: '서버에서 오류가 발생했습니다.' });
    }
});

// --- Favorites (My List) API ---

// Get user's favorites
app.get('/api/mylist', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: '로그인이 필요합니다.' });
    }
    const userId = req.session.user.id;
    db.all('SELECT bookId FROM favorites WHERE userId = ?', [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: '데이터베이스 조회 오류' });
        }
        const bookIds = rows.map(row => row.bookId);
        res.json(bookIds);
    });
});

// Add a book to favorites
app.post('/api/mylist', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: '로그인이 필요합니다.' });
    }
    const { bookId } = req.body;
    const userId = req.session.user.id;
    
    db.run('INSERT INTO favorites (userId, bookId) VALUES (?, ?)', [userId, bookId], function(err) {
        if (err) {
            // 이미 존재하는 경우에도 에러가 발생하지 않도록 처리 (UNIQUE 제약 조건)
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(200).send('Already exists');
            }
            return res.status(500).json({ message: '데이터베이스 추가 오류' });
        }
        res.status(201).send('Added to favorites');
    });
});

// Remove a book from favorites
app.delete('/api/mylist/:bookId', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: '로그인이 필요합니다.' });
    }
    const { bookId } = req.params;
    const userId = req.session.user.id;

    db.run('DELETE FROM favorites WHERE userId = ? AND bookId = ?', [userId, bookId], function(err) {
        if (err) {
            return res.status(500).json({ message: '데이터베이스 삭제 오류' });
        }
        res.status(200).send('Removed from favorites');
    });
});

// --- API for book details ---
app.get('/api/book/:bookId', async (req, res) => {
    const { bookId } = req.params;
    const apiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`;
    try {
        // 1. 캐시 확인
        const cachedData = getCache(apiUrl);
        if (cachedData) {
            return res.json(cachedData);
        }

        // 2. 캐시가 없으면 API 호출
        const apiResponse = await fetch(apiUrl);
        const data = await apiResponse.json();

        // 3. 결과를 캐시에 저장
        setCache(apiUrl, data);
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
