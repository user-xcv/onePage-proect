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
        github: { color: 'text-gray-900', bg: 'bg-gray-100', icon: 'Github' },
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

    if (loading) return <div className="p-10 text-center font-bold text-gray-400">Yuklanmoqda...</div>
    if (!profile) return (
        <div className="flex flex-col items-center justify-center h-screen text-center px-4">
            <LucideIcons.SearchX size={64} className="text-gray-200 mb-4" />
            <h1 className="text-2xl font-bold text-gray-800">Profil topilmadi</h1>
            <p className="text-gray-500 mt-2">Bunday foydalanuvchi tizimda mavjud emas.</p>
            <button onClick={() => navigate('/')} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold">Bosh sahifa</button>
        </div>
    )

    const isOwner = currentId === profile.id;

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* 1. Header/Banner Area */}
            <div className="relative h-48 md:h-64 w-full bg-gray-100 overflow-hidden">
                {profile.avatar_url ? (
                    <img
                        src={profile.avatar_url}
                        className="w-full h-full object-cover blur-xs scale-110"
                        alt="bg"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50" />
                )}
            </div>

            {/* 2. Profile Content */}
            <div className="px-4 -mt-20 md:-mt-24 pb-32">
                <div className="flex flex-col items-center">
                    {/* Avatar */}
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden relative">
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} className="w-full h-full object-cover" alt={profile.full_name} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-4xl font-bold">
                                {profile.full_name?.charAt(0)}
                            </div>
                        )}
                    </div>

                    {/* User Info */}
                    <div className="w-full mt-6 text-center space-y-3">
                        {profile.headline && (
                            <div className="flex justify-center">
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] bg-blue-50 px-3 py-1 rounded-full">
                                    {profile.headline}
                                </span>
                            </div>
                        )}
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900">{profile.full_name}</h2>
                        <p className="max-w-md mx-auto text-gray-500 text-sm md:text-base leading-relaxed px-4 italic">
                            {profile.bio}
                        </p>
                    </div>

                    {/* 3. Social Links */}
                    <div className="w-full max-w-xl mt-10 space-y-3">
                        {profile.socials && Object.entries(profile.socials).map(([platform, value]) => {
                            if (!value) return null;
                            const config = SOCIAL_CONFIG[platform.toLowerCase()] || { color: 'text-gray-600', bg: 'bg-gray-50', icon: 'Link' };
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
                                    className="flex items-center gap-4 p-3 bg-white border border-gray-100 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200 rounded-2xl group"
                                >
                                    <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${config.bg} ${config.color} group-hover:scale-105 transition-transform`}>
                                        <Icon size={22} strokeWidth={2.5} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{platform}</p>
                                        <p className="text-sm font-bold text-gray-700 truncate">{cleanValue}</p>
                                    </div>
                                    <LucideIcons.ChevronRight size={18} className="text-gray-300 group-hover:text-gray-400" />
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 4. Action Buttons (Desktop Floating Bar) */}
            {isOwner && (
                <div className="hidden md:flex fixed bottom-10 left-0 right-0 justify-center z-50">
                    <div className="flex items-center gap-2 bg-black/90 backdrop-blur-xl p-2 rounded-2xl border border-white/10 shadow-2xl">
                        <button
                            onClick={copyLink}
                            className="flex items-center gap-2 px-4 py-2 text-white text-sm font-bold hover:bg-white/10 rounded-xl transition-all"
                        >
                            {copied ? <LucideIcons.Check size={18} className="text-green-400" /> : <LucideIcons.Copy size={18} />}
                            {copied ? "Nusxalandi" : "Ulashish"}
                        </button>
                        <div className="w-px h-6 bg-white/20" />
                        <button
                            onClick={() => navigate('/edit')}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 rounded-xl transition-all"
                        >
                            <LucideIcons.Edit3 size={18} />
                            Tahrirlash
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserProfile;