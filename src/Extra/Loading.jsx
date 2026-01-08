import React from 'react'

const Loading = () => {
    return (
        <div className="fixed inset-0 z-[999] bg-white flex flex-col items-center justify-center">
            {/* Logo Section - Minimal & Sharp */}
            <div className="relative mb-12 flex flex-col items-center">
                {/* Brand Mark (Logo o'rniga yoki yoniga) */}
                <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center mb-6 animate-pulse shadow-2xl shadow-slate-100">
                    <div className="w-6 h-6 bg-white rounded-sm rotate-45" />
                </div>

                <h2 className="text-xl font-black tracking-tighter text-slate-900">
                    OnePage<span className="text-blue-600">.</span>
                </h2>
            </div>

            {/* Progress Section */}
            <div className="flex flex-col items-center w-full max-w-[140px]">
                <span className="text-[10px] font-black tracking-[0.4em] text-slate-300 uppercase mb-4">
                    Initializing
                </span>

                {/* Ultra-thin loading bar */}
                <div className="w-full h-[1px] bg-slate-100 rounded-full overflow-hidden">
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