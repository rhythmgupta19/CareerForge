import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';
import toast from 'react-hot-toast';
import { BsLightningFill } from 'react-icons/bs';
import { GoogleLogin } from '@react-oauth/google';

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Force light mode on public pages to prevent dark mode class leakage
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <div className="min-h-screen bg-[var(--land-bg-alt)] flex items-center justify-center p-6 selection:bg-[var(--brand-green-light)] selection:text-[var(--brand-green)] relative overflow-hidden" style={{ fontFamily: "'Nunito', sans-serif" }}>
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[var(--brand-green-light)] rounded-full blur-[100px] -z-10 opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-yellow-100 rounded-full blur-[80px] -z-10 opacity-70"></div>

      <div className="max-w-[480px] w-full relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block w-14 h-14 rounded-2xl shadow-[var(--shadow-bubbly)] mb-6 transform hover:-translate-y-1 transition-transform overflow-hidden">
            <img src={logoImg} alt="CareerForge Logo" className="w-full h-full object-cover" />
          </Link>
          <h2 className="text-3xl font-black text-[var(--land-text)] tracking-tight mb-2">Create your account</h2>
          <div className="flex items-center justify-center gap-2 text-[var(--land-nav)] font-bold">
            <BsLightningFill className="text-[var(--brand-orange)]" />
            <span>Start forging your tech career today.</span>
          </div>
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
          {/* Google Signup at the top */}
          <div className="w-full flex flex-col items-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                setIsLoading(true);
                try {
                  const data = await googleLogin(credentialResponse.credential);
                  toast.success('Welcome to CareerForge!');
                  if (data.user.role === 'admin') navigate('/admin');
                  else if (!data.user.activeDomain && !data.user.selectedDomain) navigate('/domains');
                  else navigate('/dashboard');
                } catch (error) {
                  toast.error(error.response?.data?.message || 'Google signup failed');
                } finally {
                  setIsLoading(false);
                }
              }}
              onError={() => {
                toast.error('Google Sign-In failed');
              }}
              theme="filled_black"
              shape="pill"
              width="360"
            />
            <p className="text-[10px] text-gray-400 mt-2.5 font-bold text-center">Fastest & most secure way to sign up</p>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-[var(--land-nav)] font-bold">
              Already have an account? <Link to="/login" className="text-[var(--brand-green)] font-black hover:text-[var(--brand-green-hover)] ml-1">Log in</Link>
            </p>
          </div>
        </div>
        
        <p className="text-center mt-8 text-xs text-gray-400 max-w-xs mx-auto font-bold uppercase tracking-wider">
          By signing up, you agree to our Terms of Service and <Link to="/privacy-policy" className="underline hover:text-[var(--brand-green)]">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
};

export default Signup;
