import React, { useEffect, useState, useCallback } from 'react'
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom'
import { supabase } from '../../supabase'
import * as LucideIcons from 'lucide-react'
import Loading from '../Extra/Loading'

const Root = () => {
    const [loading, setLoading] = useState(true)
    const [userProfile, setUserProfile] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const [msg, setMsg] = useState(false)
    const [copied, setCopied] = useState(false) // Nusxalanganlik holati

    const navigate = useNavigate()
    const location = useLocation()

    const fetchProfile = useCallback(async (userId) => {
        const { data } = await supabase.from('profiles').select('username, avatar_url').eq('id', userId).maybeSingle()
        if (data) {
            setUserProfile(data)
            return data
        }
        return null
    }, [])

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                const profile = await fetchProfile(session.user.id)
                if (profile && location.pathname === '/') {
                    navigate(`/${profile.username}`)
                }
            }
            setLoading(false)
        }
        init()
    }, [fetchProfile, navigate, location.pathname])

    const handleCopy = () => {
        if (userProfile) {
            const url = `${window.location.origin}/${userProfile.username}`
            navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 3000) // 3 sekunddan keyin xabarni o'chirish
        }
    }

    const isEditPath = location.pathname === '/edit'
    const isProfilePath = userProfile && location.pathname === `/${userProfile.username}`

    if (loading) return <Loading />

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans antialiased select-none">

            {/* 1. HEADER */}
            <header className="fixed top-0 left-0 w-full h-10 bg-white/80 backdrop-blur-md z-100 border-b border-slate-100">
                <div className="max-w-2xl mx-auto h-full px-6 flex justify-between items-center">
                    <Link to="/" className="text-lg font-bold tracking-tight flex items-center gap-2">
                        <img src="./Pageem copy.png" alt="Logo" className='w-5 h-5' />
                        <span>Pageem</span>
                    </Link>

                    <div className="flex items-center gap-6">
                        {isEditPath && (
                            <button
                                onClick={() => window.dispatchEvent(new CustomEvent('saveProfileData'))}
                                disabled={isSaving}
                                className="text-sm font-bold text-blue-600 disabled:opacity-30"
                            >
                                {isSaving ? "Saqlanmoqda..." : "Saqlash"}
                            </button>
                        )}
                        {userProfile && (
                            <button onClick={() => supabase.auth.signOut().then(() => { setUserProfile(null); navigate('/'); })}>
                                <LucideIcons.LogOut size={18} className="text-red-400 hover:text-red-500 transition-colors" />
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* 2. MAIN */}
            <main className="pt-16 pb-24">
                <Outlet context={{ setIsSaving, userProfile, isSaving }} />
            </main>

            {/* 3. MOBILE NAV */}
            {userProfile && (
                <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 z-100 sm:hidden">
                    <nav className="flex justify-around items-center h-13">
                        <Link to="/edit" className={isEditPath ? 'text-blue-600' : 'text-slate-400'}>
                            <LucideIcons.UserRoundPenIcon size={22} />
                        </Link>

                        <Link to={`/${userProfile.username}`} className={isProfilePath ? 'ring-2 ring-blue-600 ring-offset-2 rounded-full scale-105' : 'opacity-40'}>
                            <img src={userProfile.avatar_url} className="w-7 h-7 rounded-full object-cover" alt="profile" />
                        </Link>

                        <button onClick={() => setMsg(true)} className="text-slate-400">
                            <LucideIcons.Share2 size={22} />
                        </button>
                    </nav>
                </div>
            )}

            {/* --- MINIMAL SHARE MODAL --- */}
            {msg && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-6 animate-fade-in">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setMsg(false)} />
                    <div className="relative w-full max-w-sm bg-white rounded-2xl p-8 shadow-xl border border-slate-100 animate-scale-up">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Sahifani ulashish</h3>
                        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                            Profilingiz tayyor. Uni Instagram, TikTok yoki Telegram bio qismiga joylashtirib, auditoriyangizni yig'ing.
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => { handleCopy(); }}
                                className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${copied ? "bg-green-50 text-green-600" : "bg-slate-900 text-white active:scale-95"
                                    }`}
                            >
                                {copied ? <LucideIcons.Check size={18} /> : <LucideIcons.Copy size={18} />}
                                {copied ? "Nusxalandi" : "Havolani nusxalash"}
                            </button>

                            <button
                                onClick={() => setMsg(false)}
                                className="w-full py-3 text-sm font-medium text-slate-400"
                            >
                                Yopish
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Root;