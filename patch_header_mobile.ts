import fs from 'fs';

let content = fs.readFileSync('src/components/Header.tsx', 'utf8');

// Also update Admin Dashboard texts
content = content.replace("<span>Admin Dashboard</span>", "<span>{t('adminDashboard')}</span>");
content = content.replace(">Admin Dashboard<", ">{t('adminDashboard')}<");

content = content.replace("<span>Logout</span>", "<span>{t('logout')}</span>");

const langSwitcherMobile = `
              <div className="flex justify-center gap-4 py-4 border-t border-slate-100 mt-2">
                <button onClick={() => { setLang('en'); setMobileMenuOpen(false); }} className={\`px-4 py-2 rounded-full text-sm font-bold \${lang === 'en' ? 'bg-sky-50 text-[#0EA5E9]' : 'text-slate-500 hover:bg-slate-50'}\`}>English</button>
                <button onClick={() => { setLang('om'); setMobileMenuOpen(false); }} className={\`px-4 py-2 rounded-full text-sm font-bold \${lang === 'om' ? 'bg-sky-50 text-[#0EA5E9]' : 'text-slate-500 hover:bg-slate-50'}\`}>Afaan Oromoo</button>
              </div>
`;

content = content.replace('              {navItems.map((item) => (', langSwitcherMobile + '              {navItems.map((item) => (');

fs.writeFileSync('src/components/Header.tsx', content);
