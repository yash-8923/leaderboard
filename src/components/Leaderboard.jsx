import React from 'react';
import { Trophy, Medal, Award, Crown, Loader2 } from 'lucide-react';

export default function Leaderboard({ leaderboard, loading, error }) {
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-slate-400 font-bold">#{rank}</span>;
    }
  };

  const getRankStyles = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30';
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/30';
      default:
        return 'bg-slate-700/30 border-slate-600/30';
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
        <div className="text-center py-12">
          <p className="text-red-400">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="h-6 w-6 text-yellow-400" />
        <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
        <div className="flex-1"></div>
        <div className="px-3 py-1 bg-purple-600/20 rounded-full">
          <span className="text-purple-400 text-sm font-medium">
            {leaderboard.length} players
          </span>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <div className="overflow-hidden rounded-xl border border-slate-700/50">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-700/50 border-b border-slate-600/50">
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Player</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-slate-300">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {leaderboard.map((user, index) => (
                <tr 
                  key={user._id} 
                  className={`hover:bg-slate-700/20 transition-colors ${getRankStyles(index + 1)}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getRankIcon(index + 1)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-bold text-lg text-white">{user.totalPoints}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {leaderboard.map((user, index) => (
          <div
            key={user._id}
            className={`p-4 rounded-xl border transition-all duration-200 ${getRankStyles(index + 1)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8">
                  {getRankIcon(index + 1)}
                </div>
                <div>
                  <p className="font-medium text-white">{user.name}</p>
                  <p className="text-sm text-slate-400">Rank #{index + 1}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-white">{user.totalPoints}</p>
                <p className="text-sm text-slate-400">points</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {leaderboard.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No players yet. Add some users and start claiming points!</p>
        </div>
      )}
    </div>
  );
}