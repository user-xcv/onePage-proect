import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import * as LucideIcons from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const EditProfile = () => {
    const navigate = useNavigate()
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

    const ALL_NETWORKS = ['instagram', 'telegram', 'whatsapp', 'youtube', 'github', 'facebook', 'email', 'phone'];

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            const user = session?.user
            if (!user) {
                navigate('/')
                return
            }
            setUserId(user.id)

            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (data) {
                setForm({
                    ...data,
                    socials: data.socials || {}
                })
            }
            setLoading(false)
        }
        fetchUserData()
    }, [navigate])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSocialChange = (network, value) => {
        setForm(prev => ({
            ...prev,
            socials: { ...prev.socials, [network]: value }
        }))
    }

    const uploadAvatar = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setLoading(true);

        try {
            if (form.avatar_url) {
                const cleanUrl = form.avatar_url.split('?')[0];
                const oldFileName = cleanUrl.split('/').pop();
                await supabase.storage.from('Avatars').remove([oldFileName]);
            }

            const fileExt = file.name.split('.').pop();
            const newFileName = `${userId}-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('Avatars')
                .upload(newFileName, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('Avatars').getPublicUrl(newFileName);
            setForm(prev => ({ ...prev, avatar_url: data.publicUrl }));

        } catch (error) {
            console.error('Xatolik:', error.message);
            alert("Rasm yuklashda xato!");
        } finally {
            setLoading(false);
        }
    }

    const handleSave = async () => {
        setLoading(true)
        const { error } = await supabase
            .from('profiles')
            .update(form)
            .eq('id', userId)

        if (!error) navigate(`/${form.username}`)
        setLoading(false)
    }

    if (loading && !userId) return <div className="p-10 text-center">Yuklanmoqda...</div>

    return (
        <section className="min-h-screen bg-gray-50/50 relative overflow-hidden">
            {/* 1. Header Banner */}
            <div className="absolute top-0 left-0 w-full h-[35vh] md:h-[40vh] z-0 overflow-hidden bg-white">
                {form.avatar_url ? (
                    <div className="relative w-full h-[90%]">
                        <img
                            src={form.avatar_url}
                            className="w-full h-full object-cover blur-xs  brightness-75"
                            alt="bg"
                        />
                        <div className="absolute inset-0 bg-black/10"></div>
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-black/10"></div>
                )}

            </div>

            <div className="relative z-10 container mx-auto max-w-lg px-4 pt-[15vh] md:pt-[20vh]">
                <div className="flex flex-col items-center">

                    {/* Headline Edit */}
                    <div className="relative mb-6">
                        <input
                            name="headline"
                            value={form.headline}
                            onChange={handleChange}
                            placeholder="Kasbingiz (Headline)"
                            className="bg-white/20 backdrop-blur-md border border-white/40 px-4 py-2 rounded-full text-white text-xs font-bold tracking-widest uppercase text-center outline-none placeholder:text-white/60 focus:ring-2 ring-white/30"
                        />
                        <LucideIcons.Type size={14} className="absolute -right-6 top-2.5 text-white/70" />
                    </div>

                    {/* Avatar Edit */}
                    <div className="relative group">
                        <div className="absolute inset-0 blur-2xl bg-blue-400/20 rounded-full scale-110"></div>
                        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-[3rem] border-4 border-white shadow-2xl overflow-hidden bg-gray-100">
                            {form.avatar_url ? (
                                <img src={form.avatar_url} className="w-full h-full object-cover" alt="avatar" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <LucideIcons.User size={50} />
                                </div>
                            )}
                        </div>
                        <label className="absolute bottom-1 right-1 bg-blue-600 p-3 rounded-2xl text-white shadow-xl cursor-pointer hover:scale-110 transition-transform border-2 border-white">
                            <LucideIcons.Camera size={20} />
                            <input type="file" onChange={uploadAvatar} className="hidden" accept="image/*" />
                        </label>
                    </div>

                    {/* Ism va Bio Edit */}
                    <div className="mt-8 w-full space-y-4">
                        <div className="relative">
                            <input
                                name="full_name"
                                value={form.full_name}
                                onChange={handleChange}
                                placeholder="To'liq ismingiz"
                                className="w-full text-center text-3xl font-black text-gray-900 bg-transparent border-b-2 border-dashed border-gray-200 focus:border-blue-500 outline-none pb-1"
                            />
                            <LucideIcons.Pencil size={16} className="absolute -right-2 top-3 text-gray-300" />
                        </div>

                        <div className="relative">
                            <textarea
                                name="bio"
                                value={form.bio}
                                onChange={handleChange}
                                placeholder="O'zingiz haqingizda qisqacha..."
                                className="w-full mt-2 text-gray-600 font-medium text-center bg-transparent outline-none resize-none px-4 leading-relaxed"
                                rows="3"
                            />
                        </div>
                    </div>

                    {/* Socials Edit Section */}
                    <div className="mt-10 w-full">
                        <div className="flex items-center gap-2 mb-6 px-2">
                            <div className="h-[1px] flex-1 bg-gray-200"></div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Ijtimoiy Tarmoqlar</span>
                            <div className="h-[1px] flex-1 bg-gray-200"></div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {ALL_NETWORKS.map(net => (
                                <div key={net} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm focus-within:ring-2 ring-blue-100 transition-all">
                                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-blue-600">
                                        <LucideIcons.Link size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-0.5 ml-1">{net}</p>
                                        <input
                                            placeholder={`${net} manzili yoki username`}
                                            value={form.socials[net] || ''}
                                            onChange={(e) => handleSocialChange(net, e.target.value)}
                                            className="w-full bg-transparent text-sm font-semibold text-gray-700 outline-none"
                                        />
                                    </div>
                                    {form.socials[net] && <LucideIcons.CheckCircle2 size={16} className="text-green-500 mr-2" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Pastki suzuvchi Save Button */}
            <div className="fixed bottom-8 left-0 w-full px-6 z-50">
                <div className="max-w-lg mx-auto flex gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex-1 bg-white text-gray-700 py-4 rounded-2xl font-bold shadow-xl border border-gray-100 active:scale-95 transition-all"
                    >
                        Bekor qilish
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <LucideIcons.Loader2 className="animate-spin" /> : <><LucideIcons.Save size={20} /> Saqlash</>}
                    </button>
                </div>
            </div>
        </section>
    )
}

export default EditProfile