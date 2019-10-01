/* eslint-disable consistent-return */
/* eslint-disable no-loop-func */
import { serverError } from './errors';

const generateID = async (res, model) => {
  try {
    let exists = true;

    while (exists) {
      const id = (Math.random() * 1000000).toPrecision(6);
      model
        .findOne({ id, isDeleted: false })
        .then((data) => {
          if (data === null) {
            exists = false;
            return id;
          }
        })
        .catch((err) => {
          exists = false;
          return serverError(res, err.message);
        });

      return id;
    }
  } catch (err) {
    return serverError(res, err.message);
  }
};

export default generateID;
