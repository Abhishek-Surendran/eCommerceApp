import mongoose from 'mongoose';

const heroImageSchema = mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    title: { type: String, required: true },
  },
  { timestamps: true }
);

const HeroImage = mongoose.model('HeroImage', heroImageSchema);
export default HeroImage;
