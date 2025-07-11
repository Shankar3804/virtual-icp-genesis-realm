
import React from 'react';

interface VRSceneProps {
  userCount: number;
  onInteraction: () => void;
}

const VRScene: React.FC<VRSceneProps> = ({ userCount, onInteraction }) => {
  return (
    <div 
      className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 rounded-lg relative overflow-hidden cursor-pointer"
      onClick={onInteraction}
    >
      {/* Simulated VR Environment */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Grid pattern for VR effect */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-ping"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        />
      ))}
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4 neon-text">🌐</div>
          <h3 className="text-2xl font-bold neon-text mb-2">VR World Active</h3>
          <p className="text-cyan-300">{userCount} users connected</p>
          <p className="text-sm text-cyan-400 mt-2">Click to interact</p>
        </div>
      </div>
      
      {/* Corner UI elements */}
      <div className="absolute top-4 left-4 text-cyan-300 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span>Connected</span>
        </div>
      </div>
      
      <div className="absolute top-4 right-4 text-cyan-300 text-sm">
        <div>FPS: 60</div>
      </div>
    </div>
  );
};

export default VRScene;
