import React from 'react'

const Loading = () => {
    return (
        <div className="fixed inset-0 z-999 bg-white flex flex-col items-center justify-center">
            {/* Logo Section - Minimal & Sharp */}
            <div className="w-20 h-20">
                <img src="./Pageem copy.png" alt="" />
            </div>
            {/* Progress Section */}
            <div className="flex flex-col items-center w-full max-w-35">
                <span className="text-[10px] font-black tracking-[0.4em] text-slate-300 uppercase mb-4">
                    Initializing
                </span>

                {/* Ultra-thin loading bar */}
                <div className="w-full h-px bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 animate-loading-bar" />
                </div>
            </div>

            {/* Optimized CSS */}
            <style>{`
                @keyframes loading-bar {
                    0% { transform: translateX(-100%); width: 10%; }
                    50% { width: 40%; }
                    100% { transform: translateX(1000%); width: 10%; }
                }
                .animate-loading-bar {
                    animation: loading-bar 1.5s cubic-bezier(0.65, 0, 0.35, 1) infinite;
                }
            `}</style>
        </div>
    )
}

export default Loading