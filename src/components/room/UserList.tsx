import React from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  MoreVertical,
  MessageSquare,
  UserPlus
} from 'lucide-react';
import { User } from '../../types';

interface UserListProps {
  users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-400';
      case 'away':
        return 'bg-yellow-400';
      case 'busy':
        return 'bg-red-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: User['status']) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'away':
        return 'Away';
      case 'busy':
        return 'Busy';
      default:
        return 'Offline';
    }
  };

  return (
    <div className="h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Users ({users.length})</h3>
        <motion.button
          className="p-2 text-slate-400 hover:text-white transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <UserPlus className="h-4 w-4" />
        </motion.button>
      </div>

      <div className="space-y-2">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            className="group flex items-center p-3 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center text-lg">
                {user.avatar}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(user.status)} rounded-full border-2 border-slate-800`} />
              {index === 0 && (
                <div className="absolute -top-1 -left-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Crown className="h-2 w-2 text-yellow-900" />
                </div>
              )}
            </div>

            <div className="flex-1 ml-3">
              <div className="flex items-center">
                <p className="text-white font-medium text-sm">{user.name}</p>
                {index === 0 && (
                  <span className="ml-2 px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded">
                    Host
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-xs">{getStatusText(user.status)}</p>
            </div>

            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <motion.button
                className="p-1 text-slate-400 hover:text-blue-400 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <MessageSquare className="h-3 w-3" />
              </motion.button>
              
              <motion.button
                className="p-1 text-slate-400 hover:text-green-400 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Mic className="h-3 w-3" />
              </motion.button>
              
              <motion.button
                className="p-1 text-slate-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <MoreVertical className="h-3 w-3" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Voice Channel Section */}
      <div className="mt-6 pt-4 border-t border-slate-700/50">
        <h4 className="text-sm font-medium text-slate-400 mb-3">Voice Channel</h4>
        <div className="space-y-2">
          {users.slice(0, 3).map((user) => (
            <motion.div
              key={`voice-${user.id}`}
              className="flex items-center p-2 bg-slate-700/30 rounded-lg"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center text-xs">
                {user.avatar}
              </div>
              <span className="text-sm text-slate-300 ml-2 flex-1">{user.name}</span>
              <div className="flex items-center space-x-1">
                <div className="w-1 h-3 bg-green-400 rounded-full animate-pulse" />
                <Mic className="h-3 w-3 text-green-400" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserList;