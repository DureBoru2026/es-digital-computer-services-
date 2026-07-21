import fs from 'fs';

let content = fs.readFileSync('src/components/Footer.tsx', 'utf8');

const target = `<p>© {new Date().getFullYear()} ES Digital Computer Service Center (ES Digital CSC). All Rights Reserved.</p>`;
const replacement = `<p>© {new Date().getFullYear()} ES Digital Computer Service Center (ES Digital CSC). All Rights Reserved. | <a href="/deployment-guide.txt" download="deployment-guide.txt" className="text-sky-400 hover:text-sky-300 underline ml-2">Download Deployment Guide</a></p>`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/components/Footer.tsx', content);
} else {
  console.log("Target string not found in Footer.tsx");
}
