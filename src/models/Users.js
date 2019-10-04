import { Schema, model } from 'mongoose';

const { Types: { ObjectId } } = Schema;

const User = new Schema({
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  partner: {
    type: ObjectId,
    ref: 'Users',
  },
  admin: {
    type: ObjectId,
    ref: 'Users',
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  sex: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: 'english',
  },
  country: {
    type: String,
  },
  state: {
    type: String,
  },
  community: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default model('Users', User);
