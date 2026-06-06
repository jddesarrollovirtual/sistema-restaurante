import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, User, Loader2 } from 'lucide-react';
import axios from 'axios';
import { login } from '../services/authService';
import { loginSuccess } from '../features/authSlice';
import { Button } from './ui/Button';

export const AuthForm = ({ role, onBack }: { role: string, onBack: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [users, setUsers] = useState<{_id: string, username: string}[]>([]);
  const [selectedUsername, setSelectedUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/api/users/all')
      .then(res => setUsers(res.data))
      .catch(() => setError('Error al cargar usuarios'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await login(selectedUsername, password);
      dispatch(loginSuccess(data));
      navigate('/dashboard');
    } catch (err: any) {
      setError('Credenciales incorrectas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Button type="button" variant="ghost" onClick={onBack} className="text-xs">← Volver</Button>
      
      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-red-950/20 text-red-200 rounded-xl text-sm border border-red-900/50 flex items-center gap-2">
          {error}
        </motion.div>
      )}
      
      <div className="relative group">
        <User className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-primary w-5 h-5 transition-colors" />
        <select 
            className="w-full pl-11 pr-4 py-3 bg-background-panel border border-white/5 rounded-xl outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 text-white transition-all appearance-none"
            onChange={(e) => setSelectedUsername(e.target.value)}
            required
        >
            <option value="" className="bg-background-panel">Selecciona tu nombre</option>
            {users.map(u => <option key={u._id} value={u.username} className="bg-background-panel">{u.username}</option>)}
        </select>
      </div>
      
      <div className="relative group">
        <Lock className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-primary w-5 h-5 transition-colors" />
        <input 
            type={showPassword ? 'text' : 'password'} 
            placeholder="PIN" 
            className="w-full pl-11 pr-12 py-3 bg-background-panel border border-white/5 rounded-xl outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 text-white transition-all placeholder-text-dark"
            onChange={(e) => setPassword(e.target.value)}
            required
        />
        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-500 hover:text-white">
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      
      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full"
      >
        {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
        {isLoading ? 'Accediendo...' : 'Ingresar'}
      </Button>
    </form>
  );
};
