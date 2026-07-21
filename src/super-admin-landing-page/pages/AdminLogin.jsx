import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ShieldCheck, AlertTriangle, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { requestOtp, loginWithOtp } from "../api/auth";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user, token, setUser, setToken } = useAppContext();

  useEffect(() => {
    if (user && token) {
      if (user.role === "SUPER_ADMIN") {
        navigate("/admin/super-admin/dashboard");
      } else if (user.role === "COUNSELOR") {
        navigate("/admin/lead-management/dashboard");
      } else if (user.role === "SUB_ADMIN") {
        navigate("/admin/attendance-dashboard");
      } else {
        navigate("/admin/dashboard");
      }
    }
  }, [user, token, navigate]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      triggerError("Please enter a valid email.");
      return;
    }

    setLoading(true);
    try {
      const roleType = role === "super" ? "SUPER_ADMIN" : role === "counselor" ? "COUNSELOR" : "ADMIN";
      await requestOtp(email, roleType);
      toast.success("OTP sent to your email!");
      setStep(2);
      setError("");
    } catch (err) {
      triggerError(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyLogin = async (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      triggerError("Enter a valid 6-digit OTP.");
      return;
    }

    try {
      const roleType = role === "super" ? "SUPER_ADMIN" : role === "counselor" ? "COUNSELOR" : "ADMIN";
      const res = await loginWithOtp(email, otp, roleType);

      const { token, user } = res;
      setToken(token);
      setUser(user);
      localStorage.setItem("authToken", token);

      toast.success(`Welcome back, ${user.name}!`);

      if (role === "admin") {
        if (user.role === "SUB_ADMIN") {
          navigate("/admin/attendance-dashboard");
        } else {
          navigate("/admin/dashboard");
        }
      } else if (role === "counselor") {
        navigate("/admin/lead-management/dashboard");
      } else {
        navigate("/admin/super-admin/dashboard");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed.";
      triggerError(msg);
    } finally {
      setLoading(false);
    }
  };

  const triggerError = (msg) => {
    setError(msg);
    toast.error(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#f4f6fa] px-4">
      <div
        className={`
          w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-8
          transition-all duration-300 transform
          ${shake ? "animate-shake scale-[1.02]" : "scale-100"}
        `}
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            <ShieldCheck size={36} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-gray-500 mt-1">Secure OTP Login</p>
        </div>

        {/* Role Toggle */}
        <div className="flex bg-gray-50 border border-gray-100 rounded-xl p-1 mb-8">
          {["admin", "counselor", "super"].map((r) => (
            <button
              key={r}
              onClick={() => { setRole(r); setStep(1); }}
              className={`flex-1 py-2.5 rounded-lg font-semibold transition text-sm capitalize
                ${role === r ? "bg-white text-blue-600 shadow-sm border border-gray-100" : "text-gray-400 hover:text-gray-600"}
              `}
            >
              {r === 'admin' ? 'Institute' : r}
            </button>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm border border-red-100 animate-in fade-in duration-300">
            <AlertTriangle size={18} /> {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                type="email"
                required
                placeholder="Enter Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-800 font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 active:scale-[0.98] flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : (
                <>Send OTP <ArrowRight size={20} /></>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyLogin} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 flex items-center justify-between">
              <span className="text-sm text-blue-600 font-medium truncate max-w-[200px]">{email}</span>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <ArrowLeft size={12} /> Change
              </button>
            </div>

            <div className="relative group">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                type="text"
                required
                maxLength={6}
                placeholder="Enter 6-Digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-800 font-bold tracking-[0.5em] text-center text-xl placeholder:tracking-normal placeholder:font-medium placeholder:text-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 active:scale-[0.98] flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : "Verify & Login"}
            </button>

            <p className="text-center text-sm text-gray-500">
              Didn't receive OTP? {" "}
              <button
                type="button"
                onClick={handleSendOtp}
                className="text-blue-600 font-bold hover:underline"
              >
                Resend
              </button>
            </p>
          </form>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          50% { transform: translateX(8px); }
          75% { transform: translateX(-8px); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
}
