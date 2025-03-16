import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NewOffer() {
  const [concepts, setConcepts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConcepts();
  }, []);

  const fetchConcepts = async () => {
    try {
      const response = await fetch('https://db.xocore.de/cart/concepts');
      if (!response.ok) {
        throw new Error('Fehler beim Laden der Konzepte');
      }
      const data = await response.json();
      const filteredConcepts = data
        .map(({ concept_id, concept_name }) => ({
          id: concept_id,
          name: concept_name,
        }))
        .filter((concept) => concept.id <= 90); // Filtert Konzepte mit id > 90 heraus
      setConcepts(filteredConcepts);
    } catch (error) {
      console.error('Fehler:', error);
    }
  };

  const handleOfferClick = (id) => {
    navigate(`/people/${id}`);
  };

  return (
    <div className="p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md mb-6"
      >
        Zurück
      </button>
      <h1 className="text-2xl font-bold mb-4">Wähle ein Konzept</h1>
      <div className="grid grid-cols-1 gap-4">
        {concepts.map((concept) => (
          <div
            key={concept.id}
            className="p-4 border rounded-lg cursor-pointer hover:bg-red-100"
            onClick={() => handleOfferClick(concept.id)}
          >
            <h2 className="text-xl font-semibold">{concept.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewOffer;
