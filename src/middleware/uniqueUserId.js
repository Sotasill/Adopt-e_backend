const generateUserId = () => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

const uniqueUserIdMiddleware = async function (next) {
  if (this.isNew) {
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      const userId = generateUserId();
      const existingUser = await this.constructor.findOne({ userId });

      if (!existingUser) {
        this.userId = userId;
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      next(new Error('Unable to generate unique userId'));
    }
  }
  next();
};

export default uniqueUserIdMiddleware;
