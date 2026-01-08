import React, { useEffect, useState, useCallback } from 'react'
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom'
import { supabase } from '../../supabase'
import * as LucideIcons from 'lucide-react'
import Loading from '../Extra/Loading'

const Root = () => {
    const [loading, setLoading] = useState(true)
    const [userProfile, setUserProfile] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const fetchProfile = useCallback(async (userId) => {
        const { data } = await supabase.from('profiles').select('username, avatar_url').eq('id', userId).maybeSingle()
        if (data) setUserProfile(data)
    }, [])

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) await fetchProfile(session.user.id)
            setLoading(false)
        }
        init()
    }, [fetchProfile])

    const isEditPath = location.pathname === '/edit';
    const isProfilePath = userProfile && location.pathname === `/${userProfile.username}`;
    const isHomePath = location.pathname === '/';

    if (loading) return <Loading />

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans antialiased select-none">
            {/* 1. TOP HEADER - Premium Glassmorphism */}
            <header className="fixed top-0 left-0 w-full h-16  bg-white/30 backdrop-blur-xs z-[100]">
                <div className="max-w-2xl mx-auto h-full px-6 flex justify-between items-center">
                    <Link to="/" className="text-xl font-black tracking-tighter flex items-center justify-center gap-2 group">
                        <img src="./Pageem copy.png" alt="" className='w-6 h-5' />
                        <span className=''>Pageem.</span>
                    </Link>

                    {/* Desktop Menu (hidden on mobile) */}
                    <nav className="hidden md:flex items-center gap-8">
                        {userProfile ? (
                            <button
                                onClick={() => supabase.auth.signOut().then(() => {
                                    setUserProfile(null);
                                    navigate('/');
                                })}
                                className="text-xs font-black uppercase tracking-widest text-red-500 hover:opacity-70 transition-opacity"
                            >
                                <LucideIcons.LogOut />
                            </button>
                        ) : (
                            <Link to="/create" className=" text-xs font-black uppercase tracking-widest text-blue-600">
                                Boshlash
                            </Link>
                        )}
                    </nav>

                    {/* Mobile Save Button Area */}
                    {isEditPath && (
                        <button
                            onClick={() => window.dispatchEvent(new CustomEvent('saveProfileData'))}
                            disabled={isSaving}
                            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isSaving
                                ? "bg-slate-50 text-slate-300 cursor-not-allowed"
                                : "bg-blue-600 text-white shadow-lg shadow-blue-500/20 active:scale-95"
                                }`}
                        >
                            {isSaving ? "..." : "Saqlash"}
                        </button>
                    )}
                </div>
            </header>

            {/* 2. MAIN CONTENT AREA */}
            <main className="pt-16 pb-24 md:pb-12">
                <Outlet context={{ setIsSaving, userProfile, isSaving }} />
            </main>

            {/* 3. MOBILE BOTTOM NAV - Dynamic Dock Style */}
            {userProfile && (
                <div className="md:hidden fixed bottom-0 left-0 w-full px-6 pb-6 pt-2 bg-gradient-to-t from-white via-white/90 to-transparent z-[100]">
                    <nav className="flex justify-between items-center bg-slate-900/95 backdrop-blur-2xl px-8 py-4 rounded-[2.5rem] shadow-2xl shadow-slate-900/20 border border-white/10">
                        {/* Home Link */}
                        <Link to="/" className={`transition-all duration-300 ${isHomePath ? 'text-white scale-110' : 'text-slate-500 hover:text-slate-300'}`}>
                            <LucideIcons.LayoutGrid size={22} strokeWidth={isHomePath ? 2.5 : 2} />
                        </Link>

                        {/* Edit/Create Link */}
                        <Link to="/edit" className={`transition-all duration-300 ${isEditPath ? 'text-blue-400 scale-110' : 'text-slate-500 hover:text-slate-300'}`}>
                            <LucideIcons.PlusCircle size={24} strokeWidth={isEditPath ? 2.5 : 2} />
                        </Link>

                        {/* Profile Link */}
                        <Link
                            to={`/${userProfile.username}`}
                            className={`p-0.5 rounded-full transition-all duration-300 ${isProfilePath ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900 scale-110' : 'grayscale opacity-50 hover:opacity-100 hover:grayscale-0'}`}
                        >
                            <img
                                src={userProfile.avatar_url}
                                className="w-6 h-6 rounded-full object-cover bg-slate-800"
                                alt="me"
                            />
                        </Link>
                    </nav>
                </div>
            )}
        </div>
    )
}
export default Root;