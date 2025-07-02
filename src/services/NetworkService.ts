/**
 * Core P2P Networking Service for LANVerse
 * Handles peer discovery, connection management, and data routing
 */

export interface PeerConnection {
  id: string;
  address: string;
  port: number;
  status: 'connecting' | 'connected' | 'disconnected';
  lastSeen: Date;
  services: string[];
}

export interface NetworkMessage {
  type: 'discovery' | 'chat' | 'file' | 'voice' | 'game' | 'system';
  from: string;
  to?: string; // undefined for broadcast
  data: any;
  timestamp: Date;
  messageId: string;
}

export class NetworkService {
  private peers: Map<string, PeerConnection> = new Map();
  private connections: Map<string, RTCPeerConnection> = new Map();
  private dataChannels: Map<string, RTCDataChannel> = new Map();
  private localPeerId: string;
  private isHost: boolean = false;
  private discoveryInterval?: number;
  private messageHandlers: Map<string, (message: NetworkMessage) => void> = new Map();

  constructor() {
    this.localPeerId = this.generatePeerId();
    this.setupLocalNetworkDetection();
  }

  /**
   * Generate unique peer ID based on local network info
   */
  private generatePeerId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `peer_${timestamp}_${random}`;
  }

  /**
   * Detect local network environment and capabilities
   */
  private async setupLocalNetworkDetection() {
    try {
      // Get local IP address using WebRTC STUN
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
      
      pc.createDataChannel('test');
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          const candidate = event.candidate.candidate;
          const ipMatch = candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
          if (ipMatch && this.isLocalIP(ipMatch[1])) {
            console.log('Local IP detected:', ipMatch[1]);
            this.startPeerDiscovery();
          }
        }
      };
    } catch (error) {
      console.error('Network detection failed:', error);
      // Fallback to manual discovery
      this.startPeerDiscovery();
    }
  }

  /**
   * Check if IP is in local network range
   */
  private isLocalIP(ip: string): boolean {
    const localRanges = [
      /^192\.168\./,
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^127\./
    ];
    return localRanges.some(range => range.test(ip));
  }

  /**
   * Start discovering peers on local network
   */
  async startPeerDiscovery() {
    console.log('Starting peer discovery...');
    
    // Simulate LAN discovery using WebRTC signaling
    // In real implementation, this would use:
    // 1. UDP broadcast for initial discovery
    // 2. mDNS/Bonjour for service announcement
    // 3. WebRTC for actual P2P connections
    
    this.discoveryInterval = window.setInterval(() => {
      this.broadcastDiscovery();
    }, 5000);

    // Listen for discovery responses
    this.onMessage('discovery', this.handleDiscoveryMessage.bind(this));
  }

  /**
   * Broadcast discovery message to find peers
   */
  private broadcastDiscovery() {
    const discoveryMessage: NetworkMessage = {
      type: 'discovery',
      from: this.localPeerId,
      data: {
        action: 'announce',
        services: ['chat', 'voice', 'file', 'game'],
        timestamp: new Date(),
        peerInfo: {
          id: this.localPeerId,
          name: `User_${this.localPeerId.slice(-4)}`,
          capabilities: this.getLocalCapabilities()
        }
      },
      timestamp: new Date(),
      messageId: this.generateMessageId()
    };

    // In real implementation, this would be UDP broadcast
    this.simulateLANBroadcast(discoveryMessage);
  }

  /**
   * Get local device capabilities
   */
  private getLocalCapabilities() {
    return {
      audio: navigator.mediaDevices ? true : false,
      video: navigator.mediaDevices ? true : false,
      fileSharing: true,
      gaming: true,
      maxConnections: 8
    };
  }

  /**
   * Simulate LAN broadcast (in real app, this would be actual UDP)
   */
  private simulateLANBroadcast(message: NetworkMessage) {
    // Simulate finding other peers on network
    setTimeout(() => {
      if (Math.random() > 0.3) { // 70% chance of finding peers
        this.simulateDiscoveredPeer();
      }
    }, 1000 + Math.random() * 2000);
  }

  /**
   * Simulate discovering a peer (for demo purposes)
   */
  private simulateDiscoveredPeer() {
    const peerId = `peer_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`;
    const peer: PeerConnection = {
      id: peerId,
      address: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
      port: 8000 + Math.floor(Math.random() * 1000),
      status: 'connecting',
      lastSeen: new Date(),
      services: ['chat', 'voice', 'file']
    };

    this.peers.set(peerId, peer);
    this.establishConnection(peerId);
  }

  /**
   * Establish WebRTC connection with peer
   */
  private async establishConnection(peerId: string) {
    try {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });

      // Create data channel for messaging
      const dataChannel = pc.createDataChannel('lanverse', {
        ordered: true
      });

      dataChannel.onopen = () => {
        console.log(`Data channel opened with ${peerId}`);
        const peer = this.peers.get(peerId);
        if (peer) {
          peer.status = 'connected';
          this.peers.set(peerId, peer);
        }
      };

      dataChannel.onmessage = (event) => {
        const message: NetworkMessage = JSON.parse(event.data);
        this.handleIncomingMessage(message);
      };

      this.connections.set(peerId, pc);
      this.dataChannels.set(peerId, dataChannel);

      // In real implementation, exchange offers/answers through signaling server
      // For demo, we'll simulate successful connection
      setTimeout(() => {
        const peer = this.peers.get(peerId);
        if (peer) {
          peer.status = 'connected';
          this.peers.set(peerId, peer);
        }
      }, 2000);

    } catch (error) {
      console.error(`Failed to connect to ${peerId}:`, error);
    }
  }

  /**
   * Handle discovery messages from other peers
   */
  private handleDiscoveryMessage(message: NetworkMessage) {
    if (message.data.action === 'announce' && message.from !== this.localPeerId) {
      const peerInfo = message.data.peerInfo;
      
      if (!this.peers.has(message.from)) {
        const peer: PeerConnection = {
          id: message.from,
          address: 'unknown', // Would be extracted from UDP packet
          port: 8000,
          status: 'connecting',
          lastSeen: new Date(),
          services: message.data.services
        };
        
        this.peers.set(message.from, peer);
        this.establishConnection(message.from);
      }
    }
  }

  /**
   * Send message to specific peer or broadcast
   */
  async sendMessage(message: Omit<NetworkMessage, 'from' | 'timestamp' | 'messageId'>) {
    const fullMessage: NetworkMessage = {
      ...message,
      from: this.localPeerId,
      timestamp: new Date(),
      messageId: this.generateMessageId()
    };

    if (message.to) {
      // Send to specific peer
      const dataChannel = this.dataChannels.get(message.to);
      if (dataChannel && dataChannel.readyState === 'open') {
        dataChannel.send(JSON.stringify(fullMessage));
      }
    } else {
      // Broadcast to all connected peers
      this.dataChannels.forEach((channel, peerId) => {
        if (channel.readyState === 'open') {
          channel.send(JSON.stringify(fullMessage));
        }
      });
    }
  }

  /**
   * Register message handler for specific message type
   */
  onMessage(type: string, handler: (message: NetworkMessage) => void) {
    this.messageHandlers.set(type, handler);
  }

  /**
   * Handle incoming messages from peers
   */
  private handleIncomingMessage(message: NetworkMessage) {
    const handler = this.messageHandlers.get(message.type);
    if (handler) {
      handler(message);
    }
  }

  /**
   * Get list of connected peers
   */
  getConnectedPeers(): PeerConnection[] {
    return Array.from(this.peers.values()).filter(peer => peer.status === 'connected');
  }

  /**
   * Create or join a room
   */
  async createRoom(roomName: string, isPrivate: boolean = false): Promise<string> {
    this.isHost = true;
    const roomId = this.generateRoomId();
    
    // Announce room creation
    await this.sendMessage({
      type: 'system',
      data: {
        action: 'room_created',
        roomId,
        roomName,
        isPrivate,
        host: this.localPeerId
      }
    });

    return roomId;
  }

  /**
   * Join existing room
   */
  async joinRoom(roomId: string, password?: string): Promise<boolean> {
    await this.sendMessage({
      type: 'system',
      data: {
        action: 'join_room',
        roomId,
        password,
        peerId: this.localPeerId
      }
    });

    return true; // Would wait for confirmation in real implementation
  }

  /**
   * Start file transfer to peer
   */
  async startFileTransfer(peerId: string, file: File): Promise<string> {
    const transferId = this.generateMessageId();
    const chunkSize = 64 * 1024; // 64KB chunks
    const totalChunks = Math.ceil(file.size / chunkSize);

    // Send file metadata
    await this.sendMessage({
      type: 'file',
      to: peerId,
      data: {
        action: 'file_offer',
        transferId,
        fileName: file.name,
        fileSize: file.size,
        totalChunks,
        chunkSize
      }
    });

    return transferId;
  }

  /**
   * Handle voice data streaming
   */
  async startVoiceStream(peerId?: string) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          const audioData = await event.data.arrayBuffer();
          await this.sendMessage({
            type: 'voice',
            to: peerId, // undefined for broadcast
            data: {
              audioData: Array.from(new Uint8Array(audioData)),
              timestamp: Date.now()
            }
          });
        }
      };

      mediaRecorder.start(100); // 100ms chunks for low latency
      return mediaRecorder;
    } catch (error) {
      console.error('Failed to start voice stream:', error);
      throw error;
    }
  }

  /**
   * Cleanup connections
   */
  disconnect() {
    if (this.discoveryInterval) {
      clearInterval(this.discoveryInterval);
    }

    this.dataChannels.forEach(channel => channel.close());
    this.connections.forEach(pc => pc.close());
    
    this.peers.clear();
    this.connections.clear();
    this.dataChannels.clear();
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateRoomId(): string {
    return `room_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`;
  }
}