import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import Products from './pages/Products';
import Concept from './pages/Concept';
import Overview from './pages/Overview';
import Detailkonzept from './pages/Questions';

function App() {
  const currentStep = 0; // Beispiel für den aktuellen Schritt

  return (
    <Router>
      <div className="flex">
        <Navigation currentStep={currentStep} />
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/products" element={<Products />} />
            <Route path="/concept/:id" element={<Concept />} /> {/* Route für das Konzept */}
            <Route path="/step3" element={<div>Schritt 3 Inhalt</div>} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/questions" element={<Detailkonzept />} />

            <Route path="/step4" element={<div>Schritt 4 Inhalt</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
