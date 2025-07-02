import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Smile, Hash } from 'lucide-react';
import { Room, User, ChatMessage } from '../../types';

interface ChatPanelProps {
  room: Room;
  user: User | null;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ room, user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with demo messages
    const demoMessages: ChatMessage[] = [
      {
        id: '1',
        sender: room.users[0],
        content: 'Welcome to the room! 🎉',
        timestamp: new Date(Date.now() - 300000),
        type: 'text'
      },
      {
        id: '2',
        sender: room.users[1] || room.users[0],
        content: 'Thanks! Great to be here.',
        timestamp: new Date(Date.now() - 240000),
        type: 'text'
      },
      {
        id: '3',
        sender: room.users[0],
        content: 'Share_Document.pdf',
        timestamp: new Date(Date.now() - 180000),
        type: 'file'
      },
      {
        id: '4',
        sender: room.users[2] || room.users[0],
        content: 'Anyone up for a quick game?',
        timestamp: new Date(Date.now() - 120000),
        type: 'text'
      }
    ];
    setMessages(demoMessages);
  }, [room]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !user) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: user,
      content: inputMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageTypeIcon = (type: ChatMessage['type']) => {
    switch (type) {
      case 'file':
        return <Paperclip className="h-4 w-4 text-blue-400" />;
      case 'system':
        return <Hash className="h-4 w-4 text-green-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/20">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={`flex ${message.sender.id === user?.id ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className={`max-w-xs lg:max-w-md ${
                message.sender.id === user?.id
                  ? 'bg-blue-500/20 text-blue-100'
                  : 'bg-slate-700/50 text-slate-200'
              } rounded-lg p-3 backdrop-blur-sm`}>
                {message.sender.id !== user?.id && (
                  <div className="flex items-center mb-1">
                    <span className="text-xs font-medium text-slate-400">
                      {message.sender.name}
                    </span>
                    <span className="text-lg ml-2">{message.sender.avatar}</span>
                  </div>
                )}
                
                <div className="flex items-start space-x-2">
                  {getMessageTypeIcon(message.type)}
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <span className="text-xs text-slate-400 mt-1 block">
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-slate-700/50 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-800/50 backdrop-blur-sm border-t border-slate-700/50">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <div className="relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 resize-none"
                rows={1}
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <motion.button
              className="p-3 text-slate-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Paperclip className="h-5 w-5" />
            </motion.button>
            
            <motion.button
              className="p-3 text-slate-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Smile className="h-5 w-5" />
            </motion.button>
            
            <motion.button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Send className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;