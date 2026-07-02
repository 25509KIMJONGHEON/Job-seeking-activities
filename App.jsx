import React, { useState, useEffect } from 'react';

function App() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({ applicantName: '', entrySheet: '' });

  useEffect(() => {
    fetch('http://localhost:3001/api/jobs')
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error('Error:', err));
  }, []);

  const handleApply = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/api/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId: selectedJob.id, ...formData })
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      setSelectedJob(null);
      setFormData({ applicantName: '', entrySheet: '' });
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">MyJobNavi</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto mt-8 p-4">
        <h2 className="text-xl font-bold mb-6 border-b pb-2">신입 채용 공고</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {jobs.map(job => (
            <div key={job.id} className="bg-white border p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold">{job.title}</h3>
              <p className="text-blue-600 font-semibold mt-1">{job.company}</p>
              <div className="mt-2 text-sm text-gray-600">
                <p>근무지: {job.location}</p>
                <p>급여: {job.salary}</p>
              </div>
              <div className="mt-4 flex gap-2">
                {job.tech.map(t => (
                  <span key={t} className="bg-gray-100 px-3 py-1 rounded-full text-xs">{t}</span>
                ))}
              </div>
              <button 
                onClick={() => setSelectedJob(job)}
                className="mt-6 w-full bg-blue-500 text-white py-2 rounded"
              >
                ES 제출하기
              </button>
            </div>
          ))}
        </div>
      </main>

      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{selectedJob.company} 지원</h2>
            <form onSubmit={handleApply} className="space-y-4">
              <input 
                type="text" required placeholder="이름"
                className="w-full border p-2 rounded"
                value={formData.applicantName}
                onChange={(e) => setFormData({...formData, applicantName: e.target.value})}
              />
              <textarea 
                required rows="5" placeholder="엔트리 시트 내용"
                className="w-full border p-2 rounded"
                value={formData.entrySheet}
                onChange={(e) => setFormData({...formData, entrySheet: e.target.value})}
              ></textarea>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setSelectedJob(null)} className="bg-gray-300 px-4 py-2 rounded">취소</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">제출</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;