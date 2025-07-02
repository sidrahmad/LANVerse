import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Wifi, Users, Lock, Unlock, Plus, ArrowLeft, Gamepad2, MessageSquare, Share as FileShare, Mic, RefreshCw } from 'lucide-react';
import { Room, User, RoomService } from '../types';

interface RoomDiscoveryProps {
  onJoinRoom: (room: Room) => void;
}

const RoomDiscovery: React.FC<RoomDiscoveryProps> = ({ onJoinRoom }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateRoom, setShowCreateRoom] = useState(false);

  // Generate demo rooms
  useEffect(() => {
    const demoRooms: Room[] = [
      {
        id: '1',
        name: 'Gaming Lounge',
        description: 'Multiplayer gaming and voice chat',
        host: { id: '1', name: 'GameMaster', avatar: '🎮', status: 'online', joinedAt: new Date() },
        users: [
          { id: '1', name: 'GameMaster', avatar: '🎮', status: 'online', joinedAt: new Date() },
          { id: '2', name: 'Player2', avatar: '🚀', status: 'online', joinedAt: new Date() },
          { id: '3', name: 'PixelWarrior', avatar: '⚔️', status: 'online', joinedAt: new Date() }
        ],
        maxUsers: 8,
        services: [
          { type: 'chat', enabled: true, port: 8001 },
          { type: 'voice', enabled: true, port: 8002 },
          { type: 'game', enabled: true, port: 8003 }
        ],
        created: new Date(),
        isPrivate: false
      },
      {
        id: '2',
        name: 'File Share Central',
        description: 'High-speed file sharing and collaboration',
        host: { id: '4', name: 'FileSharer', avatar: '📁', status: 'online', joinedAt: new Date() },
        users: [
          { id: '4', name: 'FileSharer', avatar: '📁', status: 'online', joinedAt: new Date() },
          { id: '5', name: 'DataMover', avatar: '💾', status: 'online', joinedAt: new Date() }
        ],
        maxUsers: 12,
        services: [
          { type: 'chat', enabled: true, port: 8004 },
          { type: 'file', enabled: true, port: 8005 }
        ],
        created: new Date(),
        isPrivate: false
      },
      {
        id: '3',
        name: 'Private Workspace',
        description: 'Secure team collaboration space',
        host: { id: '6', name: 'TeamLead', avatar: '👔', status: 'online', joinedAt: new Date() },
        users: [
          { id: '6', name: 'TeamLead', avatar: '👔', status: 'online', joinedAt: new Date() },
          { id: '7', name: 'Developer1', avatar: '💻', status: 'online', joinedAt: new Date() },
          { id: '8', name: 'Designer1', avatar: '🎨', status: 'away', joinedAt: new Date() }
        ],
        maxUsers: 6,
        services: [
          { type: 'chat', enabled: true, port: 8006 },
          { type: 'voice', enabled: true, port: 8007 },
          { type: 'file', enabled: true, port: 8008 },
          { type: 'whiteboard', enabled: true, port: 8009 }
        ],
        created: new Date(),
        isPrivate: true,
        password: 'secure123'
      }
    ];
    
    setRooms(demoRooms);
  }, []);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // Simulate finding new rooms
    }, 2000);
  };

  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getServiceIcon = (service: RoomService) => {
    switch (service.type) {
      case 'chat': return MessageSquare;
      case 'voice': return Mic;
      case 'file': return FileShare;
      case 'game': return Gamepad2;
      default: return MessageSquare;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center">
            <motion.button
              className="mr-4 p-2 text-slate-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft className="h-6 w-6" />
            </motion.button>
            <h1 className="text-3xl font-bold text-white">Room Discovery</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={handleScan}
              disabled={isScanning}
              className="flex items-center px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
              {isScanning ? 'Scanning...' : 'Scan LAN'}
            </motion.button>
            
            <motion.button
              onClick={() => setShowCreateRoom(true)}
              className="flex items-center px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Room
            </motion.button>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          className="relative mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search rooms by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
            />
          </div>
        </motion.div>

        {/* Scanning Indicator */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              className="flex items-center justify-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center space-x-3 text-blue-400">
                <Wifi className="h-6 w-6 animate-pulse" />
                <span className="text-lg">Scanning LAN for available rooms...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rooms Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {filteredRooms.map((room, index) => (
            <motion.div
              key={room.id}
              className="group relative bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => onJoinRoom(room)}
            >
              {/* Room Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse" />
                  <h3 className="text-xl font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {room.name}
                  </h3>
                </div>
                {room.isPrivate ? (
                  <Lock className="h-5 w-5 text-orange-400" />
                ) : (
                  <Unlock className="h-5 w-5 text-green-400" />
                )}
              </div>

              {/* Room Description */}
              <p className="text-slate-300 mb-4 text-sm">{room.description}</p>

              {/* Room Stats */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-slate-400">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-sm">{room.users.length}/{room.maxUsers}</span>
                </div>
                <div className="flex items-center text-slate-400">
                  <span className="text-sm">Host: {room.host.name}</span>
                </div>
              </div>

              {/* Services */}
              <div className="flex flex-wrap gap-2 mb-4">
                {room.services.filter(s => s.enabled).map((service, i) => {
                  const Icon = getServiceIcon(service);
                  return (
                    <div key={i} className="flex items-center px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                      <Icon className="h-3 w-3 mr-1" />
                      {service.type}
                    </div>
                  );
                })}
              </div>

              {/* User Avatars */}
              <div className="flex -space-x-2">
                {room.users.slice(0, 5).map((user, i) => (
                  <div key={i} className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-sm border-2 border-slate-800">
                    {user.avatar}
                  </div>
                ))}
                {room.users.length > 5 && (
                  <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-xs text-slate-300 border-2 border-slate-800">
                    +{room.users.length - 5}
                  </div>
                )}
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredRooms.length === 0 && !isScanning && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Wifi className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-400 mb-2">No Rooms Found</h3>
            <p className="text-slate-500 mb-6">
              {searchTerm ? 'No rooms match your search criteria.' : 'No rooms detected on the local network.'}
            </p>
            <motion.button
              onClick={handleScan}
              className="px-6 py-3 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Scan Again
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RoomDiscovery;