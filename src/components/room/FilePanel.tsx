import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Download, 
  File, 
  Folder, 
  Trash2, 
  Pause, 
  Play,
  FileText,
  Image,
  Music,
  Video,
  Archive,
  MoreHorizontal
} from 'lucide-react';
import { Room, User, FileTransfer } from '../../types';

interface FilePanelProps {
  room: Room;
  user: User | null;
}

const FilePanel: React.FC<FilePanelProps> = ({ room, user }) => {
  const [activeTransfers, setActiveTransfers] = useState<FileTransfer[]>([]);
  const [sharedFiles, setSharedFiles] = useState<any[]>([]);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    // Initialize with demo data
    const demoTransfers: FileTransfer[] = [
      {
        id: '1',
        name: 'project-assets.zip',
        size: 15728640, // 15MB
        sender: room.users[0],
        progress: 67,
        status: 'transferring',
        chunks: 100,
        completedChunks: 67,
        startTime: new Date(Date.now() - 30000)
      },
      {
        id: '2',
        name: 'demo-video.mp4',
        size: 52428800, // 50MB
        sender: room.users[1] || room.users[0],
        progress: 100,
        status: 'completed',
        chunks: 200,
        completedChunks: 200,
        startTime: new Date(Date.now() - 120000),
        endTime: new Date(Date.now() - 30000)
      }
    ];
    setActiveTransfers(demoTransfers);

    const demoFiles = [
      {
        id: '1',
        name: 'Design Guidelines.pdf',
        size: 2048576,
        type: 'pdf',
        owner: room.users[0],
        uploadedAt: new Date(Date.now() - 3600000)
      },
      {
        id: '2',
        name: 'Screenshot_2024.png',
        size: 1024000,
        type: 'image',
        owner: room.users[1] || room.users[0],
        uploadedAt: new Date(Date.now() - 7200000)
      },
      {
        id: '3',
        name: 'meeting-notes.txt',
        size: 4096,
        type: 'text',
        owner: room.users[2] || room.users[0],
        uploadedAt: new Date(Date.now() - 10800000)
      }
    ];
    setSharedFiles(demoFiles);

    // Simulate transfer progress
    const interval = setInterval(() => {
      setActiveTransfers(prev => 
        prev.map(transfer => {
          if (transfer.status === 'transferring' && transfer.progress < 100) {
            const newProgress = Math.min(100, transfer.progress + Math.random() * 10);
            return {
              ...transfer,
              progress: newProgress,
              completedChunks: Math.floor((newProgress / 100) * transfer.chunks),
              status: newProgress >= 100 ? 'completed' : 'transferring',
              endTime: newProgress >= 100 ? new Date() : undefined
            };
          }
          return transfer;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [room]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'text':
        return FileText;
      case 'image':
        return Image;
      case 'video':
        return Video;
      case 'audio':
        return Music;
      case 'zip':
      case 'rar':
        return Archive;
      default:
        return File;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      const newTransfer: FileTransfer = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        size: file.size,
        sender: user!,
        progress: 0,
        status: 'transferring',
        chunks: Math.ceil(file.size / 64000), // 64KB chunks
        completedChunks: 0,
        startTime: new Date()
      };
      setActiveTransfers(prev => [...prev, newTransfer]);
    });
  };

  const pauseTransfer = (id: string) => {
    setActiveTransfers(prev =>
      prev.map(transfer =>
        transfer.id === id ? { ...transfer, status: 'paused' } : transfer
      )
    );
  };

  const resumeTransfer = (id: string) => {
    setActiveTransfers(prev =>
      prev.map(transfer =>
        transfer.id === id ? { ...transfer, status: 'transferring' } : transfer
      )
    );
  };

  return (
    <div className="h-full bg-slate-900/20 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* File Upload Area */}
        <motion.div
          className={`relative border-2 border-dashed rounded-xl p-8 mb-6 transition-all duration-200 ${
            dragActive 
              ? 'border-blue-400 bg-blue-500/10' 
              : 'border-slate-600 bg-slate-800/30'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center">
            <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {dragActive ? 'Drop files here' : 'Drag & drop files to share'}
            </h3>
            <p className="text-slate-400 mb-4">
              or click to browse files
            </p>
            <motion.button
              className="px-6 py-3 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Choose Files
            </motion.button>
          </div>
        </motion.div>

        {/* Active Transfers */}
        {activeTransfers.length > 0 && (
          <motion.div
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">Active Transfers</h3>
            
            <div className="space-y-4">
              {activeTransfers.map((transfer) => (
                <motion.div
                  key={transfer.id}
                  className="flex items-center p-4 bg-slate-700/50 rounded-lg"
                  layout
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white font-medium">{transfer.name}</p>
                      <div className="flex items-center space-x-2">
                        {transfer.status === 'transferring' && (
                          <motion.button
                            onClick={() => pauseTransfer(transfer.id)}
                            className="p-1 text-slate-400 hover:text-white transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Pause className="h-4 w-4" />
                          </motion.button>
                        )}
                        {transfer.status === 'paused' && (
                          <motion.button
                            onClick={() => resumeTransfer(transfer.id)}
                            className="p-1 text-slate-400 hover:text-white transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Play className="h-4 w-4" />
                          </motion.button>
                        )}
                        <motion.button
                          className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <span>{formatFileSize(transfer.size)}</span>
                      <span>•</span>
                      <span>{transfer.sender.name}</span>
                      <span>•</span>
                      <span className={`${
                        transfer.status === 'completed' ? 'text-green-400' :
                        transfer.status === 'transferring' ? 'text-blue-400' :
                        transfer.status === 'paused' ? 'text-orange-400' :
                        'text-red-400'
                      }`}>
                        {transfer.status}
                      </span>
                    </div>
                    
                    <div className="mt-2 flex items-center">
                      <div className="flex-1 bg-slate-600 rounded-full h-2 mr-3">
                        <motion.div
                          className={`h-2 rounded-full ${
                            transfer.status === 'completed' ? 'bg-green-400' :
                            transfer.status === 'transferring' ? 'bg-blue-400' :
                            'bg-orange-400'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${transfer.progress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <span className="text-sm text-slate-400">{transfer.progress}%</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Shared Files */}
        <motion.div
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4">Shared Files</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sharedFiles.map((file) => {
              const FileIcon = getFileIcon(file.type);
              return (
                <motion.div
                  key={file.id}
                  className="group p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                        <FileIcon className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{file.name}</p>
                        <p className="text-slate-400 text-xs">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <motion.button
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-white transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </motion.button>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Shared by {file.owner.name}</span>
                    <motion.button
                      className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FilePanel;