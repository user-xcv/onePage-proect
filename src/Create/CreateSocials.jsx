import React, { useState } from 'react'

// Propsni {} ichida qabul qilamiz
const CreateSocials = ({ updateData, setStep }) => {

    // Qaysi inputlar ochiqligini saqlash uchun (ko'p tanlovli)
    const [visibleInputs, setVisibleInputs] = useState({
        instagram: false,
        telegram: false,
        youtube: false,
        facebook: false,
        whatsapp: false
    })

    const [form, setForm] = useState({
        instagram: '',
        telegram: '',
        youtube: '',
        facebook: '',
        whatsapp: '',
        phone: '',
        email: ''
    })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    // Checkbox o'zgarganda ishlaydi
    const handleCheckbox = (name) => {
        setVisibleInputs(prev => ({ ...prev, [name]: !prev[name] }))
    }

    const handleNext = (e) => {
        e.preventDefault()
        // Ma'lumotni asosiy CreatePage-ga yuboramiz
        updateData({ socials: form })
        // Sahifani yangilamasdan 3-qadamga o'tamiz
        setStep(3)
    }

    return (
        <section className='flex justify-center items-start mt-20 min-h-screen'>
            <div className="mx-auto container max-w-4xl">
                <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-1">
                        <h1 className='font-bold text-2xl'>Sahifa yaratish</h1>
                        <p className='text-gray-400'>2-qadam: Ijtimoiy tarmoqlar</p>
                    </div>

                    <form onSubmit={handleNext} className="border border-gray-200 p-8 rounded-xl bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                            {/* Chap tomon: Tarmoqlar */}
                            <div className="flex flex-col gap-4">
                                <h2 className='font-semibold text-xl'>Ijtimoiy tarmoqlar</h2>

                                {/* Instagram */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" onChange={() => handleCheckbox('instagram')} />
                                        <label className='font-medium'>Instagram</label>
                                    </div>
                                    {visibleInputs.instagram && (
                                        <input name="instagram" value={form.instagram} onChange={handleChange}
                                            className="outline-blue-600 p-2 border border-gray-300 rounded" placeholder="@username" />
                                    )}
                                </div>

                                {/* Telegram */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" onChange={() => handleCheckbox('telegram')} />
                                        <label className='font-medium'>Telegram</label>
                                    </div>
                                    {visibleInputs.telegram && (
                                        <input name="telegram" value={form.telegram} onChange={handleChange}
                                            className="outline-blue-600 p-2 border border-gray-300 rounded" placeholder="@username" />
                                    )}
                                </div>

                                {/* Youtube */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" onChange={() => handleCheckbox('youtube')} />
                                        <label className='font-medium'>Youtube</label>
                                    </div>
                                    {visibleInputs.youtube && (
                                        <input name="youtube" value={form.youtube} onChange={handleChange}
                                            className="outline-blue-600 p-2 border border-gray-300 rounded" placeholder="@username" />
                                    )}
                                </div>

                                {/* Facebook */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" onChange={() => handleCheckbox('facebook')} />
                                        <label className='font-medium'>Facebook</label>
                                    </div>
                                    {visibleInputs.facebook && (
                                        <input name="facebook" value={form.facebook} onChange={handleChange}
                                            className="outline-blue-600 p-2 border border-gray-300 rounded" placeholder="@username" />
                                    )}
                                </div>

                                {/* Whatsapp */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" onChange={() => handleCheckbox('whatsapp')} />
                                        <label className='font-medium'>Whatsapp</label>
                                    </div>
                                    {visibleInputs.whatsapp && (
                                        <input name="whatsapp" value={form.whatsapp} onChange={handleChange}
                                            className="outline-blue-600 p-2 border border-gray-300 rounded" placeholder="@username" />
                                    )}
                                </div>
                            </div>

                            {/* O'ng tomon: Kontaktlar */}
                            <div className="flex flex-col gap-4">
                                <h2 className='font-semibold text-xl'>Kontaktlar</h2>
                                <div className="flex flex-col gap-3">
                                    <label>Telefon</label>
                                    <input name="phone" type="number" value={form.phone} onChange={handleChange}
                                        className='outline-blue-600 p-2 border border-gray-200 rounded' placeholder='+998...' />

                                    <label>Shaxsiy Email</label>
                                    <input name="email" type="email" value={form.email} onChange={handleChange}
                                        className='outline-blue-600 p-2 border border-gray-200 rounded' placeholder='mail@example.com' />
                                </div>

                                <button type='submit' className='mt-6 text-white py-3 rounded font-semibold bg-blue-600 hover:bg-blue-700 transition-all cursor-pointer'>
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

export default CreateSocials