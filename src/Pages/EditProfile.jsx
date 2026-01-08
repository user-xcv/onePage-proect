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
        github: { color: 'text-slate-900', bg: 'bg-slate-100', icon: 'Github' },
        facebook: { color: 'text-blue-700', bg: 'bg-blue-50', icon: 'Facebook' },
        email: { color: 'text-orange-500', bg: 'bg-orange-50', icon: 'Mail' },
        phone: { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: 'Phone' },
    };

    const ALL_NETWORKS = Object.keys(SOCIAL_CONFIG);

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
        } catch (error) { console.error(error); } finally { setIsSaving(false); }
    }

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { error } = await supabase.from('profiles').update({
                full_name: form.full_name, bio: form.bio, headline: form.headline, avatar_url: form.avatar_url, socials: form.socials
            }).eq('id', userId);
            if (!error) navigate(`/${form.username}`);
            else throw error;
        } catch (error) { alert("Xato!"); } finally { setIsSaving(false); }
    };

    useEffect(() => {
        const onSaveSignal = () => handleSave();
        window.addEventListener('saveProfileData', onSaveSignal);
        return () => window.removeEventListener('saveProfileData', onSaveSignal);
    }, [form, userId]);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-300 font-bold uppercase tracking-widest text-xs">Yuklanmoqda...</div>

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* 1. Header Banner */}
            <div className="relative h-56 md:h-72 w-full bg-slate-50 overflow-hidden">
                {form.avatar_url ? (
                    <>
                        <img src={form.avatar_url} className="w-full h-full object-cover blur-2xl opacity-30 scale-125" alt="bg" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
                    </>
                ) : (
                    <div className="w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-white" />
                )}
            </div>

            {/* 2. Form Content */}
            <div className="max-w-2xl mx-auto w-full px-6 -mt-28 relative z-10 pb-40">
                <div className="flex flex-col items-center">

                    {/* Avatar Upload Container */}
                    <div className="relative group">
                        <div className="p-1.5 bg-white rounded-[3rem] shadow-2xl shadow-slate-200">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.8rem] overflow-hidden bg-slate-50 relative">
                                {form.avatar_url ? (
                                    <img src={form.avatar_url} className="w-full h-full object-cover" alt="avatar" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                                        <LucideIcons.User size={48} />
                                    </div>
                                )}
                                <label className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-[2px]">
                                    <LucideIcons.CloudUpload className="text-white" size={28} />
                                    <input type="file" onChange={uploadAvatar} className="hidden" accept="image/*" />
                                </label>
                            </div>
                        </div>

                        {/* Action Camera Button */}
                        <label className="absolute -bottom-2 -right-2 bg-blue-600 p-3 rounded-2xl border-4 border-white text-white shadow-xl cursor-pointer hover:bg-slate-900 hover:scale-110 active:scale-95 transition-all z-20">
                            <LucideIcons.Camera size={18} strokeWidth={2.5} />
                            <input type="file" onChange={uploadAvatar} className="hidden" accept="image/*" />
                        </label>
                    </div>

                    {/* Personal Info Inputs */}
                    <div className="w-full mt-12 space-y-8">
                        {/* Headline */}
                        <div className="relative group">
                            <input
                                name="headline"
                                value={form.headline || ''}
                                onChange={handleChange}
                                placeholder="KASBINGIZ (MASALAN: DEVELOPER)"
                                className="w-full text-center text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] bg-transparent outline-none placeholder:text-slate-200"
                            />
                            <div className="h-[1px] w-0 group-focus-within:w-20 bg-blue-600 mx-auto transition-all duration-500 mt-2" />
                        </div>

                        {/* Full Name */}
                        <input
                            name="full_name"
                            value={form.full_name || ''}
                            onChange={handleChange}
                            placeholder="To'liq ismingiz"
                            className="w-full text-center text-3xl md:text-4xl font-black text-slate-900 bg-transparent outline-none placeholder:text-slate-100 tracking-tighter"
                        />

                        {/* Bio */}
                        <div className="max-w-md mx-auto relative group">
                            <textarea
                                name="bio"
                                value={form.bio || ''}
                                onChange={handleChange}
                                placeholder="O'zingiz haqingizda qisqacha ma'lumot..."
                                className="w-full text-center text-slate-500 text-sm md:text-base bg-slate-50/50 p-6 rounded-[2rem] outline-none focus:bg-white focus:ring-1 ring-slate-100 transition-all resize-none leading-relaxed placeholder:text-slate-300"
                                rows="4"
                            />
                        </div>
                    </div>

                    {/* 3. Social Networks Grid */}
                    <div className="w-full mt-16">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-[1px] flex-1 bg-slate-100" />
                            <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                                Tarmoqlar
                            </h3>
                            <div className="h-[1px] flex-1 bg-slate-100" />
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {ALL_NETWORKS.map(net => {
                                const config = SOCIAL_CONFIG[net];
                                const Icon = LucideIcons[config.icon];

                                return (
                                    <div
                                        key={net}
                                        className="group flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-[1.5rem] focus-within:border-blue-200 focus-within:shadow-xl focus-within:shadow-blue-50/50 transition-all duration-300"
                                    >
                                        <div className={`w-12 h-12 flex items-center justify-center rounded-2xl ${config.bg} ${config.color} transition-transform duration-300 group-focus-within:scale-110`}>
                                            <Icon size={20} strokeWidth={2.5} />
                                        </div>

                                        <div className="flex-1">
                                            <label className="block text-[9px] font-black text-slate-300 uppercase tracking-widest mb-0.5">
                                                {net}
                                            </label>
                                            <input
                                                value={form.socials[net] || ''}
                                                onChange={(e) => handleSocialChange(net, e.target.value)}
                                                placeholder={`username yoki link`}
                                                className="w-full bg-transparent text-sm font-bold text-slate-700 outline-none placeholder:text-slate-200"
                                            />
                                        </div>

                                        {form.socials[net] && (
                                            <div className="pr-4">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
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