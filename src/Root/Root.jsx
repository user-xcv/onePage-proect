import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabase'

const Root = ({ children }) => {
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: { session }, error: authError } = await supabase.auth.getSession()
                if (authError) throw auth

                if (!session) {
                    navigate('/')
                    return
                }

                if (session?.user?.id) {
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('username')
                        .eq('id', session.user.id)
                        .maybeSingle()

                    if (profileError) {
                        console.error('Profil tekshirishda xatolik', profileError.message)
                    }

                    if (!profile) {
                        navigate('/')
                    } else if (window.location.pathname === '/') {
                        navigate(`/${profile.username}`)
                    }
                }
            }
            catch (error) {
                console.error('root xatosi', error.message)
                navigate('/')
            } finally {
                setLoading(false)
            }
        }

        checkAuth()


    }, [navigate])
    if (loading) return <div className="flex h-screen items-center justify-center font-bold">Yuklanmoqda...</div>
    return (
        <>
            {children}
        </>
    )
}

export default Root
