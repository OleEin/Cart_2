import React from 'react';
import { useNavigate } from 'react-router-dom';

const offers = [
  {
    id: 1,
    name: 'Basis',
    price: 1000,
    description: 'Dies ist das Basisangebot, ideal für den Einstieg.',
  },
  {
    id: 2,
    name: 'Standard',
    price: 2000,
    description: 'Das Standardangebot für fortgeschrittene Bedürfnisse.',
  },
  {
    id: 3,
    name: 'Premium',
    price: 3000,
    description: 'Unser Premiumangebot mit allen Funktionen und mehr.',
  },
];

function OfferPage() {
  const navigate = useNavigate();

  const handleOfferClick = (id) => {
    navigate(`/firma/${id}`);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl text-center font-extrabold mb-6">Wähle dein Angebot aus</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white border border-gray-200 rounded-lg shadow-md p-6 cursor-pointer hover:bg-gray-100 transition duration-300"
            onClick={() => handleOfferClick(offer.id)}
          >
            <h2 className="text-2xl font-semibold text-gray-900">{offer.name}</h2>
            <p className="text-xl font-bold text-red-500">{offer.price} EUR</p>
            <p className="text-gray-700 mt-2">{offer.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OfferPage;
