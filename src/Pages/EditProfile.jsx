import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    // 1. Form state: Bazadagi barcha ustunlar uchun
    const [form, setForm] = useState({
        full_name: '',
        age: '',
        bio: '',
        headline: '',
        avatar_url: '',
        socials: {}
    });

    // Dinamik ijtimoiy tarmoqlar ro'yxati
    const AVAILABLE_SOCIALS = ['instagram', 'telegram', 'youtube', 'github', 'linkedin'];

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Tizimga kirgan userning ID-sini olish
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    navigate('/login'); // Kirilmagan bo'lsa haydaymiz
                    return;
                }

                setUserId(user.id);

                // User profilini bazadan tortish
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setForm({
                        ...data,
                        socials: data.socials || {} // JSON null bo'lsa bo'sh {} qo'yish
                    });
                }
            } catch (error) {
                console.error("Xatolik:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    // 2. Oddiy inputlarni o'zgartirish
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 3. Ijtimoiy tarmoq obyektini (JSON) o'zgartirish
    const handleSocialChange = (network, value) => {
        setForm({
            ...form,
            socials: {
                ...form.socials,
                [network]: value
            }
        });
    };

    // 4. Ma'lumotlarni bazaga saqlash
    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase
            .from('profiles')
            .update(form) // Butun form obyektini yuboramiz
            .eq('id', userId); // Faqat o'zimizning qatorni yangilaymiz (RLS)

        if (error) {
            alert("Xato yuz berdi: " + error.message);
        } else {
            alert("Profil muvaffaqiyatli yangilandi!");
            navigate(`/${form.username || ''}`); // Profil sahifasiga qaytish
        }
        setLoading(false);
    };

    if (loading) return <p className="text-center mt-10">Yuklanmoqda...</p>;

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white border rounded-2xl shadow-sm">
            <h1 className="text-2xl font-bold mb-6">Profilni tahrirlash</h1>

            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                {/* Ism va Bio */}
                <div>
                    <label className="text-sm font-medium">To'liq ism</label>
                    <input name="full_name" value={form.full_name} onChange={handleChange} className="w-full border p-2 rounded-md" />
                </div>

                <div>
                    <label className="text-sm font-medium">Bio (O'zingiz haqingizda)</label>
                    <textarea name="bio" value={form.bio} onChange={handleChange} className="w-full border p-2 rounded-md" rows="3" />
                </div>

                <hr />

                {/* Ijtimoiy tarmoqlar (Dinamik) */}
                <h2 className="font-semibold text-gray-700">Ijtimoiy tarmoqlar</h2>
                <div className="grid grid-cols-1 gap-3">
                    {AVAILABLE_SOCIALS.map((network) => (
                        <div key={network} className="flex flex-col">
                            <label className="text-xs uppercase text-gray-400 font-bold">{network}</label>
                            <input
                                type="text"
                                placeholder={`${network} URL yoki username`}
                                value={form.socials?.[network] || ''}
                                onChange={(e) => handleSocialChange(network, e.target.value)}
                                className="border p-2 rounded-md bg-gray-50 focus:bg-white"
                            />
                        </div>
                    ))}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white font-bold py-3 rounded-xl mt-4 hover:bg-blue-700 disabled:bg-gray-400 transition"
                >
                    {loading ? "Saqlanmoqda..." : "O'zgarishlarni saqlash"}
                </button>
            </form>
        </div>
    );
};

export default EditProfile;