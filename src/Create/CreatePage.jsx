import React, { useState } from 'react'
import CreateProfile from './CreateProfile'
import CreateSocials from './CreateSocials'
import Auth from './Auth'
import { supabase } from '../../supabase'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'

const CreatePage = () => {
    const [step, setStep] = useState(1)
    const navigate = useNavigate()
    const [fullData, setFullData] = useState({
        full_name: '',
        age: '',
        bio: '',
        headline: '',
        avatar_url: '',
        socials: {}
    })

    const updateData = (newData) => {
        setFullData(prev => ({ ...prev, ...newData }))
    }

    const handleFinalSignUp = async (username, password, email) => {
        const userAge = parseInt(fullData.age)
        const validatAge = isNaN(userAge) ? 0 : userAge

        // 2. Yuklanish holatini ko'rsatuvchi toast
        const loadingToast = toast.loading("Profil yaratilmoqda...")

        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        username: username,
                        full_name: fullData.full_name || '',
                        bio: fullData.bio || '',
                        age: validatAge,
                        headline: fullData.headline || '',
                        avatar_url: fullData.avatar_url || '',
                        socials: fullData.socials || {}
                    }
                }
            })

            if (error) throw error

            toast.success("Muvaffaqiyatli ro'yxatdan o'tdingiz!", { id: loadingToast })
            navigate(`/${username}`)

        } catch (err) {
            toast.error("Xatolik: " + err.message, { id: loadingToast })
        }
    }

    return (
        <>
            {/* 5. Toaster komponentini sahifaga qo'shamiz */}
            <Toaster position="top-center" reverseOrder={false} />

            {step === 1 && (
                <CreateProfile
                    setStep={setStep}
                    updateData={updateData}
                />
            )}

            {step === 2 && (
                <CreateSocials
                    setStep={setStep}
                    updateData={updateData}
                />
            )}

            {step === 3 && (
                <Auth
                    handleFinalSignUp={handleFinalSignUp}
                />
            )}
        </>
    )
}

export default CreatePage
