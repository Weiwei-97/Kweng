import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, Check, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
];

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, signIn, signUp } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (authMode === 'signin') {
      signIn(email, name || email.split('@')[0]);
    } else {
      signUp(name || 'New Reader', email, selectedAvatar);
    }
  };

  const handleDemoLogin = () => {
    signIn('jinwoo@kweng.io', 'Jin Woo');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-7 space-y-5">
        
        {/* Close button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand header */}
        <div className="text-center space-y-1.5">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-base text-white mx-auto shadow">
            KW
          </div>
          <h2 className="text-lg font-bold text-white tracking-wide">
            {authMode === 'signin' ? 'Welcome Back to Kweng' : 'Create Your Kweng Account'}
          </h2>
          <p className="text-xs text-slate-400">
            {authMode === 'signin'
              ? 'Sign in to access synchronized bookmarks and reading progress'
              : 'Join thousands of manhwa and web novel readers worldwide'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setAuthMode('signin')}
            className={`py-1.5 rounded-md transition-all ${
              authMode === 'signin'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthMode('signup')}
            className={`py-1.5 rounded-md transition-all ${
              authMode === 'signup'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          {authMode === 'signup' && (
            <>
              {/* Avatar Selector */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium block">Choose Reader Avatar:</label>
                <div className="flex items-center justify-center gap-2 py-1">
                  {AVATAR_PRESETS.map((avatar) => (
                    <img
                      key={avatar}
                      src={avatar}
                      alt="avatar"
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`w-9 h-9 rounded-lg object-cover cursor-pointer transition-all ${
                        selectedAvatar === avatar
                          ? 'ring-2 ring-indigo-500 scale-105'
                          : 'opacity-50 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium block">Reader Nickname</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sung Min-Woo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-slate-300 font-medium block">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                placeholder="reader@kweng.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-medium block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow transition-all text-xs"
          >
            {authMode === 'signin' ? 'Sign In to Kweng' : 'Create Account & Start Reading'}
          </button>
        </form>

        {/* Demo Fast Login */}
        <div className="pt-2 border-t border-slate-800 text-center space-y-2">
          <p className="text-[11px] text-slate-400">Want to test reader features immediately?</p>
          <button
            onClick={handleDemoLogin}
            className="w-full py-2 px-3 rounded-md bg-slate-800 hover:bg-slate-700 text-indigo-400 font-semibold text-xs border border-indigo-800/40 transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Demo Sign-In (Jin Woo)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
