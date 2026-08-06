import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { FiBookOpen, FiChevronLeft, FiChevronRight, FiZoomIn, FiZoomOut, FiMaximize, FiBookmark } from 'react-icons/fi';

const PdfReaderModal = ({ isOpen, onClose, book }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const totalPages = 42;

  if (!book) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Digital eBook Preview — ${book.title}`} maxWidth="max-w-4xl">
      <div className="space-y-4">
        {/* Toolbar Header */}
        <div className="p-3 rounded-2xl glass-panel border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200 capitalize">{book.title}</span>
            <span className="text-[10px] font-mono text-slate-400">({book.category || 'eBook'})</span>
          </div>

          {/* Zoom & Page Navigation */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setZoom((z) => Math.max(70, z - 10))}
                className="p-1 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
                title="Zoom Out"
              >
                <FiZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono text-cyan-400 px-1 font-bold">{zoom}%</span>
              <button
                onClick={() => setZoom((z) => Math.min(150, z + 10))}
                className="p-1 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
                title="Zoom In"
              >
                <FiZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 disabled:opacity-40 cursor-pointer"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-slate-300">
                Page <span className="font-bold text-cyan-400">{currentPage}</span> / {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 disabled:opacity-40 cursor-pointer"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Reader Document Viewport */}
        <div
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          className="min-h-[420px] max-h-[520px] overflow-y-auto p-8 rounded-2xl glass-panel border border-slate-800 text-slate-300 font-serif leading-relaxed text-sm space-y-4 shadow-inner"
        >
          <div className="text-center pb-4 border-b border-slate-800/80">
            <h2 className="text-xl font-bold font-sans text-slate-100">{book.title}</h2>
            <p className="text-xs font-sans text-slate-400 mt-1 capitalize">Written by {book.author}</p>
            <span className="text-[10px] font-mono text-cyan-400 mt-2 inline-block uppercase">
              CHAPTER {currentPage}: ARCHITECTURAL FOUNDATIONS & PATTERNS
            </span>
          </div>

          <p className="indent-8">
            Software architecture is the art of structuring complex codebases so that change remains manageable over the entire lifecycle of an enterprise system. When building scalable software systems, design patterns provide tested blueprints for solving recurring architectural challenges.
          </p>

          <p className="indent-8">
            In modern web applications, separating data persistence, domain logic, and presentation interfaces enforces high cohesion and low coupling. As institutional requirements grow, adopting clean architecture principles ensures that core business logic remains independent of external frameworks, databases, and UI libraries.
          </p>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-sans space-y-1">
            <h5 className="font-bold text-cyan-400">Key Chapter Takeaways:</h5>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Decoupled domain entities from database schemas</li>
              <li>Immutability in concurrent state transformations</li>
              <li>Unit testability across isolated application layers</li>
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PdfReaderModal;
