import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BoardPage from "./pages/BoardPage";
import SettingsPage from "./pages/SettingsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ActivityPage from "./pages/ActivityPage";
import CommentsPage from "./pages/CommentsPage";
import AdminPanel from "./pages/AdminPanel";
import ProjectsPage from "./pages/ProjectsPage";
import SubTaskPage from "./pages/SubTaskPage";
import ManagerPanel from "./pages/ManagerPanel";
import MeetingsPage from "./pages/MeetingsPage";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
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
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminPanel />
    </ProtectedRoute>
  }
/>

<Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectsPage />
            </ProtectedRoute>
          }
        />

        <Route
  path="/subtasks/:taskId"
  element={
    <ProtectedRoute>
      <SubTaskPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/manager"
  element={
    <ProtectedRoute>
      <ManagerPanel />
    </ProtectedRoute>
  }
/>
<Route
  path="/meetings"
  element={
    <ProtectedRoute>
      <MeetingsPage />
    </ProtectedRoute>
  }
/>
        <Route
          path="/board"
          element={
            <ProtectedRoute>
              <BoardPage />
            </ProtectedRoute>
          }
        />
        <Route
  path="/comments"
  element={<CommentsPage />}
/>
        <Route path="/activity" element={<ActivityPage />} />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
