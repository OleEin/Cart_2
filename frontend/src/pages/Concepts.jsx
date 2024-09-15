import React, { useEffect, useState } from 'react';

function Offers() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    fetch('https://db.xocore.de/cart/offers')
      .then(response => response.json())
      .then(data => setOffers(data))
      .catch(error => console.error('Error fetching offers:', error));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Offers</h1>
      <ul>
        {offers.map(offer => (
          <li key={offer.id} className="border p-2 my-2">
            {offer.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Offers;
