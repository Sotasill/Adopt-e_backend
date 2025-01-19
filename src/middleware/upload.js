import multer from 'multer';
import { HttpError } from '../utils/HttpError.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  console.log('Processing file:', file); // Для отладки

  if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
    return cb(
      new HttpError(
        400,
        'Неподдерживаемый формат файла. Разрешены только JPEG, PNG и WebP'
      ),
      false
    );
  }

  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/webp'
  ) {
    cb(null, true);
  } else {
    cb(
      new HttpError(
        400,
        'Неподдерживаемый формат файла. Разрешены только JPEG, PNG и WebP'
      ),
      false
    );
  }
};

const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB
  files: 10,
};

// Создаем middleware для загрузки файлов
const uploadMiddleware = (req, res, next) => {
  const upload = multer({
    storage,
    fileFilter,
    limits,
  }).array('images', 10);

  console.log('Request headers:', req.headers); // Для отладки
  console.log('Request body:', req.body); // Для отладки

  upload(req, res, err => {
    console.log('Multer callback:', {
      files: req.files,
      error: err,
      contentType: req.headers['content-type'],
    }); // Для отладки

    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new HttpError(400, 'Размер файла превышает 5MB'));
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return next(new HttpError(400, 'Максимальное количество файлов - 10'));
      }
      console.error('Multer error:', err);
      return next(
        new HttpError(400, `Ошибка при загрузке файлов: ${err.message}`)
      );
    } else if (err) {
      console.error('Upload error:', err);
      return next(err);
    }

    if (!req.files || req.files.length === 0) {
      console.log('No files were uploaded');
      return next(
        new HttpError(
          400,
          'Файлы не были загружены. Убедитесь, что вы отправляете файлы с полем "images"'
        )
      );
    }

    next();
  });
};

export { uploadMiddleware as upload };
