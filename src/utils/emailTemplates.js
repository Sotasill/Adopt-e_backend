import fs from 'fs/promises';
import path from 'path';
import Handlebars from 'handlebars';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatesDir = path.join(__dirname, '..', 'templates', 'emails');

// Загружаем и регистрируем базовый шаблон
const baseTemplate = async () => {
  const baseContent = await fs.readFile(
    path.join(templatesDir, 'base.hbs'),
    'utf-8'
  );
  Handlebars.registerPartial('base', baseContent);
};

// Загружаем шаблон и компилируем его
const loadTemplate = async templateName => {
  await baseTemplate(); // Убедимся, что базовый шаблон загружен

  const templatePath = path.join(templatesDir, `${templateName}.hbs`);
  const templateContent = await fs.readFile(templatePath, 'utf-8');
  return Handlebars.compile(templateContent);
};

export const generateVerificationEmail = async (username, verificationLink) => {
  const template = await loadTemplate('verify-email');
  return template({
    username,
    verificationLink,
    year: new Date().getFullYear(),
  });
};

export const generateResetPasswordEmail = async (username, resetLink) => {
  const template = await loadTemplate('reset-password');
  return template({
    username,
    resetLink,
    year: new Date().getFullYear(),
  });
};
