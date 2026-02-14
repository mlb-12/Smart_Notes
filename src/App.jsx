import { Routes, Route } from "react-router-dom";
import Login from "./login";
import Dashboard from "./dashboard";
import CreateNote from "./CreateNote";
import NotePage from "./NotePage";
import FlashcardsPage from "./FlashcardsPage";
import Navbar from "./Navbar";
import { motion, AnimatePresence } from "framer-motion";
import ExplorePage from "./ExplorePage";
import EditNote from "./EditNote";
import GamificationDashboard from "./GamificationDashboard";
import Leaderboard from "./Leaderboard";

import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/" && <Navbar />}

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<CreateNote />} />
            <Route path="/note/:id" element={<NotePage />} />
            <Route path="/note/:id/flashcards" element={<FlashcardsPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/edit/:id" element={<EditNote />} />
            <Route path="/gamification" element={<GamificationDashboard />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/note/:id/flashcards" element={<FlashcardsPage />} />

          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
}


export default App;


