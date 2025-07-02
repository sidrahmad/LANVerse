import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gamepad2, 
  Play, 
  Pause, 
  RotateCcw, 
  Trophy,
  Users,
  Clock,
  Zap
} from 'lucide-react';
import { Room, User, GameSession } from '../../types';

interface GamePanelProps {
  room: Room;
  user: User | null;
}

const GamePanel: React.FC<GamePanelProps> = ({ room, user }) => {
  const [activeGame, setActiveGame] = useState<GameSession | null>(null);
  const [gameHistory, setGameHistory] = useState<GameSession[]>([]);
  const [ticTacToeBoard, setTicTacToeBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [gameStats, setGameStats] = useState({
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0
  });

  useEffect(() => {
    // Initialize demo game history
    const demoHistory: GameSession[] = [
      {
        id: '1',
        type: 'tictactoe',
        players: [room.users[0], room.users[1] || room.users[0]],
        status: 'finished',
        winner: room.users[0],
        data: { moves: 7, duration: 45 }
      },
      {
        id: '2',
        type: 'pong',
        players: [room.users[1] || room.users[0], room.users[2] || room.users[0]],
        status: 'finished',
        winner: room.users[1] || room.users[0],
        data: { score: '5-3', duration: 120 }
      }
    ];
    setGameHistory(demoHistory);
    setGameStats({
      gamesPlayed: 15,
      wins: 8,
      losses: 5,
      draws: 2
    });
  }, [room]);

  const startTicTacToe = () => {
    const newGame: GameSession = {
      id: Date.now().toString(),
      type: 'tictactoe',
      players: [user!, room.users.find(u => u.id !== user?.id) || room.users[0]],
      status: 'playing',
      data: { moves: 0, startTime: new Date() }
    };
    setActiveGame(newGame);
    setTicTacToeBoard(Array(9).fill(null));
    setCurrentPlayer('X');
  };

  const handleTicTacToeMove = (index: number) => {
    if (!activeGame || ticTacToeBoard[index] || activeGame.status !== 'playing') return;

    const newBoard = [...ticTacToeBoard];
    newBoard[index] = currentPlayer;
    setTicTacToeBoard(newBoard);

    // Check for winner
    const winner = checkWinner(newBoard);
    if (winner) {
      setActiveGame({
        ...activeGame,
        status: 'finished',
        winner: currentPlayer === 'X' ? activeGame.players[0] : activeGame.players[1],
        data: { ...activeGame.data, moves: activeGame.data.moves + 1, endTime: new Date() }
      });
    } else if (newBoard.every(cell => cell !== null)) {
      setActiveGame({
        ...activeGame,
        status: 'finished',
        data: { ...activeGame.data, moves: activeGame.data.moves + 1, endTime: new Date() }
      });
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
      setActiveGame({
        ...activeGame,
        data: { ...activeGame.data, moves: activeGame.data.moves + 1 }
      });
    }
  };

  const checkWinner = (board: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const resetGame = () => {
    setActiveGame(null);
    setTicTacToeBoard(Array(9).fill(null));
    setCurrentPlayer('X');
  };

  return (
    <div className="h-full bg-slate-900/20 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Game Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 text-center">
            <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{gameStats.wins}</p>
            <p className="text-slate-400 text-sm">Wins</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 text-center">
            <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{gameStats.gamesPlayed}</p>
            <p className="text-slate-400 text-sm">Games Played</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 text-center">
            <Clock className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{gameStats.draws}</p>
            <p className="text-slate-400 text-sm">Draws</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 text-center">
            <Zap className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{Math.round((gameStats.wins / gameStats.gamesPlayed) * 100)}%</p>
            <p className="text-slate-400 text-sm">Win Rate</p>
          </div>
        </motion.div>

        {/* Active Game */}
        <motion.div
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Game Center</h2>
            <div className="flex space-x-3">
              {!activeGame ? (
                <>
                  <motion.button
                    onClick={startTicTacToe}
                    className="flex items-center px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Tic-Tac-Toe
                  </motion.button>
                  <motion.button
                    className="flex items-center px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Gamepad2 className="h-4 w-4 mr-2" />
                    Pong
                  </motion.button>
                </>
              ) : (
                <motion.button
                  onClick={resetGame}
                  className="flex items-center px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </motion.button>
              )}
            </div>
          </div>

          {/* Tic-Tac-Toe Game */}
          <AnimatePresence>
            {activeGame && activeGame.type === 'tictactoe' && (
              <motion.div
                className="max-w-md mx-auto"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <div className="text-center mb-4">
                  <p className="text-lg text-white mb-2">
                    {activeGame.status === 'playing' ? (
                      <>Current Player: <span className="text-blue-400">{currentPlayer}</span></>
                    ) : activeGame.winner ? (
                      <>Winner: <span className="text-green-400">{activeGame.winner.name}</span></>
                    ) : (
                      <span className="text-orange-400">It's a draw!</span>
                    )}
                  </p>
                  <div className="flex justify-center space-x-4 text-sm text-slate-400">
                    <span>Moves: {activeGame.data.moves}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  {ticTacToeBoard.map((cell, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleTicTacToeMove(index)}
                      className="w-20 h-20 bg-slate-700/50 border border-slate-600 rounded-lg text-2xl font-bold text-white hover:bg-slate-700 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={!!cell || activeGame.status !== 'playing'}
                    >
                      {cell}
                    </motion.button>
                  ))}
                </div>

                <div className="flex justify-center space-x-4">
                  {activeGame.players.map((player, index) => (
                    <div key={player.id} className="text-center">
                      <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center text-xl mb-2">
                        {player.avatar}
                      </div>
                      <p className="text-sm text-white">{player.name}</p>
                      <p className="text-xs text-slate-400">{index === 0 ? 'X' : 'O'}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* No Active Game */}
          {!activeGame && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Gamepad2 className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-400 mb-2">No Active Game</h3>
              <p className="text-slate-500">Choose a game to start playing with other users</p>
            </motion.div>
          )}
        </motion.div>

        {/* Game History */}
        <motion.div
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4">Game History</h3>
          
          <div className="space-y-3">
            {gameHistory.map((game) => (
              <motion.div
                key={game.id}
                className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-4">
                    <Gamepad2 className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium capitalize">{game.type}</p>
                    <p className="text-slate-400 text-sm">
                      {game.players.map(p => p.name).join(' vs ')}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  {game.winner ? (
                    <p className="text-green-400 font-medium">{game.winner.name} won</p>
                  ) : (
                    <p className="text-orange-400 font-medium">Draw</p>
                  )}
                  <p className="text-slate-400 text-sm">
                    {game.data.duration ? `${game.data.duration}s` : 'Quick game'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GamePanel;