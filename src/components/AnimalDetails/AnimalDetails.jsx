// Функция удаления изображения из галереи
const handleDeleteFromGallery = async imageId => {
  try {
    if (!imageId) {
      toast.error('Невозможно удалить изображение без идентификатора');
      return;
    }

    const toastId = toast.loading('Удаление изображения...');
    await animalService.deleteFromGallery(id, imageId);

    // Получаем обновленные данные о животном
    const response = await animalService.getAnimalById(id);
    const updatedAnimal = response.data?.animal || response.animal || response;

    setAnimal(updatedAnimal);

    // Обновляем галерею
    const galleryImages = [];
    if (updatedAnimal.image?.url) {
      galleryImages.push({
        original: updatedAnimal.image.url,
        thumbnail: updatedAnimal.image.url,
        description: 'Аватар животного',
        public_id: updatedAnimal.image.public_id,
      });
    }

    if (updatedAnimal.gallery && updatedAnimal.gallery.length > 0) {
      const additionalImages = updatedAnimal.gallery.map(img => ({
        original: img.url,
        thumbnail: img.url,
        description: 'Изображение галереи',
        public_id: img.public_id,
      }));
      galleryImages.push(...additionalImages);
    }

    setImages(galleryImages);
    toast.success('Изображение успешно удалено', { id: toastId });
  } catch (err) {
    console.error('Error deleting image:', err);
    toast.error('Ошибка при удалении изображения', {
      description: err.response?.data?.message || 'Попробуйте еще раз',
    });
  }
};
