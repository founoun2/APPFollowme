
import React, { useState } from 'react';
import { registerWithEmail } from '../services/firebaseUser';
const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      await registerWithEmail(email, password);
      setSuccess('Registration successful! You can now log in.');
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 animate-fade-in">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="text-4xl font-extrabold tracking-tight flex items-center justify-center">
            <span className="text-blue-700">Follow</span>
            <span className="text-sky-400">Me</span>
          </div>
          <p className="text-slate-400 text-xs font-medium mt-1 tracking-widest uppercase">Social Exchange</p>
        </div>
        <h2 className="text-center text-slate-900 font-bold text-xl mb-2">Create your account</h2>
        <p className="text-center text-slate-500 text-sm mb-8">Sign up with your email and password.</p>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
              placeholder="name@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-100">
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-500 text-sm text-center bg-green-50 p-2 rounded-lg border border-green-100">
              {success}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>Register</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
