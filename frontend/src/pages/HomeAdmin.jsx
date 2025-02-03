import { FaList, FaPlus, FaCogs } from 'react-icons/fa'; // Importiere die Icons von react-icons/fa
import { Link } from 'react-router-dom'; // Importiere Link für die Navigation

function AdminPage() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Admin Ansicht</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Alle Angebote */}
        <div className="bg-white border border-gray-200 rounded-lg shadow p-6 text-center">
          <FaList className="text-4xl mb-4 text-gray-700" />
          <h2 className="text-xl font-semibold">Alle Angebote</h2>
          <p className="mt-2">Übersicht aller Angebote verwalten</p>
          <Link to="/admin/alloffers">
            <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Ansehen
            </button>
          </Link>
        </div>

        {/* Neues Angebot */}
        <div className="bg-white border border-gray-200 rounded-lg shadow p-6 text-center">
          <FaPlus className="text-4xl mb-4 text-green-600" />
          <h2 className="text-xl font-semibold">Neues Angebot</h2>
          <p className="mt-2">Ein neues Angebot erstellen</p>
          <Link to="/admin/newoffer">
            <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
              Erstellen
            </button>
          </Link>
        </div>

        {/* Produktverwaltung */}
        <div className="bg-white border border-gray-200 rounded-lg shadow p-6 text-center">
          <FaCogs className="text-4xl mb-4 text-yellow-600" />
          <h2 className="text-xl font-semibold">Produktverwaltung</h2>
          <p className="mt-2">Produkte verwalten und anpassen</p>
          <Link to="/admin/products">
            <button className="mt-4 bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700">
              Verwalten
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
