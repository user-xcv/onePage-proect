import React from "react";
import "../styles/home.css";

const Home = () => {
  return (
    <div className="home-container">
      <div className="card">
        <h1 className="title">
          OnePage – Shaxsiy <br /> sahifangizni yarating
        </h1>

        <p className="subtitle">
          Ism, aloqa va ijtimoiy profillaringizni bir joyda ko‘rsating
        </p>

        <button className="primary-btn">Sahifa yaratish</button>

      </div>
    </div>
  );
};

export default Home;
