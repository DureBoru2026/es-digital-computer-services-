import fs from 'fs';
let content = fs.readFileSync('src/components/MobileAirtimePurchase.tsx', 'utf8');
content = content.replace("purpose: `{t('airtimeTitle')} (${carrier", "purpose: `${t('airtimeTitle')} (${carrier");
content = content.replace("<h3 className=\"font-display font-bold text-slate-900\">{t('airtimeTitle')}</h3>", "<h3 className=\"font-display font-bold text-slate-900\">{t('airtimeTitle')}</h3>"); // Actually it was already translated correctly in jsx
fs.writeFileSync('src/components/MobileAirtimePurchase.tsx', content);
