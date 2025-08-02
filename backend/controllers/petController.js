const Pet = require('../models/Pet');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');

// ✅ NEW: Get Pet Details with populated owner
exports.getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate({
      path: 'owner',
      select: 'name phone location createdAt',
    });

    if (!pet) return res.status(404).json({ message: 'Pet not found' });

    res.json(pet);
  } catch (err) {
    console.error('Error fetching pet details:', err);
    res.status(500).json({ message: 'Failed to fetch pet details' });
  }
};

exports.createPet = async (req, res) => {
  try {
    const { name, breed,type, age, gender, description, vaccinated, price, location } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    if (age <= 0 || price <= 0) {
      return res.status(400).json({ message: 'Age and price must be greater than zero.' });
    }

    const imageUrls = [];
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'petfolio',
      });
      imageUrls.push(result.secure_url);
      fs.unlinkSync(file.path);
    }

    const newPet = new Pet({
      name,
      breed,
      type,
      age,
      gender,
      description,
      vaccinated,
      price,
      location,
      images: imageUrls,
      owner: req.user.userId,
    });

    await newPet.save();
    res.status(201).json({ message: 'Pet listing created successfully', pet: newPet });
  } catch (error) {
    console.error('Error creating pet listing:', error);
    res.status(500).json({ message: 'Server error while creating pet listing' });
  }
};

exports.getMyPets = async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user.userId }).sort({ createdAt: -1 });
    res.json(pets);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your ads.' });
  }
};

exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    if (pet.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized: You can only delete your own ads' });
    }

    await Pet.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pet listing deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Failed to delete pet listing' });
  }
};

exports.editPet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    if (pet.owner.toString() !== req.user.userId)
      return res.status(403).json({ message: 'Unauthorized to edit this ad' });

    const updated = await Pet.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          breed: req.body.breed,
          age: req.body.age,
          gender: req.body.gender,
          description: req.body.description,
          vaccinated: req.body.vaccinated,
          price: req.body.price,
          location: req.body.location,
          type: req.body.type,
        },
      },
      { new: true }
    );

    res.json({ message: 'Pet listing updated successfully', pet: updated });
  } catch (err) {
    console.error('Edit error:', err);
    res.status(500).json({ message: 'Failed to update pet listing' });
  }
};
