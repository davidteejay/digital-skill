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
  language: {
    type: String,
    default: 'english',
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
  },
  expectedNumber: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    type: Object,
    required: true,
  },
  audienceSelection: {
    type: String,
    required: true,
  },
  audienceDescription: {
    type: String,
    required: true,
  },
  audienceExpertLevel: {
    type: String,
    required: true,
  },
  natureOfTraining: {
    type: String,
    required: true,
  },
  photoWorthy: {
    type: Boolean,
    default: false,
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
