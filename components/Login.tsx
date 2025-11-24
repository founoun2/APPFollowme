
import React, { useState } from 'react';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { signInWithEmail, signInWithGoogle } from '../services/firebaseUser';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await signInWithEmail(email, password);
      // Optionally redirect or show success
    } catch (err: any) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      // Optionally redirect or show success
    } catch (err: any) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 animate-fade-in">
        
        {/* Logo */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="text-4xl font-extrabold tracking-tight flex items-center justify-center">
            <span className="text-blue-700">Follow</span>
            <span className="text-sky-400">Me</span>
          </div>
          <p className="text-slate-400 text-xs font-medium mt-1 tracking-widest uppercase">Social Exchange</p>
        </div>

        <h2 className="text-center text-slate-900 font-bold text-xl mb-2">Welcome back</h2>
        <p className="text-center text-slate-500 text-sm mb-8">Enter your details to access your account.</p>

        {/* Google Button */}
        <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium py-3 rounded-xl transition-all mb-6"
        >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
        </button>

        <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-400">Or continue with email</span>
            </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                        placeholder="name@company.com"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            {error && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-100">
                    {error}
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
                    <>Sign In <ArrowRight className="w-5 h-5" /></>
                )}
            </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
