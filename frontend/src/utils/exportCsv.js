import toast from 'react-hot-toast';

export const exportInventoryCSV = (books = []) => {
  if (!books || books.length === 0) {
    toast.error('No inventory books to export');
    return;
  }
  const headers = ['Title', 'Author', 'Category', 'ISBN', 'Total Copies', 'Available Copies'];
  const rows = books.map((b) => [
    `"${b.title || ''}"`,
    `"${b.author || ''}"`,
    `"${b.category || ''}"`,
    `"${b.isbn || ''}"`,
    b.copies || 0,
    b.availableCopies || 0
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `lms_book_inventory_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast.success('Book Inventory CSV report exported!');
};

export const exportCirculationCSV = (issues = []) => {
  if (!issues || issues.length === 0) {
    toast.error('No circulation issue records to export');
    return;
  }
  const headers = ['Book Title', 'Student Email', 'Issue Date', 'Due Date', 'Status', 'Fine Amount', 'Fine Status'];
  const rows = issues.map((i) => [
    `"${i.book?.title || ''}"`,
    `"${i.user?.email || ''}"`,
    `"${i.issueDate ? new Date(i.issueDate).toLocaleDateString() : ''}"`,
    `"${i.dueDate ? new Date(i.dueDate).toLocaleDateString() : ''}"`,
    `"${i.status || ''}"`,
    i.fineAmount || 0,
    `"${i.fineStatus || ''}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `lms_circulation_report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast.success('Circulation Audit CSV report exported!');
};
