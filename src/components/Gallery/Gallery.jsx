import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const Gallery = () => {
  const [imageToDelete, setImageToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Обработчики удаления
  const handleDeleteClick = image => {
    if (!image || !image.public_id) {
      toast.error('Невозможно удалить изображение без идентификатора');
      return;
    }
    setImageToDelete(image);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (imageToDelete && imageToDelete.public_id) {
      try {
        await onDeleteImage(imageToDelete.public_id);
        setDeleteDialogOpen(false);
        setImageToDelete(null);
      } catch (error) {
        console.error('Ошибка при удалении изображения:', error);
        toast.error('Не удалось удалить изображение', {
          description:
            error.response?.data?.message ||
            error.message ||
            'Попробуйте еще раз',
        });
      }
    }
  };

  return <div>{/* Остальная часть компонента */}</div>;
};

export default Gallery;
