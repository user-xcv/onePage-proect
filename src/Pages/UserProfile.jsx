import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { useNavigate, useParams } from 'react-router-dom'
import * as LucideIcons from 'lucide-react'
import Loading from '../Extra/Loading'

const UserProfile = () => {
    const { username } = useParams()
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [currentId, setCurrentId] = useState(null)
    const [copied, setCopied] = useState(false)

    // ORIGINAL BRAND LOGO URLS (Simple Icons CDN - eng aniq va original variant)
    const getBrandIcon = (platform) => {
        const p = platform.toLowerCase();
        const icons = {
            instagram: "https://cdn.simpleicons.org/instagram/%23E4405F",
            telegram: "https://cdn.simpleicons.org/telegram/%2326A5E4",
            youtube: "https://cdn.simpleicons.org/youtube/%23FF0000",
            whatsapp: "https://cdn.simpleicons.org/whatsapp/%2325D366",
            github: "https://cdn.simpleicons.org/github/%23181717",
            facebook: "https://cdn.simpleicons.org/facebook/%231877F2",
            // Email va Phone uchun maxsus premium ikonka manzillari
            email: "https://img.icons8.com/color/96/gmail-new.png",
            phone: "https://img.icons8.com/color/96/phone.png"
        };
        return icons[p] || null;
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

    if (loading) return <Loading />

    if (!profile) return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
            <div className="w-20 h-20 bg-slate-50 rounded-4xl flex items-center justify-center mb-6">
                <LucideIcons.SearchX size={32} className="text-slate-200" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Profil topilmadi</h1>
            <p className="text-slate-400 mt-2 max-w-60">Bunday foydalanuvchi tizimda ro'yxatdan o'tmagan.</p>
            <button onClick={() => navigate('/')} className="mt-8 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all">Bosh sahifa</button>
        </div>
    )

    const isOwner = currentId === profile.id;

    return (
        <div className="flex flex-col min-h-screen bg-white selection:bg-blue-100">
            {/* 1. Header Banner */}
            <div className="relative h-72 md:h-80 w-full overflow-hidden bg-white">
                <div className="absolute inset-0 " style={{ clipPath: 'ellipse(120% 100% at 50% 20%)' }}>
                    {profile.avatar_url ? (
                        <div className="relative w-full h-full">
                            <img src={profile.avatar_url} className="w-full h-full object-cover blur-xs scale-110" alt="bg" />
                            <div className="absolute inset-0 backdrop-blur-xs bg-black/30" />
                            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/40" />
                        </div>
                    ) : (
                        <div className="w-full h-full bg-linear-to-br from-blue-600 to-indigo-900" />
                    )}
                </div>
            </div>

            {/* 2. Main Profile Section */}
            <div className=" -mt-35 md:-mt-32 max-w-2xl mx-auto w-full px-6 relative z-10 pb-40">
                <div className="flex flex-col items-center gap-5">
                    {profile.headline && (
                        <span className="inline-block font-semibold text-white uppercase tracking-[0.3em] px-4 py-1.5 rounded-full bg-black/30">
                            {profile.headline}
                        </span>
                    )}
                    <div className="p-1 bg-white rounded-full shadow-xs shadow-slate-200">
                        <div className="w-32 h-32 rounded-full md:w-40 md:h-40 rounded-7xl overflow-hidden bg-slate-100 border border-slate-50">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} className="w-full h-full object-cover" alt={profile.full_name} />
                            ) : (
                                <div className=" w-full h-full flex items-center justify-center bg-slate-900 text-white text-4xl font-black">
                                    {profile.full_name?.charAt(0)}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 text-center space-y-4">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">{profile.full_name}</h2>
                        <p className="text-slate-600 font-serif text-sm md:text-base leading-relaxed max-w-sm mx-auto font-medium opacity-80">
                            {profile.bio}
                        </p>
                    </div>

                    {/* 3. Links Grid */}
                    <div className="w-full mt-12 grid grid-cols-1 gap-4">
                        {profile.socials && Object.entries(profile.socials).map(([platform, value]) => {
                            if (!value) return null;
                            const p = platform.toLowerCase();
                            const iconUrl = getBrandIcon(p);
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
                                    className="group flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-3xl hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-300"
                                >
                                    <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 group-hover:scale-110 transition-transform duration-300 overflow-hidden p-2.5">
                                        {iconUrl ? (
                                            <img src={iconUrl} alt={platform} className="w-full h-full object-contain" />
                                        ) : (
                                            <LucideIcons.Link size={20} className="text-slate-400" />
                                        )}
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
                <div className=" fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full px-6 flex justify-center">
                    <div className="hidden sm:flex items-center gap-2 bg-slate-900/90 backdrop-blur-2xl p-2 rounded-4xl border border-white/10 shadow-2xl">
                        <button onClick={copyLink} className="flex items-center gap-2 px-5 py-3 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/10 rounded-2xl transition-all">
                            {copied ? <LucideIcons.CheckCircle2 size={18} className="text-green-400" /> : <LucideIcons.Share2 size={18} />}
                            {copied ? "Nusxalandi" : "Ulashish"}
                        </button>
                        <div className="w-px h-6 bg-white/10 mx-1" />
                        <button onClick={() => navigate('/edit')} className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-blue-500 rounded-2xl transition-all shadow-lg shadow-blue-500/20">
                            <LucideIcons.Settings2 size={18} />
                            Tahrirlash
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserProfile;