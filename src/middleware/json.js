import express from 'express';

const jsonMiddleware = (req, res, next) => {
  if (req.method === 'DELETE') {
    return next();
  }

  express.json()(req, res, next);
};

export { jsonMiddleware };
