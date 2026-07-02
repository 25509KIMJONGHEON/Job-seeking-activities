const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 채용 공고 더미 데이터
let jobPostings = [
  { id: 1, company: 'ESPEC Corp', title: '서버 인프라 및 네트워크 관리자 신입', location: '오사카', tech: ['Linux', 'Windows Server', 'AWS'], salary: '연 350만엔 ~' },
  { id: 2, company: 'AY Tech', title: '기계 부품 3D CAD 모델링 설계직', location: '오사카', tech: ['AutoCAD', 'JW CAD'], salary: '연 320만엔 ~' },
  { id: 3, company: 'Okumura-gumi', title: '건축/토목 CAD 도면 작성 및 설계 지원', location: '도쿄', tech: ['AutoCAD', 'Revit'], salary: '연 400만엔 ~' }
];

let applications = [];

app.get('/api/jobs', (req, res) => {
  res.json(jobPostings);
});

app.post('/api/apply', (req, res) => {
  const { jobId, applicantName, entrySheet } = req.body;
  if (!applicantName || !entrySheet) {
    return res.status(400).json({ message: '이름과 엔트리 시트(ES)를 모두 작성해주세요.' });
  }
  const newApplication = { id: applications.length + 1, jobId, applicantName, entrySheet, status: '서류 심사 중' };
  applications.push(newApplication);
  res.status(201).json({ message: '지원이 완료되었습니다!' });
});

app.listen(3001, () => {
  console.log('Backend server is running on http://localhost:3001');
});