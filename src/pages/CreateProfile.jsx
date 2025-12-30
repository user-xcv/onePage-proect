import React from 'react'

const UserData = () => {
    return (
        <section className='flex justify-center items-start mt-50 min-h-screen'>
            <div className="mx-auto container">
                <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-1">
                        <h1 className='font-bold text-2xl'>Sahifa yaratish</h1>
                        <p className='text-gray-400'>4 qadam va tarmoqda shaxsiy sahifa</p>
                    </div>
                    <form className="border border-gray-200 p-5 rounded-xl ">
                        <div className="flex flex-col md:flex-row md:items-center md:gap-20 gap-6 ">
                            <div className="flex-1 flex flex-col gap-4 ">
                                <h1 className='font-semibold text-xl'>Asosiy ma'lumotlar</h1>
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col">
                                        <label>Ism</label>
                                        <input
                                            type="text"
                                            placeholder='Ismingizni kiriting'
                                            maxLength={22}
                                            className='outline-blue-600 p-2 border border-gray-200 rounded-sm'
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label>Yosh</label>
                                        <input
                                            type="text"
                                            placeholder='Yoshingizni kiriting'
                                            maxLength={22}
                                            className='outline-blue-600 p-2 border border-gray-200 rounded-sm'
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label>Bio</label>
                                        <textarea
                                            placeholder="O'zingiz haqida qisqacha yozing"
                                            className='h-20 outline-blue-600 p-2 border border-gray-200 rounded-sm'
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className=" flex flex-col flex-1 gap-3  ">
                                <div className="flex flex-col gap-1">
                                    <h1 className='font-semibold text-xl'>O'zingizni bir jumlada tasvirlang</h1>
                                    <p className='text-gray-400 text-sm'>Bu matn sahifangiz tepasida katta sarlavha sifatida ko'rinadi.</p>
                                </div>
                                <input
                                    type="text"
                                    placeholder='Masalan:Frontend dasturchi & bloger'
                                    maxLength={22}
                                    className='outline-blue-600 p-2 border border-gray-200 rounded-sm w-1/2'
                                />
                                <div className="">
                                    <button className='text-white py-1 px-3 w-1/4 rounded-sm font-semibold bg-blue-600'>Davom etish</button>

                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default UserData
