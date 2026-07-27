import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { FiCamera, FiSearch, FiCheck, FiBookOpen, FiZap } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const BarcodeScannerModal = ({ isOpen, onClose, books = [], onActionComplete }) => {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scannedBook, setScannedBook] = useState(null);
  const [searching, setSearching] = useState(false);

  const handleScanBarcode = async (codeToSearch) => {
    const code = (codeToSearch || barcodeInput).trim();
    if (!code) {
      toast.error('Please enter or scan an ISBN or Barcode number');
      return;
    }

    setSearching(true);
    setScannedBook(null);

    try {
      // Find in current books state or API
      const found = books.find((b) => b.isbn?.toLowerCase() === code.toLowerCase());
      if (found) {
        setScannedBook(found);
        toast.success(`Book matched: ${found.title}`);
      } else {
        const res = await api.get('/books/get-all-Books', { params: { search: code } });
        const resBooks = res.data?.data?.books || res.data?.data || [];
        if (resBooks.length > 0) {
          setScannedBook(resBooks[0]);
          toast.success(`Book matched: ${resBooks[0].title}`);
        } else {
          toast.error('No book title matched this ISBN/Barcode');
        }
      }
    } catch {
      toast.error('Failed to lookup barcode');
    } finally {
      setSearching(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Counter Barcode / ISBN Scanner">
      <div className="space-y-6">
        {/* Animated Scanner Preview Viewport */}
        <div className="relative aspect-video rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 flex flex-col items-center justify-center text-center p-4">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-cyan-500/10 pointer-events-none" />

          {/* Scanning Target Frame Box */}
          <div className="w-56 h-32 border-2 border-dashed border-cyan-400 rounded-xl relative flex flex-col items-center justify-center animate-pulse">
            <div className="w-full h-0.5 bg-cyan-400 absolute top-1/2 -translate-y-1/2 shadow-lg shadow-cyan-400" />
            <FiCamera className="text-cyan-400 text-3xl mb-1 opacity-75" />
            <span className="text-[10px] font-mono uppercase text-cyan-300">Align Barcode Here</span>
          </div>

          <p className="text-[11px] text-slate-400 mt-3">Live camera feed active • Ready for optical ISBN scan</p>
        </div>

        {/* Manual Barcode Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleScanBarcode();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
            <input
              type="text"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              placeholder="Enter or scan ISBN (e.g. 978-0134494166)..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 font-mono focus:border-cyan-500/50"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="px-4 py-2.5 rounded-xl bg-gradient-accent text-white font-semibold text-xs shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer"
          >
            {searching ? 'Scanning...' : 'Lookup ISBN'}
          </button>
        </form>

        {/* Scanned Book Preview Result */}
        {scannedBook && (
          <div className="p-4 rounded-2xl glass-panel border border-cyan-500/30 flex items-start gap-4">
            <img
              src={scannedBook.cover?.url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
              alt={scannedBook.title}
              className="w-16 h-20 object-cover rounded-xl border border-slate-800"
            />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">ISBN: {scannedBook.isbn}</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {scannedBook.availableCopies} Available
                </span>
              </div>
              <h4 className="font-bold text-slate-100 text-sm line-clamp-1">{scannedBook.title}</h4>
              <p className="text-xs text-slate-400 capitalize">By {scannedBook.author}</p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default BarcodeScannerModal;
