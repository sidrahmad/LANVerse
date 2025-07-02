export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'busy';
  joinedAt: Date;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  host: User;
  users: User[];
  maxUsers: number;
  services: RoomService[];
  created: Date;
  isPrivate: boolean;
  password?: string;
}

export interface RoomService {
  type: 'chat' | 'voice' | 'file' | 'game' | 'whiteboard';
  enabled: boolean;
  port?: number;
}

export interface ChatMessage {
  id: string;
  sender: User;
  content: string;
  timestamp: Date;
  type: 'text' | 'system' | 'file' | 'game';
}

export interface FileTransfer {
  id: string;
  name: string;
  size: number;
  sender: User;
  receiver?: User;
  progress: number;
  status: 'pending' | 'transferring' | 'completed' | 'failed' | 'paused';
  chunks: number;
  completedChunks: number;
  startTime: Date;
  endTime?: Date;
}

export interface GameSession {
  id: string;
  type: 'tictactoe' | 'pong' | 'snake';
  players: User[];
  status: 'waiting' | 'playing' | 'finished';
  winner?: User;
  data: any;
}

export interface VoiceChannel {
  id: string;
  name: string;
  users: User[];
  isActive: boolean;
}