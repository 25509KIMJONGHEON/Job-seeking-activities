import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

// 🚨 중요: 이 ID는 실제 동작하지 않는 예시입니다.
// Google Cloud Console에서 발급받은 본인의 클라이언트 ID로 교체해야 합니다.
const googleClientId = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
