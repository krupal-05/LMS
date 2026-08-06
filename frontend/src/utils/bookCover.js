/**
 * Smart Book Cover Resolver Utility
 * Resolves uploaded image URL or deterministically maps book title/category
 * to a distinct, beautiful high-quality cover thumbnail.
 */

const CATEGORY_COVERS = {
  'computer science': [
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=600&auto=format&fit=crop'
  ],
  'fiction': [
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=600&auto=format&fit=crop'
  ],
  'engineering': [
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop'
  ],
  'science': [
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=600&auto=format&fit=crop'
  ],
  'general': [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop'
  ]
};

export const getBookCover = (book) => {
  if (!book) {
    return CATEGORY_COVERS.general[0];
  }

  // 1. Direct URL check (handles string URLs, cover.url, coverImage, etc.)
  if (typeof book.cover === 'string' && book.cover.trim() && book.cover.startsWith('http')) {
    return book.cover;
  }
  if (book.cover?.url && typeof book.cover.url === 'string' && book.cover.url.trim()) {
    return book.cover.url;
  }
  if (typeof book.coverImage === 'string' && book.coverImage.trim()) {
    return book.coverImage;
  }
  if (typeof book.image === 'string' && book.image.trim()) {
    return book.image;
  }

  // 2. Deterministic selection from category pool based on title string hash
  const catKey = (book.category || 'general').toLowerCase().trim();
  const pool = CATEGORY_COVERS[catKey] || CATEGORY_COVERS.general;

  const keyString = (book.title || '') + (book._id || '');
  let hash = 0;
  for (let i = 0; i < keyString.length; i++) {
    hash = keyString.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % pool.length;
  return pool[index];
};

export default getBookCover;
