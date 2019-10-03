import { Schema, model } from 'mongoose';

const { Types: { ObjectId } } = Schema;

const Report = new Schema({
  id: {
    type: String,
    required: true,
  },
  trainer: {
    type: ObjectId,
    required: true,
    ref: 'Users',
  },
  session: {
    type: String,
    required: true,
    ref: 'Sessions',
  },
  images: [{
    type: String,
  }],
  numberOfMale: {
    type: Number,
    default: 0,
  },
  numberOfFemale: {
    type: Number,
    default: 0,
  },
  numberOfGMB: {
    type: Number,
    default: 0,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default model('Reports', Report);
