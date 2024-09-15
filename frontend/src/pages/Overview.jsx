import React, { useEffect, useState } from 'react';

function Overview() {
  const [positions, setPositions] = useState([]);
  const [products, setProducts] = useState({});

  useEffect(() => {
    // Fetch offer positions
    fetch('https://db.xocore.de/cart/offers/positions')
      .then(response => response.json())
      .then(data => setPositions(data))
      .catch(error => console.error('Error fetching positions:', error));
  }, []);

  useEffect(() => {
    // Fetch the product data for each position's product ID
    positions.forEach(position => {
      fetch(`https://db.xocore.de/cart/products/${position.positions_product_id}`)
        .then(response => response.json())
        .then(productData => {
          setProducts(prevProducts => ({
            ...prevProducts,
            [position.positions_product_id]: productData,
          }));
        })
        .catch(error => console.error('Error fetching product data:', error));
    });
  }, [positions]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6">Angebotsübersicht</h1>
      <div className="grid grid-cols-1 gap-4">
        {positions.map(position => {
          const product = products[position.positions_product_id];
          return product ? (
            <div
              key={position.positions_id}
              className="bg-white border border-gray-200 rounded-lg shadow-md p-6 flex flex-col relative"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-gray-900">{position.positions_product_name}</h2>
                <span className="text-lg font-bold text-gray-600">{`${position.positions_product_price} EUR`}</span>
              </div>
              <p className="text-gray-700 mt-2">
                Menge: {position.positions_product_quantity}
              </p>
              <p className="text-gray-700 mt-2">
                Gesamtsumme: {position.product_price_sum} EUR
              </p>
              <p className="text-gray-700 mt-2">
                Anzahl der Personen: {position.positions_person}
              </p>
            </div>
          ) : (
            <div key={position.positions_id} className="bg-gray-100 p-4 rounded-lg">
              Lade Produktdaten...
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Overview;
