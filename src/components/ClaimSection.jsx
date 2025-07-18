import React, { useState } from 'react';
import { Gift, Sparkles, Loader2, CheckCircle } from 'lucide-react';

export default function ClaimSection({ selectedUser, onClaim, disabled }) {
  const [claiming, setClaiming] = useState(false);
  const [lastClaim, setLastClaim] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClaim = async () => {
    if (!selectedUser || claiming) return;

    setClaiming(true);
    
    try {
      const result = await onClaim(selectedUser._id);
      setLastClaim(result);
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Claim failed:', error);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <Gift className="h-12 w-12 text-yellow-400" />
            <Sparkles className="absolute -top-1 -right-1 h-6 w-6 text-purple-400 animate-pulse" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-2">Claim Your Points!</h3>
        <p className="text-slate-400 mb-6">
          {selectedUser ? `Click to claim points for ${selectedUser.name}` : 'Select a user to claim points'}
        </p>

        {/* Success Message */}
        {showSuccess && lastClaim && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              <p className="text-emerald-400 font-medium">Points Claimed!</p>
            </div>
            <p className="text-white text-lg">
              <span className="font-bold text-yellow-400">+{lastClaim.awarded} points</span> awarded to {selectedUser?.name}!
            </p>
          </div>
        )}

        <button
          onClick={handleClaim}
          disabled={!selectedUser || claiming || disabled}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
            !selectedUser || claiming || disabled
              ? 'bg-slate-600 cursor-not-allowed text-slate-400'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-105 active:scale-95'
          }`}
        >
          {claiming ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Claiming Points...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Gift className="h-5 w-5" />
              Claim Points (1-10)
            </span>
          )}
        </button>

        {!selectedUser && (
          <p className="text-slate-500 text-sm mt-3">
            Please select a user from the list above
          </p>
        )}
      </div>
    </div>
  );
}