const mongoose = require('mongoose');
const Expert = require('./models/Expert');
const Booking = require('./models/Booking');

const getNext7Days = () => {
  const dates = [];
  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split('T')[0]); // YYYY-MM-DD
  }
  return dates;
};

const dates = getNext7Days();
const defaultSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

const expertsData = [
  {
    name: 'Dr. Sarah Jenkins',
    category: 'Software Engineering',
    yearsOfExperience: 12,
    rating: 4.9,
    imageUrl: 'https://i.pravatar.cc/150?img=1',
    about: 'Ex-Google staff engineer specializing in scalable systems and cloud architecture.',
    availableSlots: dates.map(date => ({ date, slots: [...defaultSlots] }))
  },
  {
    name: 'Michael Chen',
    category: 'Product Management',
    yearsOfExperience: 8,
    rating: 4.8,
    imageUrl: 'https://i.pravatar.cc/150?img=11',
    about: 'Product leader who has launched multiple successful B2B SaaS products.',
    availableSlots: dates.map(date => ({ date, slots: [...defaultSlots] }))
  },
  {
    name: 'Emily Davis',
    category: 'UX/UI Design',
    yearsOfExperience: 10,
    rating: 5.0,
    imageUrl: 'https://i.pravatar.cc/150?img=5',
    about: 'Award-winning designer focusing on accessible and modern web experiences.',
    availableSlots: dates.map(date => ({ date, slots: [...defaultSlots] }))
  },
  {
    name: 'James Wilson',
    category: 'Career Coaching',
    yearsOfExperience: 15,
    rating: 4.7,
    imageUrl: 'https://i.pravatar.cc/150?img=8',
    about: 'Helped over 500 professionals transition into the tech industry.',
    availableSlots: dates.map(date => ({ date, slots: [...defaultSlots] }))
  },
];

const seedDataIfNeeded = async () => {
  try {
    const count = await Expert.countDocuments();
    if (count === 0) {
      console.log('No experts found in DB. Seeding data...');
      await Expert.insertMany(expertsData);
      console.log('Sample experts seeded successfully.');
    }
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
  }
};

module.exports = seedDataIfNeeded;
