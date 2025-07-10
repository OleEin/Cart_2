import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    // Fetch product details by ID
    fetch(`https://db.xocore.de/cart/product/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        setError('Fehler beim Laden der Produktdaten.');
        setLoading(false);
      });
  }, [id]);

  const handleInputChange = (field, value) => {
    if (product) {
      const updatedProduct = { ...product, [field]: value };
      setProduct(updatedProduct);
      console.log(updatedProduct)

      // Save changes to the backend
      fetch(`https://db.xocore.de/cart/offer/product/edit/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Fehler beim Speichern der Daten.');
          }
        })
        .catch(() => {
          setError('Fehler beim Speichern des Feldes.');
        });
    }
  };

  if (loading) return <div className="p-4">Lade Produktdaten...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md mb-6"
      >
        Zurück
      </button>

      <h1 className="text-3xl font-bold mb-4">Produkt bearbeiten</h1>

      <div className="space-y-4">
        {product && (
          <>
            {/* Produktname */}
            <div>
              <label className="block text-sm font-medium mb-1">Produktname</label>
              <input
                type="text"
                className="p-2 border rounded-md w-full"
                value={product.product_name}
                onChange={(e) => handleInputChange('product_name', e.target.value)}
              />
            </div>

            {/* Produktpreis */}
            <div>
              <label className="block text-sm font-medium mb-1">Produktpreis (€)</label>
              <input
                type="number"
                className="p-2 border rounded-md w-full"
                value={product.product_price}
                onChange={(e) => handleInputChange('product_price', e.target.value)}
              />
            </div>

            {/* Seminarzeit */}
            <div>
              <label className="block text-sm font-medium mb-1">Seminarzeit</label>
              <input
                type="number"
                className="p-2 border rounded-md w-full"
                value={product.product_duration_seminar}
                onChange={(e) => handleInputChange('product_duration_seminar', e.target.value)}
              />
            </div>

            {/* Coachingzeit */}
            <div>
              <label className="block text-sm font-medium mb-1">Coachingzeit</label>
              <input
                type="number"
                className="p-2 border rounded-md w-full"
                value={product.product_duration_coaching}
                onChange={(e) => handleInputChange('product_duration_coaching', e.target.value)}
              />
            </div>

            {/* Consultingzeit */}
            <div>
              <label className="block text-sm font-medium mb-1">Consultingzeit</label>
              <input
              disabled
                type="number"
                className="p-2 border rounded-md w-full"
                value={product.product_duration_consulting}
                onChange={(e) => handleInputChange('product_duration_consulting', e.target.value)}
              />
            </div>

            {/* Produktgruppe */}
            <div>
              <label className="block text-sm font-medium mb-1">Produktgruppe</label>
              <input
              disabled
                type="number"
                className="p-2 border rounded-md w-full"
                value={product.product_group}
                onChange={(e) => handleInputChange('product_group', e.target.value)}
              />
            </div>

            {/* Beschreibung */}
            <div>
              <label className="block text-sm font-medium mb-1">Beschreibung</label>
              <textarea
                className="p-2 border rounded-md w-full"
                value={product.product_description}
                onChange={(e) => handleInputChange('product_description', e.target.value)}
              />
            </div>

            {/* Ziel */}
            <div>
              <label className="block text-sm font-medium mb-1">Ziel</label>
              <textarea
                className="p-2 border rounded-md w-full"
                value={product.product_goal}
                onChange={(e) => handleInputChange('product_goal', e.target.value)}
              />
            </div>

            {/* Inhalt */}
            <div>
              <label className="block text-sm font-medium mb-1">Inhalt</label>
              <textarea
              
                className="p-2 border rounded-md w-full"
                value={product.product_inhalt}
                onChange={(e) => handleInputChange('product_inhalt', e.target.value)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default EditProduct;
