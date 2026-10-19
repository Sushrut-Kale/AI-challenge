'use client';

export default function WebGLFallback() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#1a1a2e] to-[#0f3460]">
      <div className="text-center max-w-md px-6">
        <div className="text-6xl mb-6">🎮</div>
        <h2
          className="text-white font-bold mb-4"
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 'clamp(10px, 3vw, 18px)',
            textShadow: '2px 2px 0 #FF8C42',
          }}
        >
          WebGL Not Available
        </h2>
        <p className="text-gray-400 mb-6 text-sm leading-relaxed">
          Your browser or device does not support WebGL, which is required to render the 3D Minecraft world.
        </p>
        <p className="text-gray-500 text-xs">
          Try Chrome, Firefox, or Edge on a modern device with hardware acceleration enabled.
        </p>
        <div className="mt-8 p-4 bg-[#1E3A8A]/30 border border-[#3F76E4]/40 rounded-lg">
          <p className="text-[#5BB2E8] text-xs font-semibold">
            🏆 National Agentic AI Challenge
          </p>
          <p className="text-gray-400 text-xs mt-1">
            MIT Academy of Engineering
          </p>
        </div>
      </div>
    </div>
  );
}
