import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Settings, 
  Users, 
  MessageSquare, 
  Mic, 
  FileText,
  Gamepad2,
  BarChart3
} from 'lucide-react';
import { Room, User } from '../types';
import ChatPanel from './room/ChatPanel';
import VoicePanel from './room/VoicePanel';
import FilePanel from './room/FilePanel';
import GamePanel from './room/GamePanel';
import DashboardPanel from './room/DashboardPanel';
import UserList from './room/UserList';

interface RoomInterfaceProps {
  room: Room;
  user: User | null;
  onLeave: () => void;
}

type ActivePanel = 'chat' | 'voice' | 'files' | 'games' | 'dashboard';

const RoomInterface: React.FC<RoomInterfaceProps> = ({ room, user, onLeave }) => {
  const [activePanel, setActivePanel] = useState<ActivePanel>('chat');
  const [showUserList, setShowUserList] = useState(true);

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'voice', label: 'Voice', icon: Mic },
    { id: 'files', label: 'Files', icon: FileText },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 }
  ];

  const renderActivePanel = () => {
    switch (activePanel) {
      case 'chat':
        return <ChatPanel room={room} user={user} />;
      case 'voice':
        return <VoicePanel room={room} user={user} />;
      case 'files':
        return <FilePanel room={room} user={user} />;
      case 'games':
        return <GamePanel room={room} user={user} />;
      case 'dashboard':
        return <DashboardPanel room={room} user={user} />;
      default:
        return <ChatPanel room={room} user={user} />;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between p-4 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center">
          <motion.button
            onClick={onLeave}
            className="mr-4 p-2 text-slate-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="h-6 w-6" />
          </motion.button>
          
          <div>
            <h1 className="text-2xl font-bold text-white">{room.name}</h1>
            <p className="text-slate-400 text-sm">{room.description}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <motion.button
            onClick={() => setShowUserList(!showUserList)}
            className="flex items-center px-3 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Users className="h-4 w-4 mr-2" />
            {room.users.length}
          </motion.button>
          
          <motion.button
            className="p-2 text-slate-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Settings className="h-5 w-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Navigation */}
        <motion.div 
          className="w-64 bg-slate-800/30 backdrop-blur-sm border-r border-slate-700/50 p-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActivePanel(tab.id as ActivePanel)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  activePanel === tab.id
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <tab.icon className="h-5 w-5 mr-3" />
                {tab.label}
              </motion.button>
            ))}
          </nav>
        </motion.div>

        {/* Main Panel */}
        <motion.div 
          className="flex-1 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {renderActivePanel()}
        </motion.div>

        {/* Right Sidebar - User List */}
        {showUserList && (
          <motion.div 
            className="w-64 bg-slate-800/30 backdrop-blur-sm border-l border-slate-700/50"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <UserList users={room.users} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RoomInterface;