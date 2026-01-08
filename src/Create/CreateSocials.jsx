import React, { useState } from 'react'
import { Instagram, Send, Youtube, Facebook, MessageCircle, Phone, Mail, ArrowRight, Check } from 'lucide-react'

const CreateSocials = ({ updateData, setStep }) => {
    // Qaysi tarmoqlar tanlanganini saqlash
    const [selectedNetworks, setSelectedNetworks] = useState([])

    const [form, setForm] = useState({
        instagram: '',
        telegram: '',
        youtube: '',
        facebook: '',
        whatsapp: '',
        phone: '',
        email: ''
    })

    const networks = [
        { id: 'instagram', label: 'Instagram', icon: <Instagram size={18} />, color: 'hover:text-pink-600' },
        { id: 'telegram', label: 'Telegram', icon: <Send size={18} />, color: 'hover:text-blue-500' },
        { id: 'youtube', label: 'Youtube', icon: <Youtube size={18} />, color: 'hover:text-red-600' },
        { id: 'facebook', label: 'Facebook', icon: <Facebook size={18} />, color: 'hover:text-blue-700' },
        { id: 'whatsapp', label: 'Whatsapp', icon: <MessageCircle size={18} />, color: 'hover:text-green-500' },
    ]

    const toggleNetwork = (id) => {
        setSelectedNetworks(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        )
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleNext = (e) => {
        e.preventDefault()
        updateData({ socials: form })
        setStep(3)
    }

    return (
        <section className='min-h-screen pt-24 pb-12 px-6 bg-white'>
            <div className="max-w-3xl mx-auto">
                {/* Step Indicator */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-1 bg-blue-600 rounded-full" />
                        <div className="w-8 h-1 bg-blue-600 rounded-full" />
                        <div className="w-8 h-1 bg-slate-100 rounded-full" />
                    </div>
                    <h1 className='text-4xl font-black tracking-tight text-slate-900'>Aloqa kanallari</h1>
                    <p className='text-slate-700 font-medium'>2-qadam: Ijtimoiy tarmoqlar va kontaktlar</p>
                </div>

                <form onSubmit={handleNext} className="space-y-12">

                    {/* 1. Ijtimoiy tarmoqlar tanlovi */}
                    <div>
                        <h2 className='text-xs font-bold uppercase tracking-[0.2em] text-slate-700 mb-6'>Tarmoqlarni tanlang</h2>
                        <div className="flex flex-wrap gap-3">
                            {networks.map(net => {
                                const isSelected = selectedNetworks.includes(net.id);
                                return (
                                    <button
                                        key={net.id}
                                        type="button"
                                        onClick={() => toggleNetwork(net.id)}
                                        className={`flex items-center gap-2 px-5 py-3 rounded-2xl border transition-all duration-300 ${isSelected
                                            ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-5    00 scale-105'
                                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                                            }`}
                                    >
                                        {isSelected ? <Check size={16} /> : net.icon}
                                        <span className="text-sm font-bold">{net.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* 2. Tanlangan tarmoqlar uchun inputlar */}
                    {selectedNetworks.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 animate-in fade-in slide-in-from-top-4">
                            {selectedNetworks.map(id => (
                                <div key={id} className="flex flex-col gap-2">
                                    <label className='text-[10px] font-black uppercase tracking-widest text-blue-600'>{id}</label>
                                    <div className="relative">
                                        <input
                                            name={id}
                                            value={form[id]}
                                            onChange={handleChange}
                                            placeholder={`@username yoki havola`}
                                            className="w-full py-3 bg-transparent border-b border-slate-500 outline-none focus:border-blue-600 transition-all font-medium placeholder:text-slate-500 placeholder:font-light"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 3. Doimiy Kontaktlar */}
                    <div className="pt-6 border-t border-slate-50">
                        <h2 className='text-xs font-bold uppercase tracking-[0.2em] text-slate-700 mb-6'>Asosiy kontaktlar</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="flex flex-col gap-2">
                                <label className='flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-700'>
                                    <Phone size={12} /> Telefon
                                </label>
                                <input
                                    name="phone"
                                    type="number"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="+998 90 123 45 67"
                                    className="w-full py-3 bg-transparent border-b border-slate-500 outline-none focus:border-blue-600 transition-all font-medium placeholder:text-slate-500 placeholder:font-light"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className='flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-700'>
                                    <Mail size={12} /> Email
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="example@mail.com"
                                    className="w-full py-3 bg-transparent border-b border-slate-500 outline-none focus:border-blue-600 transition-all font-medium placeholder:text-slate-500 placeholder:font-light"
                                />
                            </div>
                        </div>
                    </div>
                    {/* Submit Button */}
                    <div className="pt-10">
                        <button
                            type='submit'
                            className='group flex items-center justify-center gap-3 w-full md:w-auto bg-slate-900 text-white px-12 py-5 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95'
                        >
                            Yakunlash
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                </form>
            </div>
        </section>
    )
}

export default CreateSocials