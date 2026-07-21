import fs from 'fs';

let content = fs.readFileSync('src/i18n.ts', 'utf8');

// Insert english translations for footer
content = content.replace("allRightsReserved: 'All rights reserved.',", 
`allRightsReserved: 'All rights reserved.',
    footerAbout: 'We empower Kore Town residents with expert computer maintenance, professional printing & publishing work, basic IT literacy courses, and high-quality electronics sales.',
    locationTitle: 'Our Location & Contact',
    quickNavTitle: 'Quick Navigation',
    staffLogin: 'Staff Login',
    newsletterTitle: 'Newsletter Sign-Up',
    newsletterDesc: 'Subscribe to get notified about fresh product drops, premium genuine leather accessory sales, and computer tips.',
    subscribeThanks: 'Thank you! Subscribed successfully.',
    yourEmail: 'Your email address',
    footerLocTag: 'Digitalizing Kore Town, West Arsi',
    footerPayTag: 'Ethiopian Payment Gateways Integrated',`);

// Insert oromo translations for footer
content = content.replace("allRightsReserved: 'Mirgi hunduu seeraan eegamaadha.',", 
`allRightsReserved: 'Mirgi hunduu seeraan eegamaadha.',
    footerAbout: 'Hawaasa magaalaa Qoree tajaajila suphaa kompiitaraa ogummaa qabu, hojii maxxansaa fi qopheessuu ogeessaa, barnoota bu\\'uuraa IT, fi meeshaalee elektirooniksii qulqullina qabuun ni dandeessisna.',
    locationTitle: 'Teessoo fi Quunnamtii',
    quickNavTitle: 'Daandiiwwan Saffisaa',
    staffLogin: 'Seensa Hojjetaa',
    newsletterTitle: 'Beeksisa Haaraaf Galmaa\\'i',
    newsletterDesc: 'Oomishaalee haaraa, gurgurtaa meeshaalee gogaa dhugaa fi gorsa kompiitaraa argachuuf galmaa\\'i.',
    subscribeThanks: 'Galatoomaa! Sirriitti galmooftaniittu.',
    yourEmail: 'Teessoo Imeeylii keessan',
    footerLocTag: 'Magaalaa Qoree Dijitaala Taasiisuu, Arsii Lixaa',
    footerPayTag: 'Kaffaltii Toora Interneetaa Itoophiyaa Walitti Hidhaman',`);

fs.writeFileSync('src/i18n.ts', content);
