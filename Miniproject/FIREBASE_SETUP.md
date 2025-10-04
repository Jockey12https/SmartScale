# Firebase Setup Guide for Smart Scale

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: "smart-scale-system"
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Set up Realtime Database

1. In Firebase Console, go to "Realtime Database"
2. Click "Create Database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

## 3. Get Firebase Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select Web app (</> icon)
4. Register your app with a nickname
5. Copy the Firebase configuration object

## 4. Environment Variables

Create a `.env` file in your project root with the following variables:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Replace the values with your actual Firebase configuration.

## 5. Database Structure

The Firebase Realtime Database will have the following structure:

```json
{
  "scale": {
    "weight": 0,
    "product": null,
    "isActive": false,
    "timestamp": 1234567890
  },
  "products": {
    "product1": {
      "id": "product1",
      "name": "Red Apple",
      "image": "https://...",
      "pricePerKg": 3.99,
      "category": "fruit",
      "confidence": 0.95
    }
  },
  "sessions": {
    "session1": {
      "id": "session1",
      "startTime": 1234567890,
      "endTime": 1234567890,
      "items": [...],
      "total": 15.99,
      "status": "completed"
    }
  }
}
```

## 6. Security Rules (Optional)

For production, update your database rules in Firebase Console:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

## 7. Testing the Integration

1. Start your development server: `npm run dev`
2. The app will automatically:
   - Connect to Firebase
   - Seed the database with product data
   - Listen for real-time scale data
3. You can manually update the database in Firebase Console to simulate scale readings

## 8. Manual Testing

To test the real-time functionality:

1. Open Firebase Console → Realtime Database
2. Navigate to the `scale` node
3. Update the values:
   - Set `isActive` to `true`
   - Set `weight` to a number (e.g., 1.5)
   - Set `product` to a product object from the products node
4. Watch your app update in real-time!

## Troubleshooting

- **Connection issues**: Check your environment variables
- **Permission denied**: Check your database security rules
- **Products not loading**: Ensure the database is properly seeded
- **Real-time updates not working**: Check browser console for errors
