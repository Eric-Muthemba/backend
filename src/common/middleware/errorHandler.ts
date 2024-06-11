import { ErrorRequestHandler, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

const unexpectedRequest: RequestHandler = (_req, res) => {
  res.sendStatus(StatusCodes.NOT_FOUND);
};

const addErrorToRequestLog: ErrorRequestHandler = (err, _req, res, next) => {
  res.locals.err = err;
  next(err);
};

const unauthorizedError: ErrorRequestHandler = (err, _req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
  } else {
    next(err);
  }
};

export default () => [unexpectedRequest, addErrorToRequestLog, unauthorizedError];
