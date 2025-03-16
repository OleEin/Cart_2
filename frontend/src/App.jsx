import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import Products from './pages/Products';
import Concept from './pages/Concept';
import Overview from './pages/Overview';
import CompanyAndQuestionsForm from './pages/kombifirmquest';
import CompanyPeople from './pages/Personal';
import LoadingScreen from './pages/loading';
import OfferPage from './pages/OfferPage';
import Concepts from'./pages/Concepts';
import AllOrders from './pages/Offers';
import OfferEditDetails from './pages/EditOfferPositions';
import AdminPage from './pages/HomeAdmin';
import NotFound from './pages/404';
import AllProducts from './pages/EditProducts';
import EditProduct from './pages/EditProduct';
import NewOffer from './pages/NewOffer';
import CookiePlace from './pages/placecookie';

function App() {
  const currentStep = 0; // Beispiel für den aktuellen Schritt

  return (
    <Router>
      <div className="flex">
        {/* <Navigation currentStep={currentStep} /> */}
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/products" element={<Products />} />
            <Route path="/concept/:id" element={<Concept />} /> {/* Route für das Konzept */}
            <Route path="/concepts" element={<Concepts />} /> {/* Route für das Konzept */}

            <Route path="/overview" element={<Overview />} />
            <Route path="/overview/:id" element={<Overview />} />

            <Route path="/firmA" element={<CompanyAndQuestionsForm/>}/>

            <Route path="/people" element={<CompanyPeople/>}/>
            <Route path="/firma/:id" element={<CompanyAndQuestionsForm/>}/>
            <Route path="/offers/:offerid" element={<OfferPage/>}/>
            <Route path="/step3/:offerid" element={<OfferPage/>} />        
            <Route path="/loading/:id" element={<LoadingScreen/>}/>


            <Route path="/Admin" element={<AdminPage/>}/>


            <Route path="/ad/welcome" element={<AdminPage/>}/>
            <Route path="/1650160165016516848515156165131321304501650165056" element={<CookiePlace/>}/>


            <Route path="/Admin" element={<AdminPage/>}/>
            <Route path="/admin/alloffers" element={<AllOrders/>}/>
            <Route path="/admin/newoffer" element={<NewOffer/>}/>
            <Route path="/admin/product" element={<NotFound/>}/>


            <Route path="/admin/offer/edit/:id" element={<OfferEditDetails/>}/>
            <Route path="/admin/products/" element={<AllProducts/>}/>
            <Route path="/admin/product/edit/:id" element={<EditProduct/>}/>

            <Route path="/people/:id" element={<CompanyPeople/>}/>



            <Route path="/step4" element={<div>Schritt 4 Inhalt</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
