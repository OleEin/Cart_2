import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const LoadingScreen = () => {
  const { id } = useParams(); // Holen der ID aus den URL-Parametern
  const navigate = useNavigate(); // Zum Navigieren auf eine andere Seite

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Zufallszahl zwischen 0 und 5 Sekunden
    const randomDelay = Math.floor(Math.random() * 5000) + 10000; // 10 bis 15 Sekunden

    // Timeout für das Laden
    const timer = setTimeout(() => {
      setLoading(false);
      navigate(`/summary/${id}`); // Weiterleitung nach der Ladezeit
    }, randomDelay);

    // Aufräumen des Timers, wenn die Komponente unmontiert wird
    return () => clearTimeout(timer);
  }, [id, navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      {loading ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full border-t-4 border-red-500 w-16 h-16 border-solid"></div>
          <p className="text-xl text-gray-700">Wir planen Deine Bildungsreise, bitte warten...</p>
        </div>
      ) : (
        <p className="text-xl text-gray-700">Weiterleitung...</p>
      )}
    </div>
  );
};

export default LoadingScreen;
