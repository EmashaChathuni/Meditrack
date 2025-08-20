import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  diagnosis: { type: String, required: true },
  medications: { type: String, required: true },
  doctor: { type: String, required: true },
  hospital: { type: String, required: true },
  followUpDate: { type: Date, required: false },
  notes: { type: String, required: false },
}, { timestamps: true });

export default mongoose.model('MedicalRecord', recordSchema);
