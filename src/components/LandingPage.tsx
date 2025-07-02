import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, Users, MessageSquare, Share as FileShare, Gamepad2, Shield, Network, Zap, ChevronRight, Github, Play } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const features = [
    {
      icon: Network,
      title: 'P2P LAN Discovery',
      description: 'Discover and connect to rooms over local network without internet dependency'
    },
    {
      icon: MessageSquare,
      title: 'Real-time Chat',
      description: 'Instant messaging with file sharing and emoji support'
    },
    {
      icon: FileShare,
      title: 'File Transfer',
      description: 'High-speed file sharing with pause/resume capability'
    },
    {
      icon: Gamepad2,
      title: 'Mini Games',
      description: 'Built-in multiplayer games with real-time synchronization'
    },
    {
      icon: Shield,
      title: 'Secure Communication',
      description: 'Encrypted channels with optional password protection'
    },
    {
      icon: Zap,
      title: 'Low Latency',
      description: 'Optimized UDP/TCP protocols for responsive interactions'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-20"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight 
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          />
        ))}
      </div>

      <motion.div 
        className="relative z-10 container mx-auto px-6 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          variants={itemVariants}
        >
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Network className="h-16 w-16 text-blue-400 mr-4" />
              <motion.div
                className="absolute inset-0 bg-blue-400 rounded-full blur-lg opacity-20"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
              LANVerse
            </h1>
          </div>
          
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            A decentralized, real-time LAN-based virtual space where users can join customizable rooms,
            chat via voice/text, share files, and play mini-games using custom protocols over UDP/TCP sockets.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium border border-blue-500/30">
              P2P Networking
            </span>
            <span className="px-4 py-2 bg-green-500/20 text-green-300 rounded-full text-sm font-medium border border-green-500/30">
              Real-time Communication
            </span>
            <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30">
              Multiplayer Gaming
            </span>
            <span className="px-4 py-2 bg-orange-500/20 text-orange-300 rounded-full text-sm font-medium border border-orange-500/30">
              File Sharing
            </span>
          </div>

          <motion.button
            onClick={onEnter}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center">
              <Play className="h-5 w-5 mr-2" />
              Enter LANVerse
              <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          variants={itemVariants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300"
              whileHover={{ y: -5 }}
              variants={itemVariants}
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-500/20 rounded-lg mr-4 group-hover:bg-blue-500/30 transition-colors">
                  <feature.icon className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              </div>
              <p className="text-slate-300 leading-relaxed">{feature.description}</p>
              
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </motion.div>

        {/* Architecture Overview */}
        <motion.div 
          className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50"
          variants={itemVariants}
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-white">System Architecture</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wifi className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Discovery Layer</h3>
              <p className="text-slate-300 text-sm">UDP broadcasting for room discovery and service announcement</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Communication Layer</h3>
              <p className="text-slate-300 text-sm">TCP for reliable messaging, UDP for real-time streams</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Security Layer</h3>
              <p className="text-slate-300 text-sm">AES encryption with optional room password protection</p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="text-center mt-16 pt-8 border-t border-slate-700/50"
          variants={itemVariants}
        >
          <div className="flex justify-center items-center space-x-6">
            <a 
              href="#" 
              className="flex items-center text-slate-400 hover:text-white transition-colors"
            >
              <Github className="h-5 w-5 mr-2" />
              View on GitHub
            </a>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Built with React + TypeScript</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LandingPage;