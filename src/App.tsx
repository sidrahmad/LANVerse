import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import RoomDiscovery from './components/RoomDiscovery';
import RoomInterface from './components/RoomInterface';
import { Room, User } from './types';

type AppState = 'landing' | 'discovery' | 'room';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('landing');
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Initialize with demo user
    setCurrentUser({
      id: '1',
      name: 'Demo User',
      avatar: '🚀',
      status: 'online',
      joinedAt: new Date(),
    });
  }, []);

  const handleEnterPlatform = () => {
    setCurrentState('discovery');
  };

  const handleJoinRoom = (room: Room) => {
    setCurrentRoom(room);
    setCurrentState('room');
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
    setCurrentState('discovery');
  };

  const pageVariants = {
    enter: { opacity: 0, y: 20 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <AnimatePresence mode="wait">
        {currentState === 'landing' && (
          <motion.div
            key="landing"
            initial="enter"
            animate="center"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            <LandingPage onEnter={handleEnterPlatform} />
          </motion.div>
        )}

        {currentState === 'discovery' && (
          <motion.div
            key="discovery"
            initial="enter"
            animate="center"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            <RoomDiscovery onJoinRoom={handleJoinRoom} />
          </motion.div>
        )}

        {currentState === 'room' && currentRoom && (
          <motion.div
            key="room"
            initial="enter"
            animate="center"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            <RoomInterface room={currentRoom} user={currentUser} onLeave={handleLeaveRoom} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;