import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

export const UserRegistrationForm = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'mesero' });
  const [message, setMessage] = useState('');
  const token = useSelector((state: RootState) => state.auth.token);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/auth/register', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Usuario registrado exitosamente.');
      setFormData({ username: '', email: '', password: '', role: 'mesero' });
    } catch (err) {
      setMessage('Error al registrar usuario.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-[#111827] rounded-3xl border border-white/5 shadow-sm space-y-4">
      <h2 className="text-xl font-bold text-white mb-6">Registrar Nuevo Usuario</h2>
      {message && <p className="text-sm text-indigo-400 font-medium">{message}</p>}
      
      <input type="text" placeholder="Nombre de usuario" className="w-full p-4 rounded-xl bg-[#05070E] text-white border border-white/5 focus:ring-2 focus:ring-indigo-500 outline-none" onChange={e => setFormData({...formData, username: e.target.value})} required />
      <input type="email" placeholder="Email" className="w-full p-4 rounded-xl bg-[#05070E] text-white border border-white/5 focus:ring-2 focus:ring-indigo-500 outline-none" onChange={e => setFormData({...formData, email: e.target.value})} required />
      <input type="password" placeholder="Contraseña" className="w-full p-4 rounded-xl bg-[#05070E] text-white border border-white/5 focus:ring-2 focus:ring-indigo-500 outline-none" onChange={e => setFormData({...formData, password: e.target.value})} required />
      
      <select className="w-full p-4 rounded-xl bg-[#05070E] text-white border border-white/5 outline-none" onChange={e => setFormData({...formData, role: e.target.value})}>
        <option value="mesero">Mesero</option>
        <option value="cocinero">Cocinero</option>
        <option value="cajero">Cajero</option>
        <option value="administrador">Administrador</option>
      </select>
      
      <button type="submit" className="w-full p-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition">Registrar Usuario</button>
    </form>
  );
};
