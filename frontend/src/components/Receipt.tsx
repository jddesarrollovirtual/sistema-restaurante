import { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer } from 'lucide-react';
import { PrintOptionsModal } from './PrintOptionsModal';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

interface ReceiptProps {
  order: any;
}

export const Receipt = ({ order }: ReceiptProps) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [comprobante, setComprobante] = useState<any>(null);
  const token = useSelector((state: RootState) => state.auth.token);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: comprobante ? `Ticket-${comprobante.serie}-${comprobante.numero}` : 'Ticket',
    pageStyle: `
      @media print {
        @page { size: 80mm auto; margin: 0; }
        body { margin: 0; padding: 0; }
        .thermal-ticket { width: 72mm; font-family: monospace; font-size: 11px; color: black; padding: 5px; }
      }
    `,
  });

  useEffect(() => {
    if (comprobante) handlePrint();
  }, [comprobante, handlePrint]);

  const onPrintOptionsSubmit = async (options: any) => {
    try {
      const response = await axios.post('http://localhost:3000/api/comprobantes', {
        tipoComprobante: options.type === 'factura' ? 'FACTURA' : 'BOLETA',
        // Fallback to '00000000' for Boleta Simple if no DNI is provided
        numeroDocumento: options.data.dni || options.data.ruc || '00000000',
        nombreCliente: options.data.businessName || 'CLIENTE FINAL',
        total: order.total,
        orderId: order._id,
        zona: order.table?.zone || 'GENERAL'
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      setComprobante(response.data);
      setShowModal(false);
    } catch (err) { console.error(err); }
  };

  return (
    <>
      {showModal && <PrintOptionsModal onClose={() => setShowModal(false)} onPrint={onPrintOptionsSubmit} />}

      <div style={{ display: 'none' }}>
        <div ref={componentRef} className="thermal-ticket">
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '5px' }}>
                <h2 style={{ fontSize: '14px', fontWeight: 'bold' }}>SMART RESTAURANT 360</h2>
                <p>Av. Principal 123 - Lima | RUC: 20600000001</p>
            </div>
            
            {/* Comprobante Info */}
            <div style={{ borderTop: '1px dashed black', borderBottom: '1px dashed black', padding: '5px 0', marginBottom: '5px' }}>
                <p style={{ fontWeight: 'bold', fontSize: '13px' }}>{comprobante?.tipoComprobante || 'TICKET'}</p>
                <p>Nro: {comprobante ? `${comprobante.serie}-${comprobante.numero.toString().padStart(6, '0')}` : '---'}</p>
                <p>Fecha/Hora: {new Date(comprobante?.fecha || Date.now()).toLocaleString()}</p>
                <p>Cliente: {comprobante?.nombreCliente || '-'}</p>
                <p>Doc: {comprobante?.numeroDocumento || '-'}</p>
                <p>Mesa: {order.table?.number || '-'} | Zona: {order.table?.zone || 'GENERAL'}</p>
                <p>Caja: {comprobante?.cajaId || 'CAJA-01'}</p>
                <p>Vendedor: {currentUser?.name || 'Sistema'}</p>
            </div>

            {/* Items */}
            <div style={{ marginBottom: '5px' }}>
                {order.items.map((item: any, idx: number) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{item.quantity} x {item.product?.name}</span>
                        <span>{(item.product?.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
            </div>

            {/* Totales */}
            <div style={{ textAlign: 'right', borderTop: '1px solid black', paddingTop: '5px', marginBottom: '5px' }}>
                <p>Subtotal: S/ {comprobante?.subtotal.toFixed(2) || '0.00'}</p>
                <p>IGV (18%): S/ {comprobante?.igv.toFixed(2) || '0.00'}</p>
                <p style={{ fontWeight: 'bold', fontSize: '13px' }}>TOTAL: S/ {order.total.toFixed(2)}</p>
            </div>

            {/* Fiscal Status */}
            <div style={{ textAlign: 'center', borderTop: '1px dashed black', paddingTop: '5px' }}>
                <p>Estado SUNAT: {comprobante?.estadoSUNAT || 'PENDIENTE'}</p>
                <p style={{ fontSize: '9px', wordBreak: 'break-all' }}>Hash: {comprobante?.hashSUNAT || '---'}</p>
                <div style={{ marginTop: '5px', padding: '5px', border: '1px solid black', display: 'inline-block' }}>
                    [QR {comprobante?.qrSUNAT || 'PENDIENTE'}]
                </div>
            </div>
        </div>
      </div>
      
      <button onClick={() => setShowModal(true)} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2">
        <Printer size={16}/> Imprimir Ticket
      </button>
    </>
  );
};
