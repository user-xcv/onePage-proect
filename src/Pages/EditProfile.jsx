import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import * as LucideIcons from 'lucide-react'
import { useNavigate, useOutletContext } from 'react-router-dom'

const EditProfile = () => {
    const navigate = useNavigate()
    const { setIsSaving } = useOutletContext();
    const [loading, setLoading] = useState(true)
    const [userId, setUserId] = useState(null)
    const [form, setForm] = useState({
        full_name: '',
        bio: '',
        headline: '',
        avatar_url: '',
        username: '',
        socials: {}
    })

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

    const ALL_NETWORKS = Object.keys(SOCIAL_CONFIG);

    // ... useEffect, handleChange, uploadAvatar, handleSave funksiyalari o'zgarishsiz qoladi ...
    // (Yuqoridagi kodingizdan funksiyalarni shu yerga qo'ying)
    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            const user = session?.user
            if (!user) { navigate('/'); return; }
            setUserId(user.id)
            const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
            if (data) { setForm({ ...data, socials: data.socials || {} }) }
            setLoading(false)
        }
        fetchUserData()
    }, [navigate])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSocialChange = (network, value) => {
        setForm(prev => ({ ...prev, socials: { ...prev.socials, [network]: value } }))
    }

    const uploadAvatar = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsSaving(true);
        try {
            if (form.avatar_url) {
                const cleanUrl = form.avatar_url.split('?')[0];
                const oldFileName = cleanUrl.split('/').pop();
                await supabase.storage.from('Avatars').remove([oldFileName]);
            }
            const fileExt = file.name.split('.').pop();
            const newFileName = `${userId}-${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage.from('Avatars').upload(newFileName, file);
            if (uploadError) throw uploadError;
            const { data } = supabase.storage.from('Avatars').getPublicUrl(newFileName);
            setForm(prev => ({ ...prev, avatar_url: data.publicUrl }));
        } catch (error) { console.error(error); alert("Xato!"); } finally { setIsSaving(false); }
    }

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { error } = await supabase.from('profiles').update({
                full_name: form.full_name, bio: form.bio, headline: form.headline, avatar_url: form.avatar_url, socials: form.socials
            }).eq('id', userId);
            if (!error) navigate(`/${form.username}`);
            else throw error;
        } catch (error) { alert("Saqlashda xato!"); } finally { setIsSaving(false); }
    };

    useEffect(() => {
        const onSaveSignal = () => handleSave();
        window.addEventListener('saveProfileData', onSaveSignal);
        return () => window.removeEventListener('saveProfileData', onSaveSignal);
    }, [form, userId]);

    if (loading) return <div className="p-10 text-center font-bold text-gray-400">Yuklanmoqda...</div>

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* 1. Header/Banner Area - UserProfile bilan layout bir xil bo'lishi uchun */}
            <div className="relative h-48 md:h-64 w-full bg-gray-100 overflow-hidden">
                {form.avatar_url ? (
                    <img
                        src={form.avatar_url}
                        className="w-full h-full object-cover blur-xs scale-110"
                        alt="bg"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50" />
                )}
            </div>

            {/* 2. Profile Content - Yuqoriga ko'tarilgan (-mt) qism */}
            <div className="px-4 -mt-20 md:-mt-24 pb-20">
                <div className="flex flex-col items-center">
                    {/* Avatar Upload */}
                    {/* Avatar Upload Container */}
                    <div className="relative group">
                        {/* Asosiy Avatar Doirasi */}
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden relative transition-transform duration-300 group-hover:scale-[1.02]">
                            {form.avatar_url ? (
                                <img src={form.avatar_url} className="w-full h-full object-cover" alt="avatar" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                                    <LucideIcons.User size={48} />
                                </div>
                            )}

                            {/* Hover bo'lganda butun rasm ustidagi qora qatlam (Overlay) */}
                            <label className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <input type="file" onChange={uploadAvatar} className="hidden" accept="image/*" />
                            </label>
                        </div>

                        {/* SIZ SO'RAGAN ICON: O'ng pastki burchakdagi Blue-600 tugma */}
                        <label className="absolute bottom-1 right-1 md:bottom-2 md:right-2 bg-blue-600 p-2.5 md:p-3 rounded-full border-4 border-white text-white shadow-lg cursor-pointer hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all z-10">
                            <LucideIcons.Camera size={20} strokeWidth={2.5} />
                            <input type="file" onChange={uploadAvatar} className="hidden" accept="image/*" />
                        </label>

                        {/* Yuklanayotgan vaqtda indikator (ixtiyoriy) */}
                        {loading === false && form.avatar_url === '' && (
                            <div className="absolute -bottom-8 text-[10px] font-bold text-blue-600 uppercase tracking-tighter animate-pulse">
                                Rasm yuklang
                            </div>
                        )}
                    </div>

                    {/* Inputs Area */}
                    <div className="w-full mt-6 space-y-4">
                        {/* Headline */}
                        <div className="text-center">
                            <input
                                name="headline"
                                value={form.headline || ''}
                                onChange={handleChange}
                                placeholder="Kasbingiz (masalan: Graphic Designer)"
                                className="w-full text-center text-sm font-bold text-blue-600 uppercase tracking-widest bg-transparent outline-none placeholder:text-gray-300"
                            />
                        </div>

                        {/* Full Name */}
                        <div className="text-center">
                            <input
                                name="full_name"
                                value={form.full_name || ''}
                                onChange={handleChange}
                                placeholder="To'liq ismingiz"
                                className="w-full text-center text-2xl md:text-3xl font-black text-gray-900 bg-transparent outline-none placeholder:text-gray-200"
                            />
                        </div>

                        {/* Bio */}
                        <div className="max-w-md  mx-auto">
                            <textarea
                                name="bio"
                                value={form.bio || ''}
                                onChange={handleChange}
                                placeholder="O'zingiz haqingizda qisqacha ma'lumot yozing..."
                                className="w-full text-center text-gray-500 text-sm md:text-base bg-transparent outline-blue-600  resize-none leading-relaxed placeholder:text-gray-300"
                                rows="7"
                            />
                        </div>
                    </div>

                    {/* 3. Social Networks - Linktree Style */}
                    <div className="w-full max-w-xl">
                        <h3 className="text-center font-semibold text-blue-600 mb-3">
                            Aloqa va Ijtimoiy tarmoqlar
                        </h3>

                        <div className="grid grid-cols-1 gap-3">
                            {ALL_NETWORKS.map(net => {
                                const config = SOCIAL_CONFIG[net];
                                const Icon = LucideIcons[config.icon];

                                return (
                                    <div
                                        key={net}
                                        className="flex items-center gap-4 p-2 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-lg hover:shadow-gray-200/50 rounded-2xl transition-all duration-300"
                                    >
                                        <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${config.bg} ${config.color}`}>
                                            <Icon size={20} />
                                        </div>

                                        <div className="flex-1 pr-2">
                                            <label className="block text-[9px] font-bold text-gray-400 uppercase mb-0.5">
                                                {net}
                                            </label>
                                            <input
                                                value={form.socials[net] || ''}
                                                onChange={(e) => handleSocialChange(net, e.target.value)}
                                                placeholder={`@username yoki link`}
                                                className="w-full bg-transparent text-sm font-semibold text-gray-700 outline-none placeholder:text-gray-300"
                                            />
                                        </div>

                                        {form.socials[net] && (
                                            <div className="px-3">
                                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditProfile