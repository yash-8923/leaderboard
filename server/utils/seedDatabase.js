import User from '../models/User.js';

const seedUsers = [
  { name: 'Rahul', totalPoints: 45 },
  { name: 'Kamal', totalPoints: 38 },
  { name: 'Sanak', totalPoints: 52 },
  { name: 'Priya', totalPoints: 41 },
  { name: 'Arjun', totalPoints: 33 },
  { name: 'Meera', totalPoints: 47 },
  { name: 'Vikram', totalPoints: 29 },
  { name: 'Ananya', totalPoints: 56 },
  { name: 'Rohan', totalPoints: 35 },
  { name: 'Kavya', totalPoints: 42 }
];

export const seedDatabase = async () => {
  try {
    // Check if users already exist
    const existingUsers = await User.countDocuments();
    
    if (existingUsers === 0) {
      console.log('🌱 Seeding database with initial users...');
      await User.insertMany(seedUsers);
      console.log('✅ Database seeded successfully with 10 users');
    } else {
      console.log(`📊 Database already contains ${existingUsers} users`);
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  }
};