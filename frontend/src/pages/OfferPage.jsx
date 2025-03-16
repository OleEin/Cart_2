import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
  const { offerid } = useParams();
  const navigate = useNavigate();

  const handleOfferClick = async (id) => {
    try {
      const response = await fetch(`https://db.xocore.de/cart/offer/way/${offerid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wayid: id }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Senden der Anfrage');
      }

      navigate(`/loading/${offerid}`);
    } catch (error) {
      console.error('Fehler:', error);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl text-center font-extrabold mb-6">Wähle deinen Weg aus</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white border border-gray-200 rounded-lg shadow-md p-6 cursor-pointer hover:bg-gray-100 transition duration-300"
            onClick={() => handleOfferClick(offer.id)}
          >
            <h2 className="text-xl font-bold text-red-500">{offer.name}</h2>
            <p className="text-gray-700 mt-2">{offer.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OfferPage;
