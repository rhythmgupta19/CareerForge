import mongoose from 'mongoose';

const cloudCreditSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  link: { type: String, required: true },
  unlockCondition: String,
  domainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain' }
}, { timestamps: true });

export default mongoose.model('CloudCredit', cloudCreditSchema);
