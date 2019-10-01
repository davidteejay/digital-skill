import { Schema, model } from 'mongoose';

const { Types: { ObjectId } } = Schema;

const Session = new Schema({
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  materials: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  trainerName: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  community: {
    type: String,
    required: true,
  },
  expectedNumber: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: 'awaiting approval',
  },
  approvals: [{
    type: ObjectId,
    ref: 'Users',
  }],
  createdBy: {
    type: ObjectId,
    ref: 'Users',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default model('Sessions', Session);
