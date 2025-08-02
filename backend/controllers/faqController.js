const FAQ = require('../models/Faq');

// Get all FAQs
exports.getAllFaqs = async (req, res) => {
  const faqs = await FAQ.find().sort({ createdAt: -1 });
  res.json(faqs);
};

// Create FAQ
exports.createFaq = async (req, res) => {
  const { question, answer } = req.body;
  const faq = await FAQ.create({ question, answer });
  res.status(201).json(faq);
};

// Update FAQ
exports.updateFaq = async (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;
  const updated = await FAQ.findByIdAndUpdate(id, { question, answer }, { new: true });
  res.json(updated);
};

// Delete FAQ
exports.deleteFaq = async (req, res) => {
  const { id } = req.params;
  await FAQ.findByIdAndDelete(id);
  res.json({ message: 'FAQ deleted' });
};
