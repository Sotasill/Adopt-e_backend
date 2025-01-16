import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Adopt-e API',
      version: '1.0.0',
      description: 'API для платформы по усыновлению домашних животных Adopt-e',
      contact: {
        name: 'Команда Adopt-e',
        email: 'support@adopt-e.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Локальный сервер разработки',
      },
      {
        url: 'https://api.adopt-e.com/api',
        description: 'Продакшн сервер',
      },
    ],
    tags: [
      {
        name: 'Аутентификация',
        description: 'Операции аутентификации и управления пользователями',
      },
      {
        name: 'Животные',
        description: 'Операции с животными (добавление, поиск, обновление)',
      },
      {
        name: 'Профиль',
        description: 'Операции с профилем пользователя',
      },
      {
        name: 'Платежи',
        description: 'Операции с платежами и транзакциями',
      },
      {
        name: 'Онлайн статус',
        description: 'Управление онлайн статусом пользователей',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Введите JWT токен',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['id', 'email', 'firstName', 'lastName', 'role'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Уникальный идентификатор пользователя',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email пользователя',
              example: 'user@example.com',
            },
            firstName: {
              type: 'string',
              description: 'Имя пользователя',
              example: 'Иван',
            },
            lastName: {
              type: 'string',
              description: 'Фамилия пользователя',
              example: 'Петров',
            },
            role: {
              type: 'string',
              enum: ['user', 'breeder'],
              description: 'Роль пользователя',
              example: 'user',
            },
            phone: {
              type: 'string',
              description: 'Номер телефона (обязателен для заводчиков)',
              example: '+7 (999) 123-45-67',
            },
            isEmailVerified: {
              type: 'boolean',
              description: 'Подтвержден ли email пользователя',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата и время создания аккаунта',
              example: '2024-01-16T12:00:00Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата и время последнего обновления',
              example: '2024-01-16T12:00:00Z',
            },
          },
        },
        Animal: {
          type: 'object',
          required: [
            'id',
            'name',
            'type',
            'breed',
            'age',
            'price',
            'breederId',
          ],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Уникальный идентификатор животного',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            name: {
              type: 'string',
              description: 'Имя животного',
              example: 'Барсик',
            },
            type: {
              type: 'string',
              description: 'Тип животного',
              example: 'кошка',
            },
            breed: {
              type: 'string',
              description: 'Порода животного',
              example: 'Сиамская',
            },
            age: {
              type: 'number',
              description: 'Возраст животного в годах',
              example: 2,
            },
            price: {
              type: 'number',
              description: 'Цена животного',
              example: 15000,
            },
            description: {
              type: 'string',
              description: 'Описание животного',
              example: 'Ласковый и игривый котенок',
            },
            imageUrl: {
              type: 'string',
              format: 'uri',
              description: 'URL фотографии животного',
              example: 'https://example.com/images/cat.jpg',
            },
            breederId: {
              type: 'string',
              format: 'uuid',
              description: 'ID заводчика',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            status: {
              type: 'string',
              enum: ['available', 'reserved', 'sold'],
              description: 'Статус животного',
              example: 'available',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата и время создания карточки',
              example: '2024-01-16T12:00:00Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата и время последнего обновления',
              example: '2024-01-16T12:00:00Z',
            },
          },
        },
        LoginCredentials: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email пользователя',
              example: 'user@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Пароль пользователя',
              example: 'password123',
            },
          },
        },
        TokenResponse: {
          type: 'object',
          required: ['accessToken', 'refreshToken'],
          properties: {
            accessToken: {
              type: 'string',
              description: 'JWT токен для доступа к API',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            refreshToken: {
              type: 'string',
              description: 'Токен для обновления access token',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            expiresIn: {
              type: 'integer',
              description: 'Время жизни access token в секундах',
              example: 3600,
            },
          },
        },
        Error: {
          type: 'object',
          required: ['code', 'message'],
          properties: {
            code: {
              type: 'integer',
              description: 'HTTP код ошибки',
              example: 400,
            },
            message: {
              type: 'string',
              description: 'Сообщение об ошибке',
              example: 'Произошла ошибка',
            },
            details: {
              type: 'object',
              description: 'Дополнительные детали ошибки',
              example: {
                reason: 'Дополнительная информация об ошибке',
              },
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Доступ запрещен. Необходима аутентификация',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        NotFoundError: {
          description: 'Запрашиваемый ресурс не найден',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        ValidationError: {
          description: 'Ошибка валидации данных',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        ConflictError: {
          description: 'Конфликт данных',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './swagger/**/*.yaml'],
  swaggerOptions: {
    persistAuthorization: true,
  },
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
