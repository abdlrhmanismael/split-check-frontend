import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Landing from "@/pages/Landing";
import CreateSession from "@/pages/CreateSession";
import JoinPage from "@/pages/JoinPage";
import JoinSession from "@/pages/JoinSession";
import SessionSummary from "@/pages/SessionSummary";
import Footer from "@/components/Footer";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/create" element={<CreateSession />} />
            <Route path="/join" element={<JoinPage />} />
            <Route path="/session/:sessionId" element={<JoinSession />} />
            <Route path="/summary/:sessionId" element={<SessionSummary />} />
          </Routes>
          <Toaster />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
