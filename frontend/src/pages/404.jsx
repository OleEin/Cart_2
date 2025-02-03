import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-6">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Seite nicht gefunden - Funktion ausstehend</h2>
      <p className="mt-4 text-lg text-gray-700">Die von dir angeforderte Funktion ist in Arbeit.</p>
      <Link to="/Admin" className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
        Zur Startseite
      </Link>
    </div>
  );
}

export default NotFound;
