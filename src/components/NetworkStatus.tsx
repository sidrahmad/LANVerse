import React from 'react';
import { motion } from 'framer-motion';
import { 
  Wifi, 
  WifiOff, 
  Signal, 
  Users, 
  Activity,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react';
import { useP2PNetwork } from '../hooks/useP2PNetwork';

const NetworkStatus: React.FC = () => {
  const { 
    isConnected, 
    peers, 
    environment, 
    networkStats,
    isDiscovering 
  } = useP2PNetwork();

  const getNetworkIcon = () => {
    if (!environment) return Globe;
    
    switch (environment.networkType) {
      case 'wifi': return Wifi;
      case 'ethernet': return Monitor;
      case 'mobile': return Smartphone;
      default: return Globe;
    }
  };

  const getSignalStrength = () => {
    if (!environment) return 0;
    
    const { bandwidth } = environment;
    if (bandwidth.download > 50) return 4;
    if (bandwidth.download > 20) return 3;
    if (bandwidth.download > 5) return 2;
    return 1;
  };

  const NetworkIcon = getNetworkIcon();
  const signalStrength = getSignalStrength();

  return (
    <motion.div
      className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Network Status</h3>
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          ) : (
            <div className="w-3 h-3 bg-red-400 rounded-full" />
          )}
          <span className="text-sm text-slate-300">
            {isDiscovering ? 'Discovering...' : isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {environment && (
        <div className="space-y-3">
          {/* Network Type */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <NetworkIcon className="h-5 w-5 text-blue-400 mr-2" />
              <span className="text-slate-300 capitalize">{environment.networkType}</span>
            </div>
            <div className="flex items-center space-x-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 h-3 rounded-full ${
                    i < signalStrength ? 'bg-green-400' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Bandwidth */}
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Bandwidth</span>
            <span className="text-white text-sm">
              ↓{environment.bandwidth.download.toFixed(1)} Mbps / 
              ↑{environment.bandwidth.upload.toFixed(1)} Mbps
            </span>
          </div>

          {/* Latency */}
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Latency</span>
            <span className={`text-sm ${
              environment.bandwidth.latency < 50 ? 'text-green-400' :
              environment.bandwidth.latency < 100 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {environment.bandwidth.latency.toFixed(0)}ms
            </span>
          </div>

          {/* Local IP */}
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Local IP</span>
            <span className="text-white text-sm font-mono">
              {environment.localNetwork.ipAddress}
            </span>
          </div>

          {/* Connected Peers */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-purple-400 mr-2" />
              <span className="text-slate-300">Peers</span>
            </div>
            <span className="text-white">{peers.length}</span>
          </div>

          {/* Network Stats */}
          <div className="pt-3 border-t border-slate-700/50">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-center">
                <p className="text-slate-400">Messages</p>
                <p className="text-white font-medium">
                  {networkStats.messagesReceived + networkStats.messagesSent}
                </p>
              </div>
              <div className="text-center">
                <p className="text-slate-400">Data</p>
                <p className="text-white font-medium">
                  {(networkStats.bytesTransferred / 1024 / 1024).toFixed(1)}MB
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!environment && (
        <div className="text-center py-4">
          <Activity className="h-8 w-8 text-slate-600 mx-auto mb-2 animate-pulse" />
          <p className="text-slate-400">Detecting network environment...</p>
        </div>
      )}
    </motion.div>
  );
};

export default NetworkStatus;