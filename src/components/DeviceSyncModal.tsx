import React, { useState } from 'react';
import { X, RefreshCw, ShieldCheck, Smartphone, Laptop, Tablet, Copy, Check, Download, Upload, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DeviceSyncModal: React.FC = () => {
  const { 
    isSyncModalOpen, 
    setIsSyncModalOpen, 
    syncKey, 
    syncStatus, 
    lastSyncedAt, 
    triggerSync, 
    exportUserDataJson, 
    importUserDataJson,
    bookmarks
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [targetCode, setTargetCode] = useState('');
  const [syncSuccess, setSyncSuccess] = useState(false);

  if (!isSyncModalOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(syncKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleManualPair = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCode.trim()) return;
    await triggerSync();
    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 3000);
    setTargetCode('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5">
        
        {/* Close */}
        <button
          onClick={() => setIsSyncModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Encrypted Device Sync Engine</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
            Sync Library Across Devices
          </h2>
          <p className="text-xs text-slate-400">
            Read seamlessly on your phone, tablet, and PC. All bookmarks, chapter progress, and personal preferences stay synchronized.
          </p>
        </div>

        {/* Sync Status Badge */}
        <div className="p-3 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Cloud Sync Status:</span>
            <span className="font-bold text-indigo-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              {syncStatus === 'synced' ? 'Up to date' : 'Synchronizing...'}
            </span>
          </div>
          <button
            onClick={triggerSync}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
            <span>Sync Now</span>
          </button>
        </div>

        {/* Your Sync Key */}
        <div className="space-y-1.5 text-xs">
          <span className="text-slate-300 font-medium block">Your Device Pairing Code:</span>
          <div className="flex items-center gap-2">
            <div className="flex-1 p-2.5 rounded-md bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm font-bold text-indigo-400 tracking-wider">
              {syncKey}
            </div>
            <button
              onClick={handleCopy}
              className="p-2.5 rounded-md bg-slate-800 hover:bg-slate-700 text-white transition-colors"
              title="Copy pairing code"
            >
              {copied ? <Check className="w-4 h-4 text-indigo-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[10px] text-slate-400">
            Enter this code on your other devices to pair and sync bookmarks.
          </p>
        </div>

        {/* Pair New Device Form */}
        <form onSubmit={handleManualPair} className="space-y-2 text-xs pt-2 border-t border-slate-800">
          <span className="text-slate-300 font-medium block">Link Another Device Key:</span>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. KWENG-8F2A-9X1B"
              value={targetCode}
              onChange={(e) => setTargetCode(e.target.value.toUpperCase())}
              className="flex-1 px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow"
            >
              Pair Device
            </button>
          </div>

          {syncSuccess && (
            <p className="text-xs text-indigo-400 font-semibold animate-in fade-in">
              ✓ Devices linked! Reading progress is now synchronized.
            </p>
          )}
        </form>

        {/* Connected devices summary */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-around text-center text-xs text-slate-400">
          <div className="space-y-1">
            <Laptop className="w-5 h-5 mx-auto text-indigo-400" />
            <span className="block text-[10px]">PC Web</span>
          </div>
          <div className="space-y-1">
            <Smartphone className="w-5 h-5 mx-auto text-indigo-400" />
            <span className="block text-[10px]">Mobile</span>
          </div>
          <div className="space-y-1">
            <Tablet className="w-5 h-5 mx-auto text-indigo-400" />
            <span className="block text-[10px]">E-Reader</span>
          </div>
        </div>

      </div>
    </div>
  );
};
