import React, { useState } from 'react';
import Layout from './components/Layout';
import UserSelector from './components/UserSelector';
import ClaimSection from './components/ClaimSection';
import Leaderboard from './components/Leaderboard';
import { useUsers } from './hooks/useUsers';
import { useLeaderboard } from './hooks/useLeaderboard';
import ApiService from './services/api';

function App() {
  const [selectedUser, setSelectedUser] = useState(null);
  const { users, loading: usersLoading, addUser, updateUserPoints } = useUsers();
  const { leaderboard, loading: leaderboardLoading, error: leaderboardError, updateLeaderboard } = useLeaderboard();

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleAddUser = async (name) => {
    const newUser = await addUser(name);
    return newUser;
  };

  const handleClaim = async (userId) => {
    const result = await ApiService.claimPoints(userId);
    updateLeaderboard(result.leaderboard);
    updateUserPoints(result.leaderboard);
    
    // Update selected user if they were the one who claimed points
    if (selectedUser && selectedUser._id === userId) {
      const updatedUser = result.leaderboard.find(user => user._id === userId);
      if (updatedUser) {
        setSelectedUser(updatedUser);
      }
    }
    
    return result;
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🏆 Leaderboard Challenge
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Select a user, claim your points, and climb the leaderboard! 
            Each claim awards you 1-10 random points.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - User Selection and Claiming */}
          <div className="space-y-6">
            <UserSelector
              users={users}
              selectedUser={selectedUser}
              onUserSelect={handleUserSelect}
              onAddUser={handleAddUser}
              loading={usersLoading}
            />
            
            <ClaimSection
              selectedUser={selectedUser}
              onClaim={handleClaim}
              disabled={usersLoading || leaderboardLoading}
            />
          </div>

          {/* Right Column - Leaderboard */}
          <div className="lg:sticky lg:top-8">
            <Leaderboard
              leaderboard={leaderboard}
              loading={leaderboardLoading}
              error={leaderboardError}
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">{users.length}</div>
            <div className="text-slate-300">Total Players</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-2">
              {leaderboard.reduce((sum, user) => sum + user.totalPoints, 0)}
            </div>
            <div className="text-slate-300">Total Points</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {leaderboard.length > 0 ? leaderboard[0]?.totalPoints || 0 : 0}
            </div>
            <div className="text-slate-300">Top Score</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;