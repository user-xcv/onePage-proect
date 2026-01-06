import React, { useState } from 'react'
import { supabase } from '../../supabase' // Supabase ulanishini tekshiring

const CreateProfile = ({ setStep, updateData }) => {
    const [uploading, setUploading] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState('') // Rasm preview uchun
    const [form, setForm] = useState({
        full_name: '',
        age: '',
        bio: '',
        headline: '',
        avatar_url: '' // Bazaga ketadigan link
    })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    // RASM YUKLASH MANTIQI
    const handleUpload = async (e) => {
        try {
            setUploading(true)
            const file = e.target.files[0]
            if (!file) return

            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `Avatars/${fileName}`

            // 1. Storage'ga yuklash
            let { error: uploadError } = await supabase.storage
                .from('Avatars')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // 2. Public Linkni olish
            const { data } = supabase.storage
                .from('Avatars')
                .getPublicUrl(filePath)

            setAvatarUrl(data.publicUrl)
            setForm(prev => ({ ...prev, avatar_url: data.publicUrl }))

        } catch (error) {
            alert('Rasm yuklashda xato: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    const handleNextStep = (e) => {
        e.preventDefault()
        if (!form.full_name || !form.age) {
            alert('Iltimos, ism va yoshingizni kiriting')
            return
        }
        updateData(form)
        setStep(2)
    }

    return (
        <section className='flex justify-center items-start mt-20 min-h-screen'>
            <div className="mx-auto container max-w-4xl px-4">
                <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-1">
                        <h1 className='font-bold text-2xl'>Sahifa yaratish</h1>
                        <p className='text-gray-400'>1-qadam: Asosiy ma'lumotlar</p>
                    </div>

                    <form onSubmit={handleNextStep} className="border border-gray-200 p-8 rounded-xl bg-white shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                            {/* Chap tomon: Matnli ma'lumotlar */}
                            <div className="flex flex-col gap-4">
                                <h2 className='font-semibold text-xl'>Asosiy ma'lumotlar</h2>
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col">
                                        <label className='mb-1 text-sm font-medium'>Ism</label>
                                        <input name='full_name' value={form.full_name} onChange={handleChange} type="text" placeholder='Ismingizni kiriting' className='outline-blue-600 p-2 border border-gray-300 rounded' />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className='mb-1 text-sm font-medium'>Yosh</label>
                                        <input name='age' value={form.age} onChange={handleChange} type="number" placeholder='Yoshingizni kiriting' className='outline-blue-600 p-2 border border-gray-300 rounded' />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className='mb-1 text-sm font-medium'>Bio</label>
                                        <textarea name='bio' value={form.bio} onChange={handleChange} placeholder="O'zingiz haqida qisqacha" className='h-24 outline-blue-600 p-2 border border-gray-300 rounded resize-none' />
                                    </div>
                                </div>
                            </div>

                            {/* O'ng tomon: Headline va Avatar */}
                            <div className="flex flex-col gap-6 justify-between">
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                        <h2 className='font-semibold text-xl'>Headline</h2>
                                        <input name='headline' value={form.headline} onChange={handleChange} type="text" placeholder='Masalan: Frontend Developer' className='outline-blue-600 p-2 border border-gray-300 rounded w-full' />
                                    </div>

                                    {/* AVATAR UPLOAD QISMI */}
                                    <div className="flex flex-col gap-3">
                                        <label className='text-sm font-medium text-gray-700'>Profil rasmi</label>
                                        <div className="flex items-center gap-4">
                                            <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                                                {avatarUrl ? (
                                                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-gray-400 text-xs text-center px-2">Rasm yuklang</span>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <label className="cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-300 py-2 px-4 rounded-lg text-sm font-medium transition-all inline-block">
                                                    {uploading ? 'Yuklanmoqda...' : 'Rasm tanlash'}
                                                    <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />
                                                </label>
                                                <p className='text-[10px] text-gray-400 mt-2'>JPG, PNG. Max 2MB</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button type='submit' className='w-full text-white py-3 rounded font-semibold bg-blue-600 hover:bg-blue-700 transition-all cursor-pointer'>
                                    Davom etish
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default CreateProfile