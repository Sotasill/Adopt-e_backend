import cloudinary from '../config/cloudinary.js';
import Animal from '../models/animal.js';
import { HttpError } from '../utils/HttpError.js';

const addToGallery = async (req, res) => {
  try {
    console.log('=== Start addToGallery ===');
    const { animalId } = req.params;
    const files = req.files;

    console.log('Request details:', {
      animalId,
      files: files?.map(f => ({
        originalname: f?.originalname,
        mimetype: f?.mimetype,
        size: f?.size,
      })),
      headers: req.headers,
      user: req.user
        ? {
            _id: req.user._id,
            role: req.user.role,
          }
        : null,
    });

    if (!files || files.length === 0) {
      throw new HttpError(400, 'Пожалуйста, загрузите хотя бы один файл');
    }

    // Получаем все поля животного для проверки
    const animal = await Animal.findById(animalId);
    console.log(
      'Found animal:',
      animal
        ? {
            _id: animal._id,
            userId: animal.userId,
            hasGallery: Array.isArray(animal.gallery),
            breeder: animal.breeder,
          }
        : null
    );

    if (!animal) {
      throw new HttpError(404, 'Животное не найдено');
    }

    // Если userId не установлен, но есть breeder, устанавливаем его как userId
    if (!animal.userId && animal.breeder) {
      console.log('Setting userId from breeder:', animal.breeder);
      animal.userId = animal.breeder;
      await animal.save();
    } else if (!animal.userId && req.user) {
      console.log('Setting userId from current user:', req.user._id);
      animal.userId = req.user._id;
      await animal.save();
    }

    if (!animal.userId) {
      throw new HttpError(500, 'Ошибка: у животного не указан владелец');
    }

    // Проверяем права доступа
    if (!req.user) {
      throw new HttpError(401, 'Необходима авторизация');
    }

    console.log('Checking permissions:', {
      animalUserId: animal.userId.toString(),
      requestUserId: req.user._id.toString(),
    });

    if (animal.userId.toString() !== req.user._id.toString()) {
      throw new HttpError(403, 'Нет прав для редактирования этого животного');
    }

    try {
      console.log('Starting Cloudinary upload for files:', files.length);
      const uploadPromises = files.map(file => {
        return new Promise((resolve, reject) => {
          console.log('Processing file:', {
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
          });

          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: `animals/${animalId}/gallery`,
              resource_type: 'auto',
              allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            },
            (error, result) => {
              if (error) {
                console.error('Cloudinary upload error:', error);
                reject(error);
              } else {
                console.log('Cloudinary upload success:', {
                  public_id: result.public_id,
                  url: result.secure_url,
                });
                resolve(result);
              }
            }
          );

          uploadStream.end(file.buffer);
        });
      });

      const uploadedImages = await Promise.all(uploadPromises);
      console.log('All images uploaded successfully:', uploadedImages.length);

      const galleryImages = uploadedImages.map(image => ({
        url: image.secure_url,
        public_id: image.public_id,
        type: 'gallery',
      }));

      // Инициализируем gallery, если его нет
      if (!animal.gallery) {
        animal.gallery = [];
      }

      animal.gallery.push(...galleryImages);
      await animal.save();
      console.log('Animal gallery updated');

      res.status(201).json({
        status: 'success',
        code: 201,
        data: {
          gallery: animal.gallery,
        },
      });
    } catch (error) {
      console.error('Upload error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      throw new HttpError(
        500,
        'Ошибка при загрузке изображений: ' + error.message
      );
    }
  } catch (error) {
    console.error('Controller error:', error);
    throw error;
  }
};

const getGallery = async (req, res) => {
  const { animalId } = req.params;

  const animal = await Animal.findById(animalId);
  if (!animal) {
    throw new HttpError(404, 'Животное не найдено');
  }

  const gallery = [...animal.gallery];
  if (animal.image?.url) {
    gallery.unshift({
      url: animal.image.url,
      public_id: animal.image.public_id,
      type: 'main',
    });
  }

  res.json({
    status: 'success',
    code: 200,
    data: {
      gallery,
    },
  });
};

const deleteFromGallery = async (req, res) => {
  const { animalId, imageId } = req.params;

  const animal = await Animal.findById(animalId);
  if (!animal) {
    throw new HttpError(404, 'Животное не найдено');
  }

  if (!req.user) {
    throw new HttpError(401, 'Необходима авторизация');
  }

  if (animal.userId.toString() !== req.user._id.toString()) {
    throw new HttpError(403, 'Нет прав для редактирования этого животного');
  }

  const imageToDelete = animal.gallery.find(img => img.public_id === imageId);
  if (!imageToDelete) {
    throw new HttpError(404, 'Изображение не найдено');
  }

  try {
    // Удаляем из Cloudinary
    const result = await cloudinary.uploader.destroy(imageId);
    console.log('Cloudinary delete result:', result);

    // Удаляем из базы данных
    animal.gallery = animal.gallery.filter(img => img.public_id !== imageId);
    await animal.save();

    res.json({
      status: 'success',
      code: 200,
      message: 'Изображение успешно удалено',
    });
  } catch (error) {
    console.error('Delete error:', error);
    throw new HttpError(
      500,
      'Ошибка при удалении изображения: ' + error.message
    );
  }
};

export { addToGallery, getGallery, deleteFromGallery };
