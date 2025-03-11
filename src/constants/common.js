// Роли пользователей
export const ROLES = {
  USER: 'user',
  BREEDER: 'breeder',
  SPECIALIST: 'specialist',
};

// Типы животных
export const ANIMAL_TYPES = {
  CAT: 'cat',
  DOG: 'dog',
};

// Пол животных
export const GENDERS = {
  MALE: 'male',
  FEMALE: 'female',
};

// Статусы оплаты
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

// Регулярные выражения для валидации
export const VALIDATION_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  USERNAME: /^[A-Z][a-zA-Z0-9_-]{2,29}$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
  COMPANY_NAME: /^[A-Z][a-zA-Z0-9\s-]{2,49}$/,
  CITY: /^[A-Z][a-zA-Z\s-]{1,49}$/,
  COUNTRY: /^[A-Z][a-zA-Z\s-]{1,49}$/,
  NO_PROFANITY:
    /^(?!.*(fuck|shit|ass|bitch|cunt|dick|pussy|cock|whore|slut)).*$/i,
};

// Значения по умолчанию
export const DEFAULTS = {
  AVATAR_URL: null,
  BACKGROUND_URL: null,
  NOTES: '',
};

// HTTP статусы
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// Сообщения об ошибках
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Неверные учетные данные',
  USER_NOT_FOUND: 'Пользователь не найден',
  ANIMAL_NOT_FOUND: 'Животное не найдено',
  DUPLICATE_EMAIL: 'Email уже используется',
  DUPLICATE_USERNAME: 'Имя пользователя уже занято',
  DUPLICATE_MICROCHIP: 'Животное с таким номером микрочипа уже существует',
};

export const SPECIALIST_TYPES = {
  VETERINARY: 'veterinary',
  PETSHOP: 'petshop',
  SERVICE: 'service',
};
