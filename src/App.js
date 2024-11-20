import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/LoginPage/Login.jsx';
import Signup from './pages/SignupPage/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Rooms from './pages/Rooms.jsx';
import ChatRoom from './pages/ChatRoom.jsx';
import HomePage from './pages/HomePage'; // Import HomePage
import Admin from './pages/AdminPage/Admin.jsx';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/ProfilePage/Profile.jsx';
import Settings from './pages/SettingsPage/Settings.jsx';
import ContactPage from './pages/ContactPage/ContactPage.jsx';
import RoomInfo from './pages/RoomInfoPage/RoomInfo.jsx';
import DMPage from './pages/DMPage/dmpage.jsx';
import PDFViewer from './pages/pdfpage.jsx';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/room/:roomId" element={<ChatRoom />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/dmpage" element={<DMPage />} />
        <Route path="/pdf" element={<PDFViewer />} />
        <Route path="/roominfo/:roomId" element={<RoomInfo />} /> {/* Add this line */}
      </Routes>
    </Router>
  );
}

export default App;
