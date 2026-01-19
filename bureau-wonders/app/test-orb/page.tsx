import WebGLOrb from '@/components/backgrounds/WebGLOrb';

export default function TestOrbPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="relative w-full h-screen">
        {/* WebGL Orb Test */}
        <WebGLOrb 
          className="absolute inset-0"
          hue={45} // Gold
          hoverIntensity={0.3}
          rotateOnHover={true}
          forceHoverState={false}
        />
        
        {/* Test Content */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center text-white">
            <h1 className="text-6xl font-bold mb-4">
              WebGL Orb Test
            </h1>
            <p className="text-xl mb-8">
              คุณควรเห็น Orb สีม่วงน้ำเงินที่เคลื่อนไหวและตอบสนองเมาส์
            </p>
            <button 
              onClick={() => window.location.href = '/about'}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
            >
              กลับไปหน้า About
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}