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
    type: role === 'breeder' ? specialization : req.body.type,
    image: imageData.url ? imageData : undefined,
    isRegisteredInSystem: true,
  };

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
  const {
    page = 1,
    limit = 10,
    sortBy = 'registrationDate',
    sortOrder = 'desc',
    type,
    sex,
    breed,
    ageMin,
    ageMax,
    search,
  } = req.query;

  // Базовый запрос в зависимости от роли
  let query = role === 'breeder' ? { breeder: userId } : { userId: userId };

  // Добавляем фильтры
  if (type) {
    query.type = type;
  }
  if (sex) {
    query.sex = sex;
  }
  if (breed) {
    query.breed = { $regex: breed, $options: 'i' };
  }
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  // Фильтр по возрасту
  if (ageMin || ageMax) {
    const today = new Date();
    if (ageMin) {
      const maxBirthDate = new Date(
        today.setFullYear(today.getFullYear() - ageMin)
      );
      query.birthDate = { ...query.birthDate, $lte: maxBirthDate };
    }
    if (ageMax) {
      const minBirthDate = new Date(
        today.setFullYear(today.getFullYear() - ageMax)
      );
      query.birthDate = { ...query.birthDate, $gte: minBirthDate };
    }
  }

  // Получаем общее количество документов для пагинации
  const total = await Animal.countDocuments(query);

  // Проверяем допустимые поля для сортировки
  const allowedSortFields = ['name', 'birthDate', 'registrationDate'];
  const validSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : 'registrationDate';
  const validSortOrder = ['asc', 'desc'].includes(sortOrder)
    ? sortOrder
    : 'desc';

  // Настраиваем сортировку
  const sortOptions = {};
  sortOptions[validSortBy] = validSortOrder === 'desc' ? -1 : 1;

  // Получаем животных с пагинацией и сортировкой
  const animals = await Animal.find(query)
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  // Преобразуем данные в нужный формат
  const formattedAnimals = animals.map(animal => {
    const birthDate = new Date(animal.birthDate);
    const today = new Date();
    const diffTime = Math.abs(today - birthDate);
    const age = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));

    return {
      id: animal._id,
      uniqueIdentifier: animal.uniqueIdentifier,
      name: animal.name,
      species: animal.type === 'cat' ? 'Кошка' : 'Собака',
      breed: animal.breed,
      age: age,
      sex: animal.sex === 'male' ? 'Самец' : 'Самка',
      status: animal.isPaid ? 'Зарегистрирован' : 'В процессе',
      image:
        animal.image?.url ||
        (animal.type === 'cat'
          ? '/images/default-cat.jpg'
          : '/images/default-dog.jpg'),
      birthDate: animal.birthDate,
      registrationDate: animal.registrationDate,
      notes: animal.notes || '',
    };
  });

  res.json({
    status: 'success',
    code: 200,
    data: {
      animals: formattedAnimals,
      pagination: {
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
        limit: Number(limit),
      },
      sorting: {
        sortBy: validSortBy,
        sortOrder: validSortOrder,
        availableSortFields: allowedSortFields,
      },
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
