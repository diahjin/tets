const API = import.meta.env.VITE_API_URL || '/api';
export function getToken(){ return localStorage.getItem('token'); }
export function setToken(t){ t ? localStorage.setItem('token', t) : localStorage.removeItem('token'); }
export async function api(path, options={}) {
  const res = await fetch(`${API}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(getToken()?{Authorization:`Bearer ${getToken()}`}:{ }), ...(options.headers||{}) }, body: options.body && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body });
  if (!res.ok) throw new Error((await res.json().catch(()=>({message:'Error'}))).message || 'Error');
  if (res.status === 204) return null;
  return res.json();
}
