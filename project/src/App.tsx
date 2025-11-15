import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ClassifyPage } from './pages/ClassifyPage';
import { ResultPage } from './pages/ResultPage';
import { ComplaintPage } from './pages/ComplaintPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GeolocationProvider } from './contexts/GeolocationContext';

function App() {
  return (
    <ErrorBoundary>
      <GeolocationProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/classify" element={<ClassifyPage />} />
                <Route path="/result" element={<ResultPage />} />
                <Route path="/complaint" element={<ComplaintPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </GeolocationProvider>
    </ErrorBoundary>
  );
}

export default App;
