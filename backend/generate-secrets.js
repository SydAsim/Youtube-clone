import crypto from 'crypto';

console.log('\n🔐 Generate New Secrets for .env file\n');
console.log('Copy these to your .env file:\n');
console.log('─'.repeat(80));
console.log('\n# JWT Secrets');
console.log(`ACCESS_TOKEN_SECRET=${crypto.randomBytes(64).toString('hex')}`);
console.log(`REFRESH_TOKEN_SECRET=${crypto.randomBytes(64).toString('hex')}`);
console.log('\n─'.repeat(80));
console.log('\n⚠️  IMPORTANT:');
console.log('1. Also rotate your MongoDB password in MongoDB Atlas');
console.log('2. Regenerate Cloudinary API keys in your Cloudinary dashboard');
console.log('3. Never commit these secrets to git');
console.log('4. Update these in your production environment\n');
