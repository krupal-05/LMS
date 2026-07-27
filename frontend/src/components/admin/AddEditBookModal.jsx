import React from 'react';
import Modal from '../ui/Modal';
import { FiUpload } from 'react-icons/fi';

const AddEditBookModal = ({
  isOpen,
  onClose,
  editingBook,
  bookFormData,
  setBookFormData,
  coverPreview,
  onFileChange,
  onSubmit,
  submitting
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingBook ? 'Edit Catalog Book' : 'Add New Book to Inventory'}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Book Title *</label>
          <input
            type="text"
            required
            value={bookFormData.title}
            onChange={(e) => setBookFormData({ ...bookFormData, title: e.target.value })}
            placeholder="e.g. Clean Architecture"
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Author Name *</label>
            <input
              type="text"
              required
              value={bookFormData.author}
              onChange={(e) => setBookFormData({ ...bookFormData, author: e.target.value })}
              placeholder="e.g. Robert C. Martin"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">ISBN Code *</label>
            <input
              type="text"
              required
              value={bookFormData.isbn}
              onChange={(e) => setBookFormData({ ...bookFormData, isbn: e.target.value })}
              placeholder="e.g. 978-0134494166"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 font-mono focus:border-cyan-500/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
            <select
              value={bookFormData.category}
              onChange={(e) => setBookFormData({ ...bookFormData, category: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500/50 capitalize"
            >
              <option value="computer science">computer science</option>
              <option value="fiction">fiction</option>
              <option value="engineering">engineering</option>
              <option value="science">science</option>
              <option value="general">general</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Copies Count *</label>
            <input
              type="number"
              min="1"
              required
              value={bookFormData.copies}
              onChange={(e) => setBookFormData({ ...bookFormData, copies: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
          <textarea
            rows="3"
            value={bookFormData.description}
            onChange={(e) => setBookFormData({ ...bookFormData, description: e.target.value })}
            placeholder="Brief book overview or synopsis..."
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500/50"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Book Cover Image {!editingBook && '*'}
          </label>
          <div className="flex items-center gap-3">
            {coverPreview && (
              <img src={coverPreview} alt="Cover Preview" className="w-12 h-16 object-cover rounded-lg border border-slate-800" />
            )}
            <label className="flex-1 border-2 border-dashed border-slate-800 hover:border-cyan-500/50 p-3 rounded-xl flex items-center justify-center gap-2 text-xs text-slate-400 cursor-pointer transition-colors">
              <FiUpload className="text-cyan-400" />
              <span>{coverPreview ? 'Change Cover File' : 'Upload Cover JPG/PNG'}</span>
              <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-xl bg-gradient-accent text-white font-semibold text-xs shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer"
          >
            {submitting ? 'Saving...' : editingBook ? 'Save Changes' : 'Create Book'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditBookModal;
