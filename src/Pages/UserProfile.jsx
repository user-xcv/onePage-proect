import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { useNavigate, useParams } from 'react-router-dom'
import * as LucideIcons from 'lucide-react'

const UserProfile = () => {
    const { username } = useParams()
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [currentId, setCurrentId] = useState(null)
    const [copied, setCopied] = useState(false)

    const SOCIAL_CONFIG = {
        instagram: { color: 'text-pink-600', bg: 'bg-pink-50', icon: 'Instagram' },
        telegram: { color: 'text-blue-500', bg: 'bg-blue-50', icon: 'Send' },
        whatsapp: { color: 'text-green-500', bg: 'bg-green-50', icon: 'MessageCircle' },
        youtube: { color: 'text-red-600', bg: 'bg-red-50', icon: 'Youtube' },
        github: { color: 'text-slate-900', bg: 'bg-slate-100', icon: 'Github' },
        facebook: { color: 'text-blue-700', bg: 'bg-blue-50', icon: 'Facebook' },
        email: { color: 'text-orange-500', bg: 'bg-orange-50', icon: 'Mail' },
        phone: { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: 'Phone' },
    };

    useEffect(() => {
        const userData = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setCurrentId(session?.user?.id)

            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('username', username)
                .maybeSingle()

            if (data) setProfile(data)
            setLoading(false)
        }
        userData()
    }, [username])

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-300 font-medium animate-pulse tracking-widest uppercase text-xs">Yuklanmoqda...</div>

    if (!profile) return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6">
                <LucideIcons.SearchX size={32} className="text-slate-200" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Profil topilmadi</h1>
            <p className="text-slate-400 mt-2 max-w-[240px]">Bunday foydalanuvchi tizimda ro'yxatdan o'tmagan.</p>
            <button onClick={() => navigate('/')} className="mt-8 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all">Bosh sahifa</button>
        </div>
    )

    const isOwner = currentId === profile.id;

    return (
        <div className="flex flex-col min-h-screen bg-white selection:bg-blue-100">
            {/* 1. Header Banner */}
            <div className="relative h-72 md:h-80 w-full overflow-hidden bg-white">
                {/* Banner Konteneri */}

                {profile.headline && (
                    <span className="inline-block text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] bg-blue-50/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-blue-100/50">
                        {profile.headline}
                    </span>
                )}

                <div
                    className="absolute inset-0 "
                    style={{
                        // Bu kod ikki chetini pastga qarab chuqur oysimon qiladi
                        clipPath: 'ellipse(120% 90% at 50% 20%)'
                    }}
                >

                    {profile.avatar_url ? (
                        <div className="relative w-full h-full">
                            {/* Asosiy rasm */}
                            <img
                                src={profile.avatar_url}
                                className="w-full h-full object-cover blur-xs scale-110"
                                alt="bg"
                            />

                            {/* Tonirovka va Soft Blur */}
                            <div className="absolute inset-0 backdrop-blur-[4px] bg-black/30" />

                            {/* Pastki qirralarni ta'kidlash uchun gradient */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
                        </div>
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-900" />
                    )}

                </div>

                {/* Oysimon chetidagi nurli chegara (Border effect) */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-30"
                    style={{
                        clipPath: 'ellipse(120% 100% at 50% 0%)',
                        borderBottom: '2px solid white'
                    }}
                />
            </div>


            {/* 2. Main Profile Section */}
            <div className=" -mt-35 md:-mt-32 max-w-2xl mx-auto w-full px-6  relative z-10 pb-40">
                <div className="flex flex-col items-center gap-5">
                    {profile.headline && (
                        <span className="inline-block  font-bold text-white uppercase tracking-[0.3em] px-4 py-1.5 rounded-full bg-black/30   ">
                            {profile.headline}
                        </span>
                    )}
                    {/* Avatar with Premium Border */}
                    <div className="p-1 bg-white rounded-full shadow-xs shadow-slate-200">
                        <div className="w-32 h-32 rounded-full   md:w-40 md:h-40 rounded-[2.8rem] overflow-hidden bg-slate-100 border border-slate-50">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} className="w-full h-full object-cover" alt={profile.full_name} />
                            ) : (
                                <div className=" w-full h-full flex items-center justify-center bg-slate-900 text-white text-4xl font-black ">
                                    {profile.full_name?.charAt(0)}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div className="mt-8 text-center space-y-4">

                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">{profile.full_name}</h2>
                        <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-sm mx-auto font-medium opacity-80">
                            {profile.bio}
                        </p>
                    </div>

                    {/* 3. Links Grid */}
                    <div className="w-full mt-12 grid grid-cols-1 gap-4">
                        {profile.socials && Object.entries(profile.socials).map(([platform, value]) => {
                            if (!value) return null;
                            const config = SOCIAL_CONFIG[platform.toLowerCase()] || { color: 'text-slate-600', bg: 'bg-slate-50', icon: 'Link' };
                            const Icon = LucideIcons[config.icon] || LucideIcons.Link;

                            const p = platform.toLowerCase();
                            const cleanValue = value.replace('@', '').trim();
                            let finalLink = cleanValue.startsWith('http') ? cleanValue : "";

                            if (!finalLink) {
                                if (p === 'email') finalLink = `mailto:${cleanValue}`;
                                else if (p === 'phone') finalLink = `tel:${cleanValue}`;
                                else if (p === 'telegram') finalLink = `https://t.me/${cleanValue}`;
                                else if (p === 'instagram') finalLink = `https://instagram.com/${cleanValue}`;
                                else if (p === 'whatsapp') finalLink = `https://wa.me/${cleanValue.replace('+', '')}`;
                                else if (p === 'youtube') finalLink = `https://youtube.com/@${cleanValue}`;
                                else if (p === 'github') finalLink = `https://github.com/${cleanValue}`;
                                else if (p === 'facebook') finalLink = `https://facebook.com/${cleanValue}`;
                            }

                            return (
                                <a
                                    key={platform}
                                    href={finalLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-[1.5rem] hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-300"
                                >
                                    <div className={`w-12 h-12 flex items-center justify-center rounded-2xl ${config.bg} ${config.color} group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon size={20} strokeWidth={2.5} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{platform}</p>
                                        <p className="text-sm font-bold text-slate-700 truncate">{cleanValue}</p>
                                    </div>
                                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                        <LucideIcons.ArrowUpRight size={16} />
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 4. Owner Floating Dock */}
            {isOwner && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full px-6 flex justify-center">
                    <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-2xl p-2 rounded-[2rem] border border-white/10 shadow-2xl">
                        <button
                            onClick={copyLink}
                            className="flex items-center gap-2 px-5 py-3 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/10 rounded-2xl transition-all"
                        >
                            {copied ? <LucideIcons.CheckCircle2 size={18} className="text-green-400" /> : <LucideIcons.Share2 size={18} />}
                            {copied ? "Nusxalandi" : "Ulashish"}
                        </button>
                        <div className="w-px h-6 bg-white/10 mx-1" />
                        <button
                            onClick={() => navigate('/edit')}
                            className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-blue-500 rounded-2xl transition-all shadow-lg shadow-blue-500/20"
                        >
                            <LucideIcons.Settings2 size={18} />
                            Tahrirlash
                        </button>
                    </div>
                </div>
            )}

            {/* Branding Footer */}
            <div className="absolute bottom-8 left-0 right-0 text-center opacity-20 hover:opacity-100 transition-opacity">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-900">OnePage.</p>
            </div>
        </div>
    );
}

export default UserProfile;