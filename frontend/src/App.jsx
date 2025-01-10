import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import Products from './pages/Products';
import Concept from './pages/Concept';
import Overview from './pages/Overview';
import CompanyAndQuestionsForm from './pages/kombifirmquest';
import CompanyPeople from './pages/Personal';
import LoadingScreen from './pages/loading';

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
            <Route path="/overview" element={<Overview />} />
            <Route path="/firmA" element={<CompanyAndQuestionsForm/>}/>
            <Route path="/firma/:id" element={<CompanyAndQuestionsForm/>}/>

            <Route path="/people" element={<CompanyPeople/>}/>
            <Route path="/loading/:id" element={<LoadingScreen/>}/>

            <Route path="/people/:id" element={<CompanyPeople/>}/>



            <Route path="/step3" element={<div>Schritt 3 Inhalt</div>} />
            <Route path="/step4" element={<div>Schritt 4 Inhalt</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
