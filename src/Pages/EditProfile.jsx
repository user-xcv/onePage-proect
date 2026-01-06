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
        const file = e.target.files[0]
        if (!file) return
        setLoading(true)

        try {
            // 1. Eski faylni o'chirish mantiqi (Tuzatildi)
            if (form.avatar_url) {
                const oldFileName = form.avatar_url.split('/').pop().split('?')[0]
                await supabase.storage.from('avatars').remove([oldFileName])
            }

            // 2. Yangi fayl yuklash
            const fileExt = file.name.split('.').pop()
            const newFileName = `${userId}-${Date.now()}.${fileExt}` // Takrorlanmas nom uchun Date.now()

            const { error: uploadError } = await supabase.storage
                .from('Avatars')
                .upload(newFileName, file)

            if (uploadError) throw uploadError

            const { data } = supabase.storage.from('Avatars').getPublicUrl(newFileName)
            setForm(prev => ({ ...prev, avatar_url: data.publicUrl }))
        } catch (error) {
            console.error('Rasm yuklashda xato:', error.message)
        } finally {
            setLoading(false)
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
        <section className="min-h-screen bg-white relative pb-32">
            {/* Header Banner */}
            <div className="absolute top-0 left-0 w-full h-[35vh] z-0 overflow-hidden bg-gray-100">
                <img src={form.avatar_url} className="w-full h-full object-cover blur-sm brightness-75" alt="" />
                {/* Oysimon effekt */}
                <div className="absolute -bottom-1 left-[-10%] w-[120%] h-[80px] bg-white"
                    style={{ borderRadius: '50% 50% 0 0', transform: 'scaleX(1.5)' }}></div>
            </div>

            <div className="relative z-10 container mx-auto max-w-lg px-6 pt-[12vh]">
                <div className="flex flex-col items-center">

                    {/* Headline Input */}
                    <input
                        name="headline"
                        value={form.headline}
                        onChange={handleChange}
                        placeholder="Kasbingiz (masalan: Designer)"
                        className="bg-black/20 backdrop-blur-md border border-dashed border-white/50 rounded-full px-4 py-1.5 text-white text-xs text-center outline-none mb-6 w-64"
                    />

                    {/* Avatar va Kamera */}
                    <div className="relative mb-8">
                        <div className="w-32 h-32 rounded-[2.5rem] border-4 border-white shadow-2xl overflow-hidden bg-gray-200">
                            <img src={form.avatar_url} className="w-full h-full object-cover" alt="" />
                        </div>
                        <label className="absolute bottom-0 right-0 bg-blue-600 p-2.5 rounded-2xl text-white shadow-lg cursor-pointer border-2 border-white hover:scale-105 transition-transform">
                            <LucideIcons.Camera size={18} />
                            <input type="file" onChange={uploadAvatar} className="hidden" accept="image/*" />
                        </label>
                    </div>

                    {/* Asosiy ma'lumotlar */}
                    <div className="w-full space-y-4">
                        <input
                            name="full_name"
                            value={form.full_name}
                            onChange={handleChange}
                            className="text-2xl font-black text-center border-b border-dashed border-gray-200 outline-none w-full pb-1 focus:border-blue-400"
                            placeholder="To'liq ism"
                        />
                        <textarea
                            name="bio"
                            value={form.bio}
                            onChange={handleChange}
                            className="w-full text-gray-500 text-center border border-dashed border-gray-100 rounded-xl p-3 outline-none text-sm min-h-[80px]"
                            placeholder="Bio..."
                        />
                    </div>

                    {/* Socials Linklar */}
                    <div className="mt-10 w-full space-y-3">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Ijtimoiy tarmoqlar</p>
                        {ALL_NETWORKS.map(net => (
                            <div key={net} className="flex items-center gap-3 bg-gray-50/50 p-2 rounded-2xl border border-gray-100 focus-within:border-blue-200 transition-all">
                                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm text-gray-400">
                                    <LucideIcons.Link size={18} />
                                </div>
                                <input
                                    placeholder={`${net} username`}
                                    value={form.socials[net] || ''}
                                    onChange={(e) => handleSocialChange(net, e.target.value)}
                                    className="bg-transparent text-sm flex-1 outline-none font-medium"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Pastki saqlash tugmasi */}
            <div className="fixed bottom-6 left-0 w-full px-6 z-30">
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    {loading ? "Saqlanmoqda..." : <><LucideIcons.Save size={20} /> Saqlash</>}
                </button>
            </div>
        </section>
    )
}

export default EditProfile