import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Books from "./pages/Books";
import AddBook from "./pages/AddBook";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/student/dashboard" element={<StudentDashboard />} />

      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      <Route path="/books" element={<Books />} />

      <Route path="/add-book" element={<AddBook />} />

      <Route path="/profile" element={<Profile />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;