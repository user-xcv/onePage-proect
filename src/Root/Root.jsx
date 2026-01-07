import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate, Link, useLocation, useParams } from 'react-router-dom'
import { supabase } from '../../supabase'
import * as LucideIcons from 'lucide-react'

const Root = () => {
    const [loading, setLoading] = useState(true)
    const [userProfile, setUserProfile] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const [copied, setCopied] = useState(false)

    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: { session }, error: authError } = await supabase.auth.getSession()
                if (authError) throw authError

                if (!session) {
                    navigate('/')
                    return
                }

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('id, username, avatar_url')
                    .eq('id', session.user.id)
                    .maybeSingle()

                if (profile) {
                    setUserProfile(profile)
                    if (location.pathname === '/') {
                        navigate(`/${profile.username}`)
                    }
                }
            } catch (error) {
                console.error('Auth xatosi:', error.message)
            } finally {
                setLoading(false)
            }
        }
        checkAuth()
    }, [navigate])

    const isActive = (path) => location.pathname === path;
    const isProfilePage = location.pathname === `/${userProfile?.username}`;

    const triggerSave = () => {
        const event = new CustomEvent('saveProfileData')
        window.dispatchEvent(event)
    }

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.origin + '/' + userProfile?.username)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (loading) return (
        <div className="flex h-screen items-center justify-center font-bold text-gray-400 animate-pulse">
            Yuklanmoqda...
        </div>
    )

    return (
        <div className="min-h-screen bg-white">
            {/* TOP HEADER */}
            <header className="fixed top-0 left-0 w-full bg-white/60 backdrop-blur-xl border-b border-gray-100/50 z-[100] px-4 py-2">
                <div className="mx-auto container flex justify-between items-center max-w-2xl">
                    {isProfilePage ? (
                        <span className="font-bold text-gray-800 tracking-tight">Mening Sahifam</span>
                    ) : (
                        <>
                            <button onClick={() => navigate(-1)} className="text-gray-900 font-medium active:opacity-50 text-sm">
                                Bekor qilish
                            </button>
                            <button
                                onClick={triggerSave}
                                disabled={isSaving}
                                className={`font-bold text-sm transition-all ${isSaving ? 'text-gray-300' : 'text-blue-600'}`}
                            >
                                {isSaving ? "Saqlanmoqda..." : "Bajarildi"}
                            </button>
                        </>
                    )}
                </div>
            </header>

            <main className='pb-12 pt-5'>
                <Outlet context={{ setIsSaving }} />
            </main>

            {/* BOTTOM NAV - Responsive Control */}
            <nav className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-gray-100 px-6 py-1 z-50 md:hidden ">
                <div className="max-w-md mx-auto flex justify-between items-center h-14">

                    {/* 1. Edit Icon (Faqat Mobil) */}
                    <Link
                        to="/edit"
                        className={`p-3 transition-all md:hidden ${isActive('/edit') ? 'text-blue-600' : 'text-gray-400'}`}
                    >
                        <LucideIcons.Settings size={24} strokeWidth={isActive('/edit') ? 2.5 : 2} />
                    </Link>

                    {/* 2. Profile Avatar (Asosiy Markaz) */}
                    <Link to={`/${userProfile?.username}`} className="p-1 transition-all">
                        <div className={`w-9 h-9 rounded-full border-2 overflow-hidden transition-all ${isActive(`/${userProfile?.username}`) ? 'border-black scale-110 shadow-md' : 'border-transparent opacity-70'}`}>
                            {userProfile?.avatar_url ? (
                                <img src={userProfile.avatar_url} alt="profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                    <LucideIcons.User size={18} />
                                </div>
                            )}
                        </div>
                    </Link>

                    {/* 3. Share Icon (Faqat Mobil va faqat o'z profilida) */}
                    <button
                        onClick={copyLink}
                        className={`p-3 transition-all md:hidden ${isProfilePage ? (copied ? 'text-green-500' : 'text-gray-400') : 'opacity-0 pointer-events-none'}`}
                    >
                        {copied ? <LucideIcons.Check size={24} /> : <LucideIcons.Share size={24} />}
                    </button>
                </div>
            </nav>
        </div>
    )
}

export default Root;