import React, { useEffect, useState } from 'react';

function Products() {
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);

  useEffect(() => {
    fetch('https://db.xocore.de/cart/products')
      .then(response => response.json())
      .then(data => setOffers(data))
      .catch(error => console.error('Error fetching offers:', error));
  }, []);

  const handleOpenModal = (offer) => {
    setSelectedOffer(offer);
  };

  const handleCloseModal = () => {
    setSelectedOffer(null);
  };

  // Helper function to convert minutes to whole days
  const convertMinutesToDays = (minutes) => {
    return Math.floor(minutes / 360); // Whole days only
  };

  // Helper function to get category color
  const getCategoryColor = (group) => {
    switch (group) {
      case 0:
        return 'bg-blue-500'; // Wissen (Knowledge)
      case 1:
        return 'bg-green-500'; // Menschlichkeit (Humanity)
      case 2:
        return 'bg-yellow-500'; // Geschick (Skill)
      case 3:
        return 'bg-red-500'; // Mut (Courage)
      default:
        return 'bg-gray-500'; // Default color
    }
  };

  // Helper function to get category name
  const getCategoryName = (group) => {
    switch (group) {
      case 0:
        return 'Wissen';
      case 1:
        return 'Menschlichkeit';
      case 2:
        return 'Geschick';
      case 3:
        return 'Mut';
      default:
        return 'Unbekannt';
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6">Unsere Produkte</h1>
      <div className="grid grid-cols-1 gap-4">
        {offers.map(offer => (
          <div
            key={offer.product_id}
            className="bg-white border border-gray-200 rounded-lg shadow-md p-6 flex flex-col relative"
          >
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold text-gray-900">{offer.product_name}</h2>
              <span className="text-lg font-bold text-gray-600">{`${offer.product_price} EUR`}</span>
            </div>
            <p className="text-gray-700 mt-2">
              {offer.product_description || 'Keine Beschreibung verfügbar.'}
            </p>
            <div className="flex items-center mt-2">
              <span
                className={`inline-block text-white text-xs font-semibold py-1 px-2 rounded-full ${getCategoryColor(offer.product_group)}`}
              >
                {getCategoryName(offer.product_group)}
              </span>
            </div>
            <div className="flex justify-end mt-auto">
              <button
                onClick={() => handleOpenModal(offer)}
                className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
              >
                Mehr erfahren
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8 max-w-3xl w-full relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl"
            >
              &times;
            </button>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold">{selectedOffer.product_name}</h2>
              <span
                className={`inline-block text-white text-xs font-semibold py-1 px-2 rounded-full ${getCategoryColor(selectedOffer.product_group)}`}
              >
                {getCategoryName(selectedOffer.product_group)}
              </span>
            </div>
            <p className="text-gray-700 mb-4">
              {selectedOffer.product_description_long || 'Keine lange Beschreibung verfügbar.'}
            </p>

            <h3 className="text-xl font-semibold mt-4 mb-2">Ziel der Maßnahme</h3>
            <p className="text-gray-700 mb-4">
              {selectedOffer.product_description_long || 'Keine lange Beschreibung verfügbar.'}
            </p>
            
            <div className="flex flex-col md:flex-row justify-between mt-4">
              <div className="w-full md:w-1/2">
                <div className="flex items-center mb-4">
                  <h3 className="text-xl font-semibold mr-2 flex items-center">
                    Umfang und Methode
                    <span className="ml-2 text-gray-500 cursor-pointer relative group">
                      <i className="fas fa-question-circle text-gray-500"></i>
                      <span className="absolute left-0 bottom-full mb-2 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        To be defined
                      </span>
                    </span>
                  </h3>
                </div>
                <p className="text-gray-500">
                  Seminartage: {convertMinutesToDays(selectedOffer.product_duration_seminar)} Tage
                </p>
                <p className="text-gray-500">
                  Coachingtage: {convertMinutesToDays(selectedOffer.product_duration_coaching)} Tage
                </p>
                <p className="text-gray-500">
                  Trainingtage: {convertMinutesToDays(selectedOffer.product_duration_training)} Tage
                </p>
              </div>
              <div className="w-full md:w-1/2 mt-4 md:mt-0 md:ml-4">
                <h3 className="text-xl font-semibold mb-2">Seminar & Coachinginhalt</h3>
                <ul className="list-disc list-inside text-gray-700">
                  <li>Platzhalter 1</li>
                  <li>Platzhalter 2</li>
                  <li>Platzhalter 3</li>
                  <li>Platzhalter 4</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
