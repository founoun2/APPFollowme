import React, { useState } from 'react';
import { signOutUser } from '../services/firebaseUser';

const LogoutButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signOutUser();
      // Optionally redirect or show success
    } catch (err: any) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-xl shadow transition-all active:scale-95"
      >
        {isLoading ? 'Logging out...' : 'Logout'}
      </button>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </div>
  );
};

export default LogoutButton;
