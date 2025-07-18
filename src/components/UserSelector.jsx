import React, { useState, useRef } from 'react';
import { User, Plus, Loader2 } from 'lucide-react';

export default function UserSelector({ users, selectedUser, onUserSelect, onAddUser, loading }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef(null);

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    setIsAdding(true);
    setError('');

    try {
      await onAddUser(newUserName.trim());
      setNewUserName('');
      setShowAddForm(false);
    } catch (err) {
      setError(err.message || 'Failed to add user. Please check your connection.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleShowAddForm = () => {
    setShowAddForm(true);
    // Smooth scroll to form after state update
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest',
          inline: 'start'
        });
      }
    }, 100);
  };

  if (loading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <User className="h-5 w-5 text-purple-400" />
          Select User
        </h2>
        <button
          onClick={handleShowAddForm}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-white text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {/* User Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-6">
        {users.map((user) => (
          <button
            key={user._id}
            onClick={() => onUserSelect(user)}
            className={`p-4 rounded-xl border-2 transition-all duration-300 text-left group hover:scale-105 hover:shadow-lg ${
              selectedUser?._id === user._id
                ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20 scale-105'
                : 'border-slate-600 hover:border-purple-400 bg-slate-700/30 hover:bg-slate-700/50 hover:shadow-purple-500/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white group-hover:text-purple-200 transition-colors duration-200">
                  {user.name}
                </p>
                <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-200">
                  {user.totalPoints} points
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                selectedUser?._id === user._id ? 'bg-purple-500' : 'bg-slate-600'
              } transition-colors duration-200`}></div>
            </div>
          </button>
        ))}
      </div>

      {/* Add User Form */}
      {showAddForm && (
        <div ref={formRef} className="border-t border-slate-700/50 pt-6 animate-in slide-in-from-top-2 duration-300">
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label htmlFor="newUserName" className="block text-sm font-medium text-slate-300 mb-2">
                User Name
              </label>
              <input
                type="text"
                autoFocus
                id="newUserName"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="Enter user name..."
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 focus:scale-105"
                disabled={isAdding}
              />
            </div>
            
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg animate-in fade-in duration-200">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isAdding || !newUserName.trim()}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-all duration-200 hover:scale-105 disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isAdding ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add User
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewUserName('');
                  setError('');
                }}
                className="px-6 py-3 bg-slate-600 hover:bg-slate-700 rounded-xl text-white font-medium transition-all duration-200 hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}