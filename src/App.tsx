import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Guitar, Music, BookOpen, Activity, FileText, MessageCircleQuestion } from 'lucide-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Lessons from './pages/Lessons';
import Exercises from './pages/Exercises';
import Progress from './pages/Progress';
import Resources from './pages/Resources';
import FAQ from './pages/FAQ';
import Auth from './pages/Auth';
import { useAuthStore } from './stores/authStore';

function App() {
  const { session } = useAuthStore();

  if (!session) {
    return <Auth />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;