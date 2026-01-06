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

    // 1. Ikonkani aniqlash funksiyasi
    const getIcon = (platformName) => {
        const p = platformName.toLowerCase()
        if (p === 'email' || p === 'mail') return LucideIcons.Mail
        if (p === 'phone' || p === 'tel' || p === 'tell') return LucideIcons.Phone
        if (p === 'telegram') return LucideIcons.Send
        if (p === 'whatsapp') return LucideIcons.MessageCircle

        // Lucide-da ikonka nomlari katta harf bilan boshlanadi
        const formattedName = p.charAt(0).toUpperCase() + p.slice(1)
        return LucideIcons[formattedName] || LucideIcons.Globe
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

            if (data) {
                setProfile(data)
            }
            setLoading(false)
        }
        userData()
    }, [username])

    if (loading) return <>Loading...</>
    if (!profile) return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <h1 className="text-4xl font-bold text-gray-300">404</h1>
            <p className="text-gray-500 italic">Bunday sahifa mavjud emas</p>
            <button onClick={() => navigate('/')} className="mt-4 text-blue-600 underline">Bosh sahifaga qaytish</button>
        </div>
    )

    const userLink = window.location.href
    const copy = () => {
        navigator.clipboard.writeText(userLink)

    }


    return (

        <section className="min-h-screen bg-gray-50/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[35vh] md:h-[40vh] z-0 overflow-hidden bg-white">

                {/* Rasm qatlami */}
                {profile.avatar_url ? (
                    <div className="relative w-full h-[90%]"> {/* Balandlikni 90% qildik, pastini yoy kesadi */}
                        <img
                            src={profile.avatar_url}
                            className="w-full h-full object-cover blur-xs  brightness-75"
                            alt="bg"
                        />
                        <div className="absolute inset-0 bg-black/10"></div>


                    </div>
                ) : (
                    <div className="w-full h-full bg-blue-600"></div>
                )}
            </div>
            {/* 2. Asosiy Content (Tepaga ko'tarilgan holda) */}
            <div className="relative z-10 container mx-auto max-w-lg px-4 pt-[15vh] md:pt-[20vh]">
                <div className="flex flex-col items-center">

                    {/* Headline - Banner ustida chiroyli ko'rinishi uchun */}
                    {profile.headline && (
                        <div className="mb-6">
                            <span className="bg-white/20 backdrop-blur-md border border-white/30 px-4 py-1.5 rounded-full text-white text-xs font-bold tracking-widest  uppercase shadow-xl">
                                {profile.headline}
                            </span>
                        </div>
                    )}

                    {/* Avatar (Rasm ustida bo'rtib turadi) */}
                    <div className="relative group">
                        {/* Avatarning orqasidagi kichik "glow" effekti */}
                        <div className="absolute inset-0 blur-2xl bg-white/30 rounded-full scale-110"></div>

                        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-[4rem] border-4 border-white shadow-2xl overflow-hidden bg-white">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                                    {profile.full_name.charAt(0)}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Ism va Bio (Bannerdan pastda, oq fonda aniq ko'rinadi) */}
                    <div className="mt-6 text-center">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">{profile.full_name}</h2>
                        <p className="mt-3 text-gray-600 font-medium px-4 leading-relaxed max-w-lg">
                            {profile.bio}
                        </p>
                    </div>

                    {/* Ijtimoiy tarmoqlar (Smart Linklar) */}
                    <div className="flex flex-wrap justify-center gap-5 mt-10">
                        {profile.socials && Object.entries(profile.socials).map(([platform, value]) => {
                            if (!value) return null;

                            const IconComponent = getIcon(platform);
                            const p = platform.toLowerCase();
                            const cleanValue = value.replace('@', '').trim();

                            let finalLink = "";
                            if (p === 'email' || p === 'mail') finalLink = `mailto:${cleanValue}`;
                            else if (p === 'phone' || p === 'tel') finalLink = `tel:${cleanValue}`;
                            else {
                                const baseUrls = { instagram: 'https://instagram.com/', telegram: 'https://t.me/', whatsapp: 'https://wa.me/' };
                                finalLink = cleanValue.startsWith('http') ? cleanValue : `${baseUrls[p] || ''}${cleanValue}`;
                            }

                            return (
                                <a
                                    key={platform}
                                    href={finalLink}
                                    target={(p === 'email' || p === 'phone') ? '_self' : '_blank'}
                                    rel="noreferrer"
                                    className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white shadow-lg shadow-gray-200/50  text-blue-600  hover:text-gray-400 hover:scale-110 transition-all active:scale-95 border border-gray-100"
                                >
                                    <IconComponent size={26} strokeWidth={1.5} />
                                </a>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-5 mt-30">
                        <button onClick={copy} className='bg-blue-600  text-white px-4 py-2 rounded-sm cursor-pointer'>Linkni nusxalash</button>
                        <button onClick={() => navigate('/edit')} className='bg-blue-600  text-white px-4 py-2 rounded-sm cursor-pointer'>Profilni tahrirlash</button>
                    </div>
                </div>
            </div>
        </section>
    );

}

export default UserProfile;