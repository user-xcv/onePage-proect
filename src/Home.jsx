import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate()
  return (
    <section className="mx-auto container flex items-center justify-center h-screen">
      <div className="border border-gray-200 p-10 rounded-xl text-center flex flex-col gap-5 shadow-sm">
        <h1 className="font-bold text-3xl">
          <span className="font-bold text-blue-600 "> OnePage</span> – Shaxsiy <br /> sahifangizni yarating
        </h1>

        <p className="text-gray-400 text-lg">
          Ism, aloqa va ijtimoiy profillaringizni bir joyda ko‘rsating
        </p>

        <button onClick={() => navigate('/create')} className="bg-blue-600 text-white py-2 px-6 rounded-lg w-3/7 mx-auto cursor-pointer font-semibold ">
          Sahifa yaratish
        </button>
      </div>
    </section>
  );
};

export default Home;
