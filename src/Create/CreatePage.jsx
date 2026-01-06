import React, { useState } from 'react'
import CreateProfile from './CreateProfile'
import CreateSocials from './CreateSocials'
import Auth from './Auth' // Signup komponenti
import { supabase } from '../../supabase'
import { useNavigate } from 'react-router-dom'

const CreatePage = () => {
    const [step, setStep] = useState(1)
    const navigate = useNavigate()
    //biz barcha malumotlarni shu sumka yani (fulldate ichida yigdik )
    const [fullData, setFullData] = useState({
        full_name: '',
        age: '',
        bio: '',
        headline: '',
        avatar_url: '',
        socials: {}
    })

    // Ma'lumotlarni yangilash funksiyasi
    const updateData = (newData) => {
        setFullData(prev => ({ ...prev, ...newData }))
    }

    const handleFinalSignUp = async (username, password, email) => {

        const userAge = parseInt(fullData.age)
        const validatAge = isNaN(userAge) ? 0 : userAge
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email, // Foydalanuvchi kiritgan real email
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

            navigate(`/${username}`)

        } catch (err) {
            alert("Xatolik: " + err.message)
        }
    }

    return (
        // step by step ligni sababi biz malumopt kirityotganda avvalgi qadamdagi malumotlar uchib ketmasligi uchun
        <>
            {/* Step 1: Ism, yosh, bio */}
            {step === 1 && (
                <CreateProfile
                    setStep={setStep}
                    updateData={updateData}
                />
            )}

            {/* Step 2: Ijtimoiy tarmoqlar */}
            {step === 2 && (
                <CreateSocials
                    setStep={setStep}
                    updateData={updateData}
                />
            )}

            {/* Step 3: Username va Password tanlash */}
            {step === 3 && (
                <Auth
                    handleFinalSignUp={handleFinalSignUp}
                />
            )}
        </>
    )
}

export default CreatePage