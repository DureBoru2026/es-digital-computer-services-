import { db } from './db-store.js';

async function seed() {
  const users = await db.getUsers();
  const newUser = {
    id: 'user_admin',
    email: 'jemalfan030@gmail.com',
    username: 'Jemal Fano',
    passwordHash: 'Esb#2026',
    role: 'admin' as const
  };
  
  // overwrite or push
  const filtered = users.filter(u => u.username !== 'Jemal Fano');
  filtered.push(newUser);
  await db.saveUsers(filtered);
  console.log("User seeded successfully");
}

seed().catch(console.error);
