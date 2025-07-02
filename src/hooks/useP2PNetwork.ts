import { useState, useEffect, useCallback } from 'react';
import { NetworkService, PeerConnection, NetworkMessage } from '../services/NetworkService';
import { LocalEnvironmentService, LocalEnvironment } from '../services/LocalEnvironmentService';

export interface P2PNetworkState {
  isConnected: boolean;
  peers: PeerConnection[];
  localPeerId: string;
  environment: LocalEnvironment | null;
  isDiscovering: boolean;
  networkStats: {
    messagesReceived: number;
    messagesSent: number;
    bytesTransferred: number;
    activeConnections: number;
  };
}

export function useP2PNetwork() {
  const [networkService] = useState(() => new NetworkService());
  const [environmentService] = useState(() => new LocalEnvironmentService());
  
  const [state, setState] = useState<P2PNetworkState>({
    isConnected: false,
    peers: [],
    localPeerId: '',
    environment: null,
    isDiscovering: false,
    networkStats: {
      messagesReceived: 0,
      messagesSent: 0,
      bytesTransferred: 0,
      activeConnections: 0
    }
  });

  // Initialize network services
  useEffect(() => {
    const initializeNetwork = async () => {
      try {
        // Detect environment
        const environment = await environmentService.detectEnvironment();
        
        setState(prev => ({
          ...prev,
          environment,
          localPeerId: networkService['localPeerId'], // Access private property for demo
          isDiscovering: true
        }));

        // Start peer discovery
        await networkService.startPeerDiscovery();
        
        setState(prev => ({
          ...prev,
          isConnected: true,
          isDiscovering: false
        }));

        // Set up message handlers
        networkService.onMessage('chat', handleChatMessage);
        networkService.onMessage('file', handleFileMessage);
        networkService.onMessage('voice', handleVoiceMessage);
        networkService.onMessage('game', handleGameMessage);
        networkService.onMessage('system', handleSystemMessage);

      } catch (error) {
        console.error('Failed to initialize network:', error);
        setState(prev => ({
          ...prev,
          isDiscovering: false
        }));
      }
    };

    initializeNetwork();

    // Update peers periodically
    const peersInterval = setInterval(() => {
      const connectedPeers = networkService.getConnectedPeers();
      setState(prev => ({
        ...prev,
        peers: connectedPeers,
        networkStats: {
          ...prev.networkStats,
          activeConnections: connectedPeers.length
        }
      }));
    }, 2000);

    // Environment change handler
    environmentService.onEnvironmentChanged((env) => {
      setState(prev => ({ ...prev, environment: env }));
    });

    return () => {
      clearInterval(peersInterval);
      networkService.disconnect();
      environmentService.cleanup();
    };
  }, []);

  // Message handlers
  const handleChatMessage = useCallback((message: NetworkMessage) => {
    setState(prev => ({
      ...prev,
      networkStats: {
        ...prev.networkStats,
        messagesReceived: prev.networkStats.messagesReceived + 1
      }
    }));
    
    // Emit custom event for chat components to handle
    window.dispatchEvent(new CustomEvent('p2p-chat-message', { detail: message }));
  }, []);

  const handleFileMessage = useCallback((message: NetworkMessage) => {
    setState(prev => ({
      ...prev,
      networkStats: {
        ...prev.networkStats,
        messagesReceived: prev.networkStats.messagesReceived + 1,
        bytesTransferred: prev.networkStats.bytesTransferred + (message.data.chunkData?.length || 0)
      }
    }));
    
    window.dispatchEvent(new CustomEvent('p2p-file-message', { detail: message }));
  }, []);

  const handleVoiceMessage = useCallback((message: NetworkMessage) => {
    setState(prev => ({
      ...prev,
      networkStats: {
        ...prev.networkStats,
        messagesReceived: prev.networkStats.messagesReceived + 1,
        bytesTransferred: prev.networkStats.bytesTransferred + (message.data.audioData?.length || 0)
      }
    }));
    
    window.dispatchEvent(new CustomEvent('p2p-voice-message', { detail: message }));
  }, []);

  const handleGameMessage = useCallback((message: NetworkMessage) => {
    setState(prev => ({
      ...prev,
      networkStats: {
        ...prev.networkStats,
        messagesReceived: prev.networkStats.messagesReceived + 1
      }
    }));
    
    window.dispatchEvent(new CustomEvent('p2p-game-message', { detail: message }));
  }, []);

  const handleSystemMessage = useCallback((message: NetworkMessage) => {
    setState(prev => ({
      ...prev,
      networkStats: {
        ...prev.networkStats,
        messagesReceived: prev.networkStats.messagesReceived + 1
      }
    }));
    
    window.dispatchEvent(new CustomEvent('p2p-system-message', { detail: message }));
  }, []);

  // Network actions
  const sendMessage = useCallback(async (type: NetworkMessage['type'], data: any, targetPeer?: string) => {
    try {
      await networkService.sendMessage({
        type,
        to: targetPeer,
        data
      });
      
      setState(prev => ({
        ...prev,
        networkStats: {
          ...prev.networkStats,
          messagesSent: prev.networkStats.messagesSent + 1
        }
      }));
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [networkService]);

  const createRoom = useCallback(async (roomName: string, isPrivate: boolean = false) => {
    try {
      const roomId = await networkService.createRoom(roomName, isPrivate);
      return roomId;
    } catch (error) {
      console.error('Failed to create room:', error);
      throw error;
    }
  }, [networkService]);

  const joinRoom = useCallback(async (roomId: string, password?: string) => {
    try {
      const success = await networkService.joinRoom(roomId, password);
      return success;
    } catch (error) {
      console.error('Failed to join room:', error);
      throw error;
    }
  }, [networkService]);

  const startFileTransfer = useCallback(async (peerId: string, file: File) => {
    try {
      const transferId = await networkService.startFileTransfer(peerId, file);
      return transferId;
    } catch (error) {
      console.error('Failed to start file transfer:', error);
      throw error;
    }
  }, [networkService]);

  const startVoiceChat = useCallback(async (targetPeer?: string) => {
    try {
      const mediaRecorder = await networkService.startVoiceStream(targetPeer);
      return mediaRecorder;
    } catch (error) {
      console.error('Failed to start voice chat:', error);
      throw error;
    }
  }, [networkService]);

  const getOptimalSettings = useCallback(() => {
    return environmentService.getOptimalSettings();
  }, [environmentService]);

  const isFeatureSupported = useCallback((feature: string) => {
    return environmentService.isFeatureSupported(feature as any);
  }, [environmentService]);

  return {
    ...state,
    sendMessage,
    createRoom,
    joinRoom,
    startFileTransfer,
    startVoiceChat,
    getOptimalSettings,
    isFeatureSupported
  };
}