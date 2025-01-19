import { User } from '../models/users.js';
import Animal from '../models/animal.js';
import { cloudinary } from '../utils/cloudinary.js';
import { HttpError } from '../utils/errorHandler.js';

const updateUserAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path } = req.file;

  const result = await cloudinary.v2.uploader.upload(path, {
    folder: 'avatars',
  });

  const user = await User.findById(_id);

  // Удаляем старый аватар из Cloudinary, если он существует
  if (user.avatar.public_id) {
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
  }

  user.avatar = {
    public_id: result.public_id,
    url: result.secure_url,
  };

  await user.save();

  res.json({
    avatar: user.avatar,
  });
};

const updateUserBackground = async (req, res) => {
  const { _id } = req.user;
  const { path } = req.file;

  const result = await cloudinary.v2.uploader.upload(path, {
    folder: 'backgrounds',
  });

  const user = await User.findById(_id);

  // Удаляем старый фон из Cloudinary, если он существует
  if (user.background.public_id) {
    await cloudinary.v2.uploader.destroy(user.background.public_id);
  }

  user.background = {
    public_id: result.public_id,
    url: result.secure_url,
  };

  await user.save();

  res.json({
    background: user.background,
  });
};

const updateAnimalImage = async (req, res) => {
  const { animalId } = req.params;
  const { path } = req.file;

  const result = await cloudinary.v2.uploader.upload(path, {
    folder: 'animal_pics',
  });

  const animal = await Animal.findById(animalId);
  if (!animal) {
    throw new HttpError(404, 'Animal not found');
  }

  // Удаляем старое изображение из Cloudinary, если оно существует
  if (animal.image.public_id) {
    await cloudinary.v2.uploader.destroy(animal.image.public_id);
  }

  animal.image = {
    public_id: result.public_id,
    url: result.secure_url,
  };

  await animal.save();

  res.json({
    image: animal.image,
  });
};

export { updateUserAvatar, updateUserBackground, updateAnimalImage };
