import { useState, useEffect } from 'react';
import { X, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

interface PrintOptionsModalProps {
  onClose: () => void;
  onPrint: (options: { type: 'boleta_simple' | 'boleta_dni' | 'factura'; data: any }) => void;
}

export const PrintOptionsModal = ({ onClose, onPrint }: PrintOptionsModalProps) => {
  const [type, setType] = useState<'boleta_simple' | 'boleta_dni' | 'factura'>('boleta_simple');
  const [dni, setDni] = useState('');
  const [ruc, setRuc] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const lookup = async () => {
        if ((type === 'boleta_dni' && dni.length === 8) || (type === 'factura' && ruc.length === 11)) {
            setLoading(true);
            setError(null);
            try {
                const endpoint = type === 'boleta_dni' ? `dni/${dni}` : `ruc/${ruc}`;
                const res = await axios.get(`http://localhost:3000/api/identity/${endpoint}`);
                
                if (type === 'boleta_dni') {
                    setBusinessName(`${res.data.nombres} ${res.data.apellidoPaterno} ${res.data.apellidoMaterno}`);
                } else {
                    setBusinessName(res.data.razonSocial);
                }
            } catch (err) {
                setError('No se pudo obtener la información.');
            } finally {
                setLoading(false);
            }
        }
    };
    lookup();
  }, [type, dni, ruc]);

  const validate = () => {
    if (type === 'boleta_dni' && dni.length !== 8) return 'El DNI debe tener 8 dígitos.';
    if (type === 'factura') {
      if (ruc.length !== 11) return 'El RUC debe tener 11 dígitos.';
      if (!businessName.trim()) return 'La Razón Social es obligatoria.';
    }
    return null;
  };

  const handlePrint = () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    onPrint({
      type,
      data: { dni, ruc, businessName }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-sm text-black">
        <div className="flex justify-between mb-4">
          <h3 className="font-bold text-black">Opciones de Impresión</h3>
          <button onClick={onClose}><X size={20} className="text-black" /></button>
        </div>

        {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm mb-4 bg-red-50 p-2 rounded">
                <AlertCircle size={16}/> {error}
            </div>
        )}

        <select 
          className="w-full p-2 border rounded-lg mb-4 text-black bg-white"
          value={type}
          onChange={(e) => {
              setType(e.target.value as any);
              setError(null);
              setBusinessName('');
          }}
        >
          <option value="boleta_simple" className="text-black">Boleta Simple</option>
          <option value="boleta_dni" className="text-black">Boleta con DNI</option>
          <option value="factura" className="text-black">Factura</option>
        </select>

        {loading && <div className="flex items-center gap-2 mb-4 text-indigo-600"><Loader2 className="animate-spin" /> Consultando...</div>}

        {type === 'boleta_dni' && (
          <input 
            type="text"
            maxLength={8}
            placeholder="DNI (8 dígitos)"
            className="w-full p-2 border rounded-lg mb-4 text-black bg-white"
            value={dni}
            onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
          />
        )}

        {type === 'factura' && (
          <>
            <input 
              type="text"
              maxLength={11}
              placeholder="RUC (11 dígitos)"
              className="w-full p-2 border rounded-lg mb-2 text-black bg-white"
              value={ruc}
              onChange={(e) => setRuc(e.target.value.replace(/\D/g, ''))}
            />
            <input 
              type="text"
              placeholder="Razón Social"
              className="w-full p-2 border rounded-lg mb-4 text-black bg-white"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </>
        )}

        <button 
          onClick={handlePrint}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold"
        >
          Imprimir
        </button>
      </div>
    </div>
  );
};
