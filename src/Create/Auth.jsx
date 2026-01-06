import React, { useState, useEffect } from 'react'
import { supabase } from '../../supabase'

const Auth = ({ handleFinalSignUp }) => {
    const [form, setForm] = useState({ username: '', email: '', password: '' })
    const [status, setStatus] = useState(null) // null, 'loading', 'taken', 'available', 'invalid'

    // 1. Username xavfsizligini tekshirish uchun RegEx
    // Faqat kichik harflar, raqamlar va pastki chiziq. Bo'sh joy taqiqlanadi.
    const usernameRegex = /^[a-z0-9_]+$/;

    useEffect(() => {
        const username = form.username.trim().toLowerCase();

        if (username.length < 3) {
            setStatus(null)
            return
        }

        // RegEx tekshiruvi: Agar g'alati belgilar bo'lsa, bazaga so'rov yubormaymiz
        if (!usernameRegex.test(username)) {
            setStatus('invalid')
            return
        }

        setStatus('loading')

        const timer = setTimeout(async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('username', username)
                    .maybeSingle()

                if (error) throw error;
                setStatus(data ? 'taken' : 'available')
            } catch (err) {
                console.error("Tekshiruvda xatolik:", err.message)
                setStatus(null)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [form.username])

    const handleChange = (e) => {
        // Ma'lumotni kiritayotganda bo'sh joylarni o'chirish (Sanitization)
        let value = e.target.value;
        if (e.target.name === 'username') value = value.trim().toLowerCase();

        setForm({ ...form, [e.target.name]: value })
    }

    const onSubmit = (e) => {
        e.preventDefault()

        // Yakuniy himoya tekshiruvi
        if (status === 'available' && form.password.length >= 6) {
            handleFinalSignUp(form.username, form.password, form.email)
        }
    }

    return (
        <section className='flex justify-center items-start mt-20 min-h-screen p-4'>
            <form onSubmit={onSubmit} className="flex flex-col gap-4 bg-white p-8 border rounded-xl shadow-lg w-full max-w-md">
                <h1 className='text-2xl font-bold text-gray-800 text-center'>Xavfsiz Ro'yxatdan o'tish</h1>

                <div className="flex flex-col gap-1">
                    <label className='text-sm font-semibold text-gray-700'>Username</label>
                    <input
                        name='username'
                        placeholder='faqat kichik harf, son va _'
                        value={form.username}
                        onChange={handleChange}
                        className={`p-2 border rounded-md transition-all outline-none 
                        ${status === 'taken' || status === 'invalid' ? 'border-red-500 bg-red-50' : 'focus:border-blue-500 border-gray-300'}`}
                        required
                    />
                    {status === 'loading' && <span className='text-[10px] text-blue-500'>Bazadan tekshirilmoqda...</span>}
                    {status === 'taken' && <span className='text-[10px] text-red-500 font-medium'>⚠ Bu username allaqachon band!</span>}
                    {status === 'invalid' && <span className='text-[10px] text-orange-500 font-medium'>⚠ Faqat kichik harflar, sonlar va _ mumkin!</span>}
                    {status === 'available' && <span className='text-[10px] text-green-500 font-medium'>✔ Username bo'sh</span>}
                </div>

                <div className="flex flex-col gap-1">
                    <label className='text-sm font-semibold text-gray-700'>E-mail</label>
                    <input
                        name='email'
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder='misol@gmail.com'
                        className='p-2 border border-gray-300 rounded-md focus:border-blue-500 outline-none'
                        required
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className='text-sm font-semibold text-gray-700'>Parol</label>
                    <input
                        name='password'
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder='kamida 6 ta belgi'
                        className='p-2 border border-gray-300 rounded-md focus:border-blue-500 outline-none'
                        required
                    />
                    {form.password.length > 0 && form.password.length < 6 && (
                        <span className='text-[10px] text-red-400'>Parol juda qisqa!</span>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={status !== 'available' || form.password.length < 6}
                    className='bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-bold transition-all disabled:bg-gray-300 disabled:cursor-not-allowed mt-2 shadow-md'
                >
                    {status === 'loading' ? 'Tekshirilmoqda...' : 'Profilni yaratish'}
                </button>
            </form>
        </section>
    )
}

export default Auth