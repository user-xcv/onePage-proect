import React, { useState } from 'react'
import { supabase } from '../../supabase'
import { Camera, ArrowRight, User, Info } from 'lucide-react'

const CreateProfile = ({ setStep, updateData }) => {
    const [uploading, setUploading] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState('')
    const [form, setForm] = useState({
        full_name: '',
        age: '',
        bio: '',
        headline: '',
        avatar_url: ''
    })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleUpload = async (e) => {
        try {
            setUploading(true)
            const file = e.target.files[0]
            if (!file) return

            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            let { error: uploadError } = await supabase.storage
                .from('Avatars')
                .upload(filePath, file)

            if (uploadError) throw uploadError

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
        updateData(form)
        setStep(2)
    }

    return (
        <section className='min-h-screen pt-24 pb-12 px-6 bg-white'>
            <div className="max-w-3xl mx-auto">
                {/* Header Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-1 bg-blue-600 rounded-full" />
                        <div className="w-8 h-1 bg-slate-100 rounded-full" />
                    </div>
                    <h1 className='text-4xl font-black tracking-tight text-slate-900'>Sahifa yaratish</h1>
                    <p className='text-slate-400 font-medium'>1-qadam: Asosiy shaxsingizni tanishtiring</p>
                </div>

                <form onSubmit={handleNextStep} className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Chap tomon: Avatar Upload (4 col) */}
                    <div className="lg:col-span-4 flex flex-col items-center lg:items-start">
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-[3rem] bg-slate-50 border-2 border-slate-500  overflow-hidden flex items-center justify-center transition-all group-hover:border-blue-200">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={48} className="text-slate-200" />
                                )}
                            </div>
                            <label className="absolute -bottom-2 -right-2 w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-all shadow-sm">
                                <Camera size={20} className="text-slate-600" />
                                <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />
                            </label>
                        </div>
                        <div className="mt-6 text-center lg:text-left">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Profil rasmi</p>
                            <p className="text-[10px] text-slate-500">JPG yoki PNG, Max 2MB</p>
                            {uploading && <p className="text-[10px] text-blue-600 font-bold mt-1 animate-pulse">Yuklanmoqda...</p>}
                        </div>
                    </div>

                    {/* O'ng tomon: Form Inputs (8 col) */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="md:col-span-3 flex flex-col gap-2">
                                <label className='text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500'>To'liq ism</label>
                                <input
                                    name='full_name'
                                    value={form.full_name}
                                    onChange={handleChange}
                                    type="text"
                                    required
                                    placeholder='Ism va familiyangiz'
                                    className='w-full py-3 bg-transparent border-b border-slate-500 outline-none focus:border-blue-600 transition-all text-md font-medium placeholder:text-slate-400 placeholder:font-light'
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className='text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500'>Yosh</label>
                                <input
                                    name='age'
                                    value={form.age}
                                    onChange={handleChange}
                                    type="number"
                                    required
                                    placeholder='24'
                                    className='w-full py-3 bg-transparent border-b border-slate-500 outline-none focus:border-blue-600 transition-all text-lg font-medium placeholder:text-slate-400 placeholder:font-light'
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className='text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500'>Headline</label>
                            <input
                                name='headline'
                                value={form.headline}
                                onChange={handleChange}
                                required
                                type="text"
                                placeholder='Masalan: UI/UX Designer yoki SMM Manager'
                                className='w-full py-3 bg-transparent border-b border-slate-500  outline-none focus:border-blue-600 transition-all font-medium text-slate-400 placeholder:text-slate-400 placeholder:font-light'
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className='text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500'>Biografiya</label>
                            <textarea
                                name='bio'
                                required
                                value={form.bio}
                                onChange={handleChange}
                                placeholder="O'zingiz haqida qisqacha ma'lumot..."
                                className='w-full py-3 bg-transparent border-b border-slate-500 outline-none focus:border-blue-600 transition-all font-medium resize-none text-slate-400 placeholder:text-slate-400 placeholder:font-light'
                            />
                        </div>
                        <div className="pt-6">
                            <button
                                type='submit'
                                className='group flex items-center justify-center gap-3 w-full md:w-auto bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95'
                            >
                                Davom etish
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </section>
    )
}

export default CreateProfile