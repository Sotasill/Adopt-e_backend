import { HttpError } from '../utils/errorHandler.js';
import Animal from '../models/animal.js';
import { uploadImage, deleteImage } from '../services/upload.js';

const addAnimal = async (req, res) => {
  const { _id: breederId, role, specialization } = req.user;

  if (role !== 'breeder' && role !== 'user') {
    throw new HttpError(403, 'Only breeders and users can register animals');
  }

  let imageData = {};
  if (req.file) {
    imageData = await uploadImage(req.file);
  }

  const { litterRegistrationNumber, parentId, parentType } = req.body;

  // Проверка существования животного по номеру помёта
  if (litterRegistrationNumber) {
    const existingAnimal = await Animal.findOne({ litterRegistrationNumber });
    if (!existingAnimal) {
      throw new HttpError(
        404,
        'Animal with this litter registration number not found'
      );
    }
  }

  // Проверка и установка родителя
  let parentData = {};
  if (parentId && parentType) {
    const parent = await Animal.findById(parentId);
    if (!parent) {
      throw new HttpError(404, `${parentType} not found`);
    }
    if (parentType === 'mother') {
      parentData.mother = parentId;
      parentData.motherRegistered = true;
    } else if (parentType === 'father') {
      parentData.father = parentId;
      parentData.fatherRegistered = true;
    }
  }

  const animalData = {
    ...req.body,
    ...parentData,
    userId: req.user._id,
    breeder: role === 'breeder' ? breederId : null,
    image: imageData.url ? imageData : undefined,
    isRegisteredInSystem: true,
  };

  // Если пользователь не заводчик, используем тип из запроса
  if (role !== 'breeder') {
    animalData.type = req.body.type;
  }

  // Проверяем статус регистрации родителей
  if (!animalData.motherRegistered) {
    animalData.mother = null;
  }
  if (!animalData.fatherRegistered) {
    animalData.father = null;
  }

  const animal = await Animal.create(animalData);

  res.status(201).json({
    status: 'success',
    code: 201,
    data: {
      animal,
    },
  });
};

const getBreederAnimals = async (req, res) => {
  const { _id: breederId } = req.user;

  const animals = await Animal.find({ breeder: breederId })
    .populate('mother', 'name uniqueIdentifier')
    .populate('father', 'name uniqueIdentifier');

  res.json({
    status: 'success',
    code: 200,
    data: {
      animals,
    },
  });
};

const getAnimalById = async (req, res) => {
  const { animalId } = req.params;
  const { _id: breederId } = req.user;

  const animal = await Animal.findOne({ _id: animalId, breeder: breederId })
    .populate('mother', 'name uniqueIdentifier')
    .populate('father', 'name uniqueIdentifier');

  if (!animal) {
    throw new HttpError(404, 'Animal not found');
  }

  res.json({
    status: 'success',
    code: 200,
    data: {
      animal,
    },
  });
};

const updateAnimal = async (req, res) => {
  const { animalId } = req.params;
  const { _id: breederId } = req.user;

  const animal = await Animal.findOne({ _id: animalId, breeder: breederId });

  if (!animal) {
    throw new HttpError(404, 'Animal not found');
  }

  let imageData = {};
  if (req.file) {
    // Удаляем старое изображение, если оно не дефолтное
    if (animal.image?.publicId) {
      await deleteImage(animal.image.publicId);
    }
    imageData = await uploadImage(req.file);
  }

  const updatedAnimal = await Animal.findByIdAndUpdate(
    animalId,
    {
      ...req.body,
      ...(imageData.url && { image: imageData }),
    },
    { new: true }
  );

  res.json({
    status: 'success',
    code: 200,
    data: {
      animal: updatedAnimal,
    },
  });
};

const deleteAnimal = async (req, res) => {
  const { animalId } = req.params;
  const { _id: breederId } = req.user;

  const animal = await Animal.findOne({ _id: animalId, breeder: breederId });

  if (!animal) {
    throw new HttpError(404, 'Animal not found');
  }

  // Удаляем изображение из Cloudinary, если оно не дефолтное
  if (animal.image?.publicId) {
    await deleteImage(animal.image.publicId);
  }

  await Animal.findByIdAndDelete(animalId);

  res.status(200).json({
    status: 'success',
    code: 200,
    message: 'Animal deleted successfully',
  });
};

const checkAnimalName = async (req, res) => {
  const { _id: userId, role } = req.user;
  const { name } = req.body;

  if (!name) {
    throw new HttpError(400, 'Name is required');
  }

  let query = { name };

  // Для заводчика проверяем по его ID
  if (role === 'breeder') {
    query.breeder = userId;
  } else {
    // Для обычного пользователя проверяем по полю breeder: null
    query.breeder = null;
  }

  const existingAnimal = await Animal.findOne(query);

  res.json({
    status: 'success',
    code: 200,
    data: {
      exists: !!existingAnimal,
    },
  });
};

const getUserAnimals = async (req, res) => {
  const { _id: userId, role } = req.user;

  // Для заводчика ищем по breeder, для обычного пользователя по userId
  let query =
    role === 'breeder'
      ? { breeder: userId }
      : { userId: userId, breeder: null };

  const animals = await Animal.find(query);

  // Преобразуем данные в нужный формат
  const formattedAnimals = animals.map(animal => {
    const birthDate = new Date(animal.birthDate);
    const today = new Date();
    const age = Math.floor(
      (today - birthDate) / (1000 * 60 * 60 * 24 * 365.25)
    ); // возраст в годах

    return {
      id: animal._id,
      name: animal.name,
      species: animal.type === 'cat' ? 'Кошка' : 'Собака',
      breed: animal.breed,
      age: age,
      sex: animal.sex === 'male' ? 'Самец' : 'Самка',
      status: animal.isRegisteredInSystem ? 'Зарегистрирован' : 'В процессе',
      image: animal.image?.url,
    };
  });

  res.json({
    status: 'success',
    code: 200,
    data: {
      animals: formattedAnimals,
      total: formattedAnimals.length,
    },
  });
};

export {
  addAnimal,
  getBreederAnimals,
  getAnimalById,
  updateAnimal,
  deleteAnimal,
  checkAnimalName,
  getUserAnimals,
};
