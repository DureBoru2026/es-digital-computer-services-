import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode } from 'lucide-react';

interface PaymentQRCodeProps {
  gateway: 'telebirr' | 'CBE Birr';
  accountNumber: string;
  amount: number;
  size?: number;
}

export default function PaymentQRCode({ gateway, accountNumber, amount, size = 120 }: PaymentQRCodeProps) {
  const qrValue = gateway === 'telebirr' 
    ? `telebirr://pay?merchant=${accountNumber}&amount=${amount}`
    : `cbebirr://pay?account=${accountNumber}&amount=${amount}`;

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-3 rounded-2xl shadow-md border border-slate-200 animate-in zoom-in duration-300">
        <QRCodeSVG 
          value={qrValue}
          size={size}
          level="H"
          includeMargin={true}
          className="rounded-lg"
        />
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <QrCode className="w-3 h-3" />
        <span>Scan with {gateway}</span>
      </div>
    </div>
  );
}
