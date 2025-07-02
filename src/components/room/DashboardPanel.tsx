import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Users, 
  MessageSquare, 
  FileText,
  Wifi,
  Clock,
  Download,
  Upload,
  Zap,
  Shield,
  Globe
} from 'lucide-react';
import { Room, User } from '../../types';

interface DashboardPanelProps {
  room: Room;
  user: User | null;
}

const DashboardPanel: React.FC<DashboardPanelProps> = ({ room, user }) => {
  const [networkStats, setNetworkStats] = useState({
    latency: 12,
    downloadSpeed: 1024,
    uploadSpeed: 512,
    packetsLost: 0.1,
    uptime: 3600
  });

  const [activityLog, setActivityLog] = useState<any[]>([]);

  useEffect(() => {
    // Initialize activity log
    const demoActivity = [
      {
        id: '1',
        type: 'user_join',
        user: room.users[0],
        timestamp: new Date(Date.now() - 300000),
        message: 'joined the room'
      },
      {
        id: '2',
        type: 'file_share',
        user: room.users[1] || room.users[0],
        timestamp: new Date(Date.now() - 240000),
        message: 'shared a file: document.pdf'
      },
      {
        id: '3',
        type: 'voice_start',
        user: room.users[2] || room.users[0],
        timestamp: new Date(Date.now() - 180000),
        message: 'started voice chat'
      },
      {
        id: '4',
        type: 'game_start',
        user: room.users[0],
        timestamp: new Date(Date.now() - 120000),
        message: 'started a game of Tic-Tac-Toe'
      }
    ];
    setActivityLog(demoActivity);

    // Update network stats periodically
    const interval = setInterval(() => {
      setNetworkStats(prev => ({
        ...prev,
        latency: prev.latency + (Math.random() - 0.5) * 4,
        downloadSpeed: prev.downloadSpeed + (Math.random() - 0.5) * 200,
        uploadSpeed: prev.uploadSpeed + (Math.random() - 0.5) * 100,
        packetsLost: Math.max(0, prev.packetsLost + (Math.random() - 0.5) * 0.1),
        uptime: prev.uptime + 1
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [room]);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatSpeed = (kbps: number) => {
    if (kbps >= 1024) {
      return `${(kbps / 1024).toFixed(1)} Mbps`;
    }
    return `${kbps.toFixed(0)} Kbps`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_join':
        return Users;
      case 'file_share':
        return FileText;
      case 'voice_start':
        return Activity;
      case 'game_start':
        return Activity;
      default:
        return Activity;
    }
  };

  return (
    <div className="h-full bg-slate-900/20 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Network Status Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Zap className="h-6 w-6 text-blue-400" />
              <span className="text-xs text-slate-400">ms</span>
            </div>
            <p className="text-2xl font-bold text-white">{networkStats.latency.toFixed(0)}</p>
            <p className="text-slate-400 text-sm">Latency</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Download className="h-6 w-6 text-green-400" />
              <span className="text-xs text-slate-400">↓</span>
            </div>
            <p className="text-2xl font-bold text-white">{formatSpeed(networkStats.downloadSpeed)}</p>
            <p className="text-slate-400 text-sm">Download</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Upload className="h-6 w-6 text-orange-400" />
              <span className="text-xs text-slate-400">↑</span>
            </div>
            <p className="text-2xl font-bold text-white">{formatSpeed(networkStats.uploadSpeed)}</p>
            <p className="text-slate-400 text-sm">Upload</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-6 w-6 text-purple-400" />
              <span className="text-xs text-slate-400">time</span>
            </div>
            <p className="text-2xl font-bold text-white">{formatUptime(networkStats.uptime)}</p>
            <p className="text-slate-400 text-sm">Uptime</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Room Statistics */}
          <motion.div
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">Room Statistics</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-400 mr-3" />
                  <span className="text-slate-300">Active Users</span>
                </div>
                <span className="text-white font-medium">{room.users.length}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-slate-300">Messages Sent</span>
                </div>
                <span className="text-white font-medium">147</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-purple-400 mr-3" />
                  <span className="text-slate-300">Files Shared</span>
                </div>
                <span className="text-white font-medium">8</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-orange-400 mr-3" />
                  <span className="text-slate-300">Encryption</span>
                </div>
                <span className="text-green-400 font-medium">AES-256</span>
              </div>
            </div>
          </motion.div>

          {/* Network Health */}
          <motion.div
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">Network Health</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">Connection Quality</span>
                  <span className="text-green-400 font-medium">Excellent</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">Packet Loss</span>
                  <span className="text-blue-400 font-medium">{networkStats.packetsLost.toFixed(2)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{ width: `${networkStats.packetsLost * 10}%` }} />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">Bandwidth Usage</span>
                  <span className="text-purple-400 font-medium">68%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-purple-400 h-2 rounded-full" style={{ width: '68%' }} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Activity Log */}
        <motion.div
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
          
          <div className="space-y-3">
            {activityLog.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <motion.div
                  key={activity.id}
                  className="flex items-center p-3 bg-slate-700/30 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                    <Icon className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-300">
                      <span className="text-white font-medium">{activity.user.name}</span> {activity.message}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {activity.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Protocol Information */}
        <motion.div
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4">Protocol Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium text-white mb-3">Active Services</h4>
              <div className="space-y-2">
                {room.services.filter(s => s.enabled).map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                    <span className="text-slate-300 capitalize">{service.type}</span>
                    <div className="flex items-center">
                      <span className="text-slate-400 text-sm mr-2">Port: {service.port}</span>
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-white mb-3">Transport Protocols</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                  <span className="text-slate-300">TCP (Reliable)</span>
                  <span className="text-green-400 text-sm">Chat, Files</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                  <span className="text-slate-300">UDP (Fast)</span>
                  <span className="text-blue-400 text-sm">Voice, Games</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPanel;