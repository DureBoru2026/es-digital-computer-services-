import fs from 'fs';

let content = fs.readFileSync('src/components/Header.tsx', 'utf8');

content = content.replace("import { ActiveTab, AuthState } from '../types';", 
  "import { ActiveTab, AuthState } from '../types';\nimport { useLanguage } from '../LanguageContext';");

content = content.replace("export default function Header({ activeTab, setActiveTab, authState, handleLogout }: HeaderProps) {",
  "export default function Header({ activeTab, setActiveTab, authState, handleLogout }: HeaderProps) {\n  const { t, lang, setLang } = useLanguage();");

content = content.replace("label: 'Home'", "label: t('home')");
content = content.replace("label: 'About Us'", "label: t('aboutUs')");
content = content.replace("label: 'Services'", "label: t('services')");
content = content.replace("label: 'Contact Us'", "label: t('contact')");
// Just keep news as 'Announcements' since I didn't add it in translations, or add it.

content = content.replace('className="hidden md:flex items-center gap-8"', 
  `className="hidden md:flex items-center gap-8"`);

// Add Language switcher
const langSwitcher = `
        <div className="hidden md:flex items-center gap-2 border-l pl-6 ml-2 border-slate-200">
          <button onClick={() => setLang('en')} className={\`text-sm font-bold \${lang === 'en' ? 'text-[#0EA5E9]' : 'text-slate-400'}\`}>EN</button>
          <span className="text-slate-300">|</span>
          <button onClick={() => setLang('om')} className={\`text-sm font-bold \${lang === 'om' ? 'text-[#0EA5E9]' : 'text-slate-400'}\`}>OM</button>
        </div>
`;

content = content.replace('          {/* Desktop Nav */}\n          <nav className="hidden md:flex items-center gap-8">',
  `          {/* Desktop Nav */}\n          <nav className="hidden md:flex items-center gap-8">`);
  
content = content.replace('            {authState.isAuthenticated ? (', 
  langSwitcher + '\n            {authState.isAuthenticated ? (');

fs.writeFileSync('src/components/Header.tsx', content);
