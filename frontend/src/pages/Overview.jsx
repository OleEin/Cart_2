import React, { useEffect, useState } from 'react';

function Overview() {
  const [positions, setPositions] = useState([]);
  const [products, setProducts] = useState({});
  const [totalSum, setTotalSum] = useState(0);


  useEffect(() => {
    // Fetch offer positions
    fetch('https://db.xocore.de/cart/offer/positions/1')
      .then(response => response.json())
      .then(data => {
        setPositions(data);

        // Convert product_price_sum to numbers and calculate the total sum
        const sum = data.reduce((acc, position) => {
          const priceSum = parseFloat(position.product_price_sum) || 0; // Convert to number, default to 0 if NaN
          return acc + priceSum;
        }, 0);

        setTotalSum(sum);
      })
      .catch(error => console.error('Error fetching positions:', error));
  }, []);

  useEffect(() => {
    // Fetch the product data for each position's product ID
    positions.forEach(position => {
      fetch(`https://db.xocore.de/cart/product/${position.positions_product_id}`)
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

  const handlePrint = () => {
    window.print();
  };


  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold">Angebotsübersicht</h1>
        <button 
          onClick={handlePrint} 
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600">
          Angebot drucken
        </button>
      </div>
      
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
                <span className="text-lg font-bold text-gray-600">{`${position.product_price_sum} EUR`}</span>
              </div>
              <p className="text-gray-700 mt-2">
                Menge: {position.positions_product_quantity}
              </p>
              <p className="text-gray-700 mt-2">
                Tagessatz: {position.positions_product_price} EUR
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

      <div className="mt-6 text-lg font-bold text-gray-900">
        Gesamtsumme: {totalSum.toFixed(2)} EUR
      </div>
    </div>
  );
}

export default Overview;