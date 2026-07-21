import fs from 'fs';

let content = fs.readFileSync('src/i18n.ts', 'utf8');

content = content.replace("sales: 'Sales',", "sales: 'Sales',\n    airtimeTitle: 'Mobile Airtime Top-Up',\n    airtimeDesc: 'Instant verification & delivery',\n    selectCarrier: 'Select Carrier',\n    amountEtb: 'Amount (ETB)',\n    phoneNumber: 'Phone Number',\n    refCode: 'Telebirr/CBE Birr Ref Code',\n    submitPayment: 'Submit Payment for Verification',\n    verifying: 'Verifying...',\n    airtimeSuccess: 'Airtime purchase submitted for verification. It will be delivered shortly.',\n    airtimeError: 'Failed to submit.',\n    fillAllFields: 'Please fill all fields.',\n    networkError: 'Network error occurred.',");

content = content.replace("sales: 'Gurgurtaa',", "sales: 'Gurgurtaa',\n    airtimeTitle: 'Kaardii Moobaayilaa Guutuu',\n    airtimeDesc: 'Mirkaneessaa fi dhiyeessa saffisaa',\n    selectCarrier: 'Tajaajila Filadhu',\n    amountEtb: 'Hanga (ETB)',\n    phoneNumber: 'Lakkoofsa Bilbilaa',\n    refCode: 'Koodii Mirkaneessaa (Telebirr/CBE)',\n    submitPayment: 'Kaffaltii Mirkaneessuuf Ergi',\n    verifying: 'Mirkaneessaa jira...',\n    airtimeSuccess: 'Bittaa kaardii mirkaneessuuf ergameera. Dhiyeenyatti isiniif dhiyaata.',\n    airtimeError: 'Erguun hin milkoofne.',\n    fillAllFields: 'Maaloo iddoowwan duwwaa hunda guutaa.',\n    networkError: 'Rakkoon neetwoorkii mudateera.',");

fs.writeFileSync('src/i18n.ts', content);
