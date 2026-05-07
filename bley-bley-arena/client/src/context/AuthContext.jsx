import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, setToken, getToken } from '../services/api';
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);
export function AuthProvider({ children }){
  const [user,setUser]=useState(null), [loading,setLoading]=useState(true);
  useEffect(()=>{ getToken()? api('/auth/me').then(r=>setUser(r.user)).catch(()=>setToken(null)).finally(()=>setLoading(false)) : setLoading(false); },[]);
  const login=async(email,password)=>{ const r=await api('/auth/login',{method:'POST',body:{email,password}}); setToken(r.token); setUser(r.user); };
  const register=async(payload)=>{ const r=await api('/auth/register',{method:'POST',body:payload}); setToken(r.token); setUser(r.user); };
  const logout=()=>{ setToken(null); setUser(null); };
  return <AuthContext.Provider value={{user,setUser,loading,login,register,logout}}>{children}</AuthContext.Provider>;
}
