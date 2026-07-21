export default function PageLoader() {
  return (
    <div className="fixed inset-0 bg-[#0d0d0d] flex items-center justify-center z-50">
      <div style={{ animation: 'breathe 2s ease-in-out infinite' }}>
        <svg width="120" height="60" viewBox="0 0 120 60" overflow="visible">
          <path
            d="M60,30 C60,10 90,10 90,30 C90,50 60,50 60,30 C60,10 30,10 30,30 C30,50 60,50 60,30"
            fill="none" stroke="#1e1e1e" strokeWidth="4" strokeLinecap="round"
          />
          <path
            d="M60,30 C60,10 90,10 90,30 C90,50 60,50 60,30 C60,10 30,10 30,30 C30,50 60,50 60,30"
            fill="none" stroke="#b4f72a" strokeWidth="4" strokeLinecap="round"
            strokeDasharray="40 220"
            style={{ animation: 'run 2s linear infinite' }}
          />
        </svg>
      </div>

      <style>{`
        @keyframes breathe {
          0%, 100% { filter: drop-shadow(0 0 6px #b4f72a44) drop-shadow(0 0 18px #b4f72a22); }
          50%       { filter: drop-shadow(0 0 18px #b4f72aaa) drop-shadow(0 0 50px #b4f72a55); }
        }
        @keyframes run {
          to { stroke-dashoffset: -260; }
        }
      `}</style>
    </div>
  )
}
