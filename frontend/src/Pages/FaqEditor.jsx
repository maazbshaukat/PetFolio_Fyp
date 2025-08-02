import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const FaqEditor = () => {
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    const res = await axios.get('http://localhost:5000/api/faqs');
    setFaqs(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/faqs/${editingId}`, { question, answer }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('FAQ updated');
      } else {
        await axios.post('http://localhost:5000/api/faqs', { question, answer }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('FAQ added');
      }
      setQuestion('');
      setAnswer('');
      setEditingId(null);
      fetchFaqs();
    } catch (err) {
      toast.error('Error saving FAQ');
    }
  };

  const handleEdit = (faq) => {
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setEditingId(faq._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/faqs/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success('FAQ deleted');
    fetchFaqs();
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📝 Manage FAQs</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          placeholder="Question"
          className="w-full border p-2 mb-2"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <textarea
          placeholder="Answer"
          className="w-full border p-2 mb-2"
          rows="3"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? 'Update FAQ' : 'Add FAQ'}
        </button>
        {editingId && (
          <button onClick={() => { setEditingId(null); setQuestion(''); setAnswer(''); }} className="ml-2 text-gray-500">
            Cancel
          </button>
        )}
      </form>

      <div className="space-y-4">
        {faqs.map(faq => (
          <div key={faq._id} className="border p-4 rounded shadow">
            <h3 className="font-semibold">{faq.question}</h3>
            <p className="text-gray-700">{faq.answer}</p>
            <div className="mt-2">
              <button onClick={() => handleEdit(faq)} className="text-blue-600 mr-2">Edit</button>
              <button onClick={() => handleDelete(faq._id)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqEditor;
