import fs from 'fs';

let content = fs.readFileSync('src/components/MobileAirtimePurchase.tsx', 'utf8');

content = content.replace("'Please fill all fields.'", "t('fillAllFields')");
content = content.replace("'Airtime purchase submitted for verification. It will be delivered shortly.'", "t('airtimeSuccess')");
content = content.replace("res.error || 'Failed to submit.'", "res.error || t('airtimeError')");
content = content.replace("'Network error occurred.'", "t('networkError')");

content = content.replace("Mobile Airtime Top-Up", "{t('airtimeTitle')}");
content = content.replace("Instant verification & delivery", "{t('airtimeDesc')}");
content = content.replace("Select Carrier", "{t('selectCarrier')}");
content = content.replace("Amount (ETB)", "{t('amountEtb')}");
content = content.replace("Phone Number", "{t('phoneNumber')}");
content = content.replace("Telebirr Ref Code", "{t('refCode')}");
content = content.replace("Submit Payment for Verification", "{t('submitPayment')}");
content = content.replace("'Verifying...'", "t('verifying')");

fs.writeFileSync('src/components/MobileAirtimePurchase.tsx', content);
