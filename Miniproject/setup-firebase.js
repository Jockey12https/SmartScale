#!/usr/bin/env node

/**
 * Firebase Setup Helper Script
 * This script helps you set up Firebase configuration for your project
 */

const fs = require('fs');
const path = require('path');

console.log('🔥 Firebase Setup Helper');
console.log('========================\n');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), 'env.example');

if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
  console.log('📝 Please update your Firebase configuration in the .env file\n');
} else {
  console.log('❌ .env file not found');
  
  if (fs.existsSync(envExamplePath)) {
    console.log('📋 Copying env.example to .env...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created from template');
  } else {
    console.log('📝 Creating .env file...');
    const envContent = `# Firebase Configuration
# Replace these values with your actual Firebase project configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
`;
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created');
  }
}

console.log('\n📖 Next Steps:');
console.log('1. Go to https://console.firebase.google.com/');
console.log('2. Create a new project or select an existing one');
console.log('3. Enable Realtime Database');
console.log('4. Go to Project Settings > General > Your apps');
console.log('5. Add a web app and copy the configuration');
console.log('6. Update the values in your .env file');
console.log('7. Run "npm run dev" to test the connection');
console.log('\n📚 For detailed instructions, see FIREBASE_SETUP.md');
console.log('\n🧪 Test your connection using the Firebase Test component in the app!');
