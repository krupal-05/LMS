import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddBook = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/admin/dashboard', { replace: true });
  }, [navigate]);

  return null;
};

export default AddBook;
