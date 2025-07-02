import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Settings,
  Users,
  Headphones,
  Radio
} from 'lucide-react';
import { Room, User, VoiceChannel } from '../../types';

interface VoicePanelProps {
  room: Room;
  user: User | null;
}

const VoicePanel: React.FC<VoicePanelProps> = ({ room, user }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [voiceActivity, setVoiceActivity] = useState<{ [userId: string]: number }>({});
  const [activeChannel, setActiveChannel] = useState<VoiceChannel | null>(null);

  useEffect(() => {
    // Initialize default voice channel
    const defaultChannel: VoiceChannel = {
      id: 'main',
      name: 'Main Channel',
      users: room.users.slice(0, 3),
      isActive: true
    };
    setActiveChannel(defaultChannel);

    // Simulate voice activity
    const interval = setInterval(() => {
      const newActivity: { [userId: string]: number } = {};
      room.users.forEach(user => {
        if (Math.random() > 0.7) {
          newActivity[user.id] = Math.random() * 100;
        }
      });
      setVoiceActivity(newActivity);
    }, 1000);

    return () => clearInterval(interval);
  }, [room]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleDeafen = () => {
    setIsDeafened(!isDeafened);
    if (!isDeafened) {
      setIsMuted(true);
    }
  };

  return (
    <div className="h-full bg-slate-900/20 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Voice Controls Header */}
        <motion.div 
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Voice Chat</h2>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-slate-300">Connected</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <motion.button
              onClick={toggleMute}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                isMuted 
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                  : 'bg-green-500/20 text-green-300 border border-green-500/30'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMuted ? <MicOff className="h-5 w-5 mr-2" /> : <Mic className="h-5 w-5 mr-2" />}
              {isMuted ? 'Unmute' : 'Mute'}
            </motion.button>

            <motion.button
              onClick={toggleDeafen}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                isDeafened 
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isDeafened ? <VolumeX className="h-5 w-5 mr-2" /> : <Volume2 className="h-5 w-5 mr-2" />}
              {isDeafened ? 'Undeafen' : 'Deafen'}
            </motion.button>

            <motion.button
              className="flex items-center px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="h-5 w-5 mr-2" />
              Settings
            </motion.button>
          </div>
        </motion.div>

        {/* Voice Channel */}
        {activeChannel && (
          <motion.div 
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center mb-4">
              <Radio className="h-6 w-6 text-blue-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">{activeChannel.name}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeChannel.users.map((channelUser) => (
                <motion.div
                  key={channelUser.id}
                  className={`flex items-center p-4 rounded-lg transition-all duration-200 ${
                    voiceActivity[channelUser.id] 
                      ? 'bg-green-500/20 border border-green-500/30' 
                      : 'bg-slate-700/50 border border-slate-600/30'
                  }`}
                  animate={{
                    scale: voiceActivity[channelUser.id] ? 1.02 : 1,
                  }}
                >
                  <div className="flex items-center flex-1">
                    <div className="relative">
                      <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center text-xl">
                        {channelUser.avatar}
                      </div>
                      {voiceActivity[channelUser.id] && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse" />
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-white font-medium">{channelUser.name}</p>
                      <div className="flex items-center space-x-1">
                        {channelUser.id === user?.id && isMuted && (
                          <MicOff className="h-3 w-3 text-red-400" />
                        )}
                        {channelUser.id === user?.id && isDeafened && (
                          <VolumeX className="h-3 w-3 text-red-400" />
                        )}
                        <span className="text-xs text-slate-400">{channelUser.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  {voiceActivity[channelUser.id] && (
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 h-4 rounded-full transition-colors ${
                            i < Math.floor(voiceActivity[channelUser.id] / 20) 
                              ? 'bg-green-400' 
                              : 'bg-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Voice Stats */}
        <motion.div 
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4">Voice Statistics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-8 w-8 text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-white">{activeChannel?.users.length || 0}</p>
              <p className="text-slate-400">Active Users</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Headphones className="h-8 w-8 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-white">32 kbps</p>
              <p className="text-slate-400">Audio Quality</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Radio className="h-8 w-8 text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-white">12 ms</p>
              <p className="text-slate-400">Latency</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VoicePanel;