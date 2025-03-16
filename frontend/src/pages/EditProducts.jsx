import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // falls du React Router verwendest

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;

}



function AllProducts() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConcept, setSelectedConcept] = useState('');
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const logID = getCookie("LogID");


  const navigate = useNavigate(); // Nutzung von React Router's `useNavigate`


  useEffect(() => {
    const logID = getCookie("LogID");

    if (!logID) {
      // Wenn der Cookie nicht gesetzt ist, weiterleiten
      navigate('/admin/product');
    }
  }, [navigate]);

  useEffect(() => {
    fetch('https://db.xocore.de/cart/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  useEffect(() => {
    let results = products;

    if (searchTerm) {
      results = results.filter(product =>
        product.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedConcept) {
      results = results.filter(product =>
        String(product.product_group) === String(selectedConcept)
      );
    }

    setFilteredOffers(results);
  }, [products, searchTerm, selectedConcept]);

  const openDeleteModal = (product) => {
    setSelectedOffer(product);
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    if (!selectedOffer) return;

    fetch(`https://db.xocore.de/cart/offer/del/${selectedOffer.id}`, {
      method: 'POST',
    })
      .then(() => {
        setProducts(products.filter(product => product.id !== selectedOffer.id));
        setIsModalOpen(false);
        setSelectedOffer(null);
      })
      .catch(error => console.error('Error deleting product:', error));
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Produkte</h1>
<h1>{logID}</h1>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Nach Produkt suchen..."
          className="p-2 border rounded-md w-72"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="p-2 border rounded-md"
          value={selectedConcept}
          onChange={(e) => setSelectedConcept(e.target.value)}
        >
          <option value="">Konzept filtern</option>
          {[...new Set(products.map(product => product.product_group).filter(Boolean))].map(concept => (
            <option key={concept} value={concept}>{concept}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Produktname</th>
              <th className="p-2 text-left">Produktpreis</th>
              <th className="p-2 text-left">Seminarzeit</th>
              <th className="p-2 text-left">Coachingzeit</th>
              <th className="p-2 text-center">Attribut</th>
              <th className="p-2 text-left">Aktion</th>
            </tr>
          </thead>
          <tbody>
            {filteredOffers.length > 0 ? (
              filteredOffers.map(product => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{product.product_name} ({product.product_id})</td>
                  <td className="p-2">{product.product_price} €</td>
                  <td className="p-2">{product.product_duration_seminar}</td>
                  <td className="p-2">{product.product_duration_coaching}</td>
                  <td className="p-2">{product.product_group}</td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => window.location.href = `/admin/product/edit/${product.product_id}`}
                      className="text-blue-500 hover:text-blue-700 mr-3"
                    >
                      <FaEdit size={18} />
                    </button>
                    {/* <button
                      // onClick={() => openDeleteModal(product)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash size={18} />
                    </button> */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-600">
                  Keine Produkte gefunden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Wirklich löschen?</h2>
            <p className="text-gray-600 mb-6">
              Möchten Sie das Produkt "{selectedOffer?.product_name}" wirklich löschen?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                Abbrechen
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllProducts;
