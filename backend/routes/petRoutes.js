const express = require('express');
const router = express.Router();
const {
  createPet,
  getMyPets,
  deletePet,
  editPet,
  getPetById,
} = require('../controllers/petController');
const { authenticate } = require('../middlewares/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const Pet = require('../models/Pet');

// ✅ Public route to discover pets with full filtering support
router.get('/discover-pets', async (req, res) => {
  try {
    const { search = '', minPrice, maxPrice, vaccinated, type } = req.query;

    const regex = new RegExp(search, 'i'); // case-insensitive
    const query = {
      $or: [
        { name: regex },
        { breed: regex },
        { location: regex },
        { description: regex }
      ]
    };

    // ✅ Filter by pet type if selected
    if (type && type !== 'All') {
      query.type = type;
    }

    // ✅ Filter by vaccination status
    if (vaccinated !== undefined) {
      query.vaccinated = vaccinated === 'true';
    }

    // ✅ Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const pets = await Pet.find(query).sort({ createdAt: -1 });
    res.json(pets);
  } catch (err) {
    console.error('Error fetching pets:', err);
    res.status(500).json({ message: 'Failed to fetch pet listings' });
  }
});


// ✅ Public route for individual pet details
router.get('/details/:id', getPetById);

// ✅ Authenticated routes for managing pet listings
router.post('/add', authenticate, upload.array('images', 5), createPet);
router.get('/my-ads', authenticate, getMyPets);
router.put('/:id', authenticate, editPet);
router.delete('/:id', authenticate, deletePet);

module.exports = router;



// router.get('/:id', authenticate, async (req, res) => {
//   try {
//     const pet = await Pet.findById(req.params.id);
//     if (!pet) return res.status(404).json({ message: 'Pet not found' });
//     if (pet.owner.toString() !== req.user.userId)
//       return res.status(403).json({ message: 'Unauthorized' });

//     res.json(pet);
//   } catch {
//     res.status(500).json({ message: 'Failed to fetch pet' });
//   }
// });




