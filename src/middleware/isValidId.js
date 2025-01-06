import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

const isValidId = paramName => (req, res, next) => {
  const id = req.params[paramName];
  if (!isValidObjectId(id)) {
    return next(createHttpError(400, `${id} is not a valid id`));
  }
  next();
};

export { isValidId };
