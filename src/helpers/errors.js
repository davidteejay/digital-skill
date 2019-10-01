const data = null;
const error = true;

export const serverError = (res, err) => res.status(500).send({
  data,
  message: err || 'Internal Server Error',
  error,
});

export const incompleteDataError = (res, message = 'Incomplete Data') => res.status(442).send({
  data,
  message,
  error,
});

export const notFoundError = (res, message = 'Not Found') => res.status(404).send({
  data,
  message,
  error,
});

export const accessDenied = (res, message = 'You don\'t have access to this feature') => res.status(401).send({
  data,
  message,
  error,
});

export const inCorrectRouteError = (res, message = 'Incorrect Route') => res.status(404).send({
  data,
  message,
  error,
});

export const alreadyExistsError = (res, message = 'Already Exists') => res.status(401).send({
  data,
  message,
  error,
});
