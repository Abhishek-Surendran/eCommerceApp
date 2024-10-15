import HeroImage from '../models/heroImageModel.js';
import cloudinary from '../config/cloudinary.js';


export const updateHeroImage = async (req, res) => {
  try {
    const { imageUrl, title } = req.body;

    const heroImage = await HeroImage.findOne();

    if (heroImage) {
      heroImage.imageUrl = imageUrl || heroImage.imageUrl;
      heroImage.title = title || heroImage.title;
      await heroImage.save();
      res.json(heroImage);
    } else {
      const newHeroImage = new HeroImage({
        imageUrl,
        title,
      });
      await newHeroImage.save();
      res.status(201).json(newHeroImage);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


export const getHeroImage = async (req, res) => {
  try {
    const heroImage = await HeroImage.findOne();

    if (heroImage) {
      res.json(heroImage);
    } else {
      res.status(404).json({ message: 'Hero image not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const deleteHeroImage = async (req, res) => {
  try {
    const heroImage = await HeroImage.findById(req.params.id);
    if (heroImage) {
      await heroImage.remove();
      res.json({ message: 'Hero image removed' });
    } else {
      res.status(404).json({ message: 'Hero image not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
