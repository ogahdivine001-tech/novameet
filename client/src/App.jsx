import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateMeeting from './pages/CreateMeeting';
import JoinMeeting from './pages/JoinMeeting';
import MeetingRoom from './pages/MeetingRoom';
import ScheduleMeeting from './pages/ScheduleMeeting';
import Meetings from './pages/Meetings';
import MeetingHistory from './pages/MeetingHistory';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/meetings"
        element={
          <ProtectedRoute>
            <Meetings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/meetings/create"
        element={
          <ProtectedRoute>
            <CreateMeeting />
          </ProtectedRoute>
        }
      />
      <Route
        path="/meetings/join"
        element={
          <ProtectedRoute>
            <JoinMeeting />
          </ProtectedRoute>
        }
      />
      <Route
        path="/meetings/schedule"
        element={
          <ProtectedRoute>
            <ScheduleMeeting />
          </ProtectedRoute>
        }
      />
      <Route
        path="/meetings/history"
        element={
          <ProtectedRoute>
            <MeetingHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/meeting/:meetingId"
        element={
          <ProtectedRoute>
            <MeetingRoom />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
