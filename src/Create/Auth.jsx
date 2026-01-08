import React, { useState, useEffect } from 'react'
import { supabase } from '../../supabase'
import { ShieldCheck, Loader2, AlertCircle, CheckCircle2, Lock } from 'lucide-react'

const Auth = ({ handleFinalSignUp }) => {
    const [form, setForm] = useState({ username: '', email: '', password: '' })
    const [status, setStatus] = useState(null) // null, 'loading', 'taken', 'available', 'invalid'

    const usernameRegex = /^[a-z0-9_]+$/;

    useEffect(() => {
        const username = form.username.trim().toLowerCase();
        if (username.length < 3) {
            setStatus(null)
            return
        }
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
                setStatus(null)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [form.username])

    const handleChange = (e) => {
        let value = e.target.value;
        if (e.target.name === 'username') value = value.trim().toLowerCase();
        setForm({ ...form, [e.target.name]: value })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if (status === 'available' && form.password.length >= 6) {
            handleFinalSignUp(form.username, form.password, form.email)
        }
    }

    return (
        <section className='min-h-[80vh] flex flex-col items-center justify-center px-6'>
            <div className="w-full max-w-sm">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mb-4">
                        <ShieldCheck size={28} />
                    </div>
                    <h1 className='text-3xl font-black tracking-tighter text-slate-800'>Ro'yxatdan o'tish</h1>
                    <p className='text-slate-500 text-sm font-semibold'>O'z unikal manzilingizni band qiling</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    {/* Username Field */}
                    <div className="space-y-2">
                        <label className='text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500'>Username</label>
                        <div className="relative flex items-center">
                            <span className="absolute bottom-2  -translate-y-1/3 text-slate-500 font-light ">pageem.com/</span>
                            <input
                                name='username'
                                value={form.username}
                                onChange={handleChange}
                                className={`w-full pl-25 py-3 bg-transparent border-b transition-all outline-none  text-lg flex items-center placeholder:font-light 
                                ${status === 'taken' || status === 'invalid' ? 'border-red-500 text-red-600' :
                                        status === 'available' ? 'border-green-500 text-green-600' : 'border-slate-100 focus:border-blue-600'}`}
                                placeholder="username"
                                required
                            />
                            <div className="absolute right-0 top-1/2 -translate-y-1/2">
                                {status === 'loading' && <Loader2 size={18} className="animate-spin text-blue-600" />}
                                {status === 'taken' && <AlertCircle size={18} className="text-red-500" />}
                                {status === 'invalid' && <AlertCircle size={18} className="text-orange-400" />}
                                {status === 'available' && <CheckCircle2 size={18} className="text-green-500" />}
                            </div>
                        </div>
                        {/* Status Messages */}
                        <div className="h-4">
                            {status === 'taken' && <p className='text-[10px] text-red-500 font-bold uppercase'>Bu nom band qilingan</p>}
                            {status === 'invalid' && <p className='text-[10px] text-orange-500 font-bold uppercase'>Faqat kichik harf, son va _</p>}
                            {status === 'available' && <p className='text-[10px] text-green-500 font-bold uppercase'>Manzil bo'sh!</p>}
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <label className='text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500'>E-mail</label>
                        <input
                            name='email'
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="mail@example.com"
                            className="w-full py-3 bg-transparent border-b border-slate-100 outline-none focus:border-blue-600 transition-all font-medium"
                            required
                        />
                    </div>
                    {/* Password Field */}
                    <div className="space-y-2">
                        <label className='text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500'>Parol</label>
                        <div className="relative">
                            <input
                                name='password'
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full py-3 bg-transparent border-b border-slate-100 outline-none focus:border-blue-600 transition-all font-medium"
                                required
                            />
                            <Lock size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-200" />
                        </div>
                        {form.password.length > 0 && form.password.length < 6 && (
                            <p className='text-[10px] text-red-400 font-bold uppercase'>Kamida 6 ta belgi!</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={status !== 'available' || form.password.length < 6}
                        className='w-full bg-slate-900 hover:bg-blue-600 text-white py-5 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all disabled:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed active:scale-95 shadow-xl shadow-slate-100'
                    >
                        Profilni yakunlash
                    </button>
                </form>
            </div>
        </section>
    )
}

export default Auth