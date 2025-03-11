export const generateUserId = () => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

export const generateSpecialistId = () => {
  const prefix = 'SP';
  const number = Math.floor(1000000 + Math.random() * 9000000).toString();
  return `${prefix}${number}`;
};
