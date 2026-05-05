import React from 'react';
import { Printer, X, Stethoscope } from 'lucide-react';

interface PrescriptionProps {
  patient: any;
  doctor: string;
  onClose: () => void;
}

const PrescriptionModal: React.FC<PrescriptionProps> = ({ patient, doctor, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="glass-card" style={{ 
        width: '100%', 
        maxWidth: '800px', 
        maxHeight: '90vh', 
        overflow: 'auto',
        position: 'relative',
        padding: '0'
      }}>
        {/* Modal Controls */}
        <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Stethoscope size={20} /> Xem trước đơn thuốc
          </h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-primary" onClick={handlePrint}>
              <Printer size={18} /> In đơn thuốc
            </button>
            <button className="btn btn-ghost" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div id="printable-prescription" style={{ 
          padding: '40px', 
          background: 'white', 
          color: 'black',
          minHeight: '600px',
          fontFamily: 'serif'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
            <div style={{ textAlign: 'left' }}>
              <h2 style={{ color: '#1e40af', margin: 0 }}>SmartMed CLINIC</h2>
              <p style={{ fontSize: '0.9rem' }}>123 Đường Y Tế, Quận 1, TP. HCM</p>
              <p style={{ fontSize: '0.9rem' }}>SĐT: 028 3824 1234</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p>Mã đơn: <b>PRES-{Math.floor(Math.random() * 10000)}</b></p>
              <p>Ngày: {new Date().toLocaleDateString('vi-VN')}</p>
            </div>
          </div>

          <h1 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '30px', borderBottom: '2px solid black', paddingBottom: '10px' }}>ĐƠN THUỐC</h1>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            <p>Họ tên: <b>{patient.name}</b></p>
            <p>Ngày sinh: {patient.dob || 'N/A'}</p>
            <p>Giới tính: {patient.gender || 'N/A'}</p>
            <p>Địa chỉ: {patient.address || 'N/A'}</p>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <p>Chẩn đoán: <b>Viêm họng cấp / Sốt siêu vi</b></p>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid black' }}>
                <th style={{ textAlign: 'left', padding: '10px 0' }}>Tên thuốc / Hàm lượng</th>
                <th style={{ textAlign: 'center' }}>Số lượng</th>
                <th style={{ textAlign: 'left', paddingLeft: '20px' }}>Cách dùng</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px dotted #ccc' }}>
                <td style={{ padding: '15px 0' }}>1. Paracetamol 500mg</td>
                <td style={{ textAlign: 'center' }}>10 viên</td>
                <td style={{ paddingLeft: '20px' }}>Uống 1 viên khi sốt trên 38.5 độ. Cách mỗi 6 tiếng.</td>
              </tr>
              <tr style={{ borderBottom: '1px dotted #ccc' }}>
                <td style={{ padding: '15px 0' }}>2. Vitamin C 500mg</td>
                <td style={{ textAlign: 'center' }}>07 viên</td>
                <td style={{ paddingLeft: '20px' }}>Uống 1 viên mỗi sáng sau khi ăn.</td>
              </tr>
              <tr style={{ borderBottom: '1px dotted #ccc' }}>
                <td style={{ padding: '15px 0' }}>3. Bromhexin 8mg</td>
                <td style={{ textAlign: 'center' }}>15 viên</td>
                <td style={{ paddingLeft: '20px' }}>Uống 1 viên x 3 lần/ngày.</td>
              </tr>
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px' }}>
            <div style={{ textAlign: 'center', width: '200px' }}>
              <p>Dặn dò:</p>
              <p style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>Tái khám sau 3 ngày nếu không giảm sốt.</p>
            </div>
            <div style={{ textAlign: 'center', width: '250px' }}>
              <p>Bác sĩ điều trị</p>
              <div style={{ height: '80px' }}></div>
              <p><b>{doctor}</b></p>
            </div>
          </div>
        </div>

        <style>
          {`
            @media print {
              body * { visibility: hidden; }
              #printable-prescription, #printable-prescription * { visibility: visible; }
              #printable-prescription { 
                position: absolute; 
                left: 0; 
                top: 0; 
                width: 100%; 
                padding: 0 !important;
                margin: 0 !important;
              }
              .btn, .modal-overlay, .sidebar, header { display: none !important; }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default PrescriptionModal;
