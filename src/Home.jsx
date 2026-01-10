import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Globe, Zap, Shield, X, Lock, User, Loader2 } from "lucide-react";
import { supabase } from "../supabase";

const Home = () => {
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ username: "", password: "" });

  const navigate = useNavigate();

  // Inputlar o'zgarganda state'ni yangilash
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  // --- LOGIN FUNKSIYASI (2-YOL) ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const inputUsername = formData.username.trim().toLowerCase();

    try {
      // 1. Profiles jadvalidan username orqali emailni qidiramiz
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', inputUsername)
        .maybeSingle(); // single() o'rniga maybeSingle() xatoni yaxshiroq boshqaradi

      if (profileError || !profile) {
        throw new Error("Bunday username topilmadi!");
      }

      // 2. Topilgan email va kiritilgan parol bilan Auth'dan o'tamiz
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: formData.password,
      });

      if (authError) {
        if (authError.message === "Invalid login credentials") {
          throw new Error("Parol noto'g'ri!");
        }
        throw authError;
      }

      // Muvaffaqiyatli kirish
      if (data.user) {
        setModal(false);
        navigate(`/${inputUsername}`);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[90vh] flex flex-col items-center justify-center px-6 relative overflow-hidden bg-white">

      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [-size:32px_32px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Global Version 0.1</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-slate-800 mb-9">
          Pageem<span className="text-blue-600">.</span> <br />
          <span className="text-5xl text-slate-400 md:text-7xl italic font-medium">Digital Identity.</span>
        </h1>

        <p className="text-sm md:text-xl text-slate-500 max-w-lg mx-auto font-medium mb-12">
          Barcha havolalaringizni bitta professional sahifaga jamlang.
        </p>

        <div className="flex flex-col items-center gap-4 w-full justify-center">
          <button
            onClick={() => navigate('/create')}
            className="group w-full sm:w-auto flex items-center justify-center gap-3 bg-slate-900 hover:bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all active:scale-95"
          >
            Sahifa yaratish
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setModal(true)}
            className="text-xs text-slate-400 hover:text-slate-900 border-b border-transparent hover:border-slate-200 pb-1"
          >
            Oldin sahifa yaratganmisiz? Kirish
          </button>
        </div>
      </div>

      {/* --- LOGIN MODAL --- */}
      {modal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !loading && setModal(false)} />

          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-scale-up">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase">Xush kelibsiz</h3>
                  <p className="text-xs text-slate-400 font-medium uppercase mt-1">Sahifangizga kiring</p>
                </div>
                <button onClick={() => setModal(false)} className="p-2 text-slate-400 hover:text-slate-900"><X size={20} /></button>
              </div>

              {/* Login Formasi */}
              <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input
                    required
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="USERNAME"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 pl-12 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 uppercase"
                  />
                </div>

                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input
                    required
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="PASSWORD"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 pl-12 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 uppercase"
                  />
                </div>

                {error && <p className="text-[10px] text-red-500 font-bold uppercase text-center tracking-wider">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 bg-slate-900 text-white py-4 rounded-xl font-semibold text-sm uppercase hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : "Kirish"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Home;