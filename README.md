# 🍎 SmartScale - Intelligent Fruit & Vegetable Weighing System

A modern, real-time smart scale system built with React, TypeScript, and Firebase. This application provides intelligent product detection, automatic weighing, and seamless billing for fruits and vegetables.

## ✨ Features

### 🎯 Core Functionality
- **Real-time Product Detection**: Automatically detects and identifies fruits and vegetables
- **Smart Weighing**: Instant weight measurement with high accuracy
- **Dynamic Pricing**: Real-time price calculation based on weight and product type
- **Session Management**: Track multiple items in a single shopping session
- **Firebase Integration**: Real-time data synchronization and persistence

### 🛠️ Technical Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Code Splitting**: Optimized bundle with lazy-loaded components
- **Real-time Updates**: Live data streaming from Firebase
- **Error Handling**: Robust error management and user feedback
- **TypeScript**: Full type safety and better development experience

### 🎨 UI/UX Features
- **Modern Interface**: Clean, intuitive design with Tailwind CSS
- **Loading States**: Smooth loading animations and feedback
- **Toast Notifications**: Real-time user feedback
- **Confirmation Dialogs**: User-friendly product confirmation flow
- **Status Indicators**: Clear visual feedback for scale and connection status

## 🚀 Live Demo

[View Live Demo](https://smart-autoscale.vercel.app/) 

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### Backend & Services
- **Firebase Realtime Database** - Real-time data synchronization
- **Firebase Auth** - User authentication
- **Firebase Firestore** - Document database
- **Firebase Storage** - File storage

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Terser** - JavaScript minification
- **SWC** - Fast TypeScript/JavaScript compiler

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project setup

### 1. Clone the Repository
```bash
git clone https://github.com/Jockey12https/SmartScale.git
cd SmartScale/Miniproject
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Firebase Setup
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Realtime Database
3. Set up authentication (optional)
4. Copy your Firebase config to the `.env.local` file

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## 🏗️ Build & Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

## 📁 Project Structure

```
Miniproject/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   ├── BillingSystem.tsx
│   │   ├── ProductDetection.tsx
│   │   ├── ScaleDisplay.tsx
│   │   └── WeightPricing.tsx
│   ├── lib/                # Utility libraries
│   │   ├── firebase.ts     # Firebase configuration
│   │   ├── scaleService.ts # Scale data management
│   │   └── utils.ts        # Helper functions
│   ├── hooks/              # Custom React hooks
│   └── pages/              # Page components
├── public/                 # Static assets
├── dist/                   # Build output
├── vercel.json            # Vercel configuration
└── package.json           # Dependencies and scripts
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run setup-firebase` - Setup Firebase configuration

## 🎯 Usage Guide

### 1. Start Detection
- Click "Start Detection" to activate the scale
- Place your fruit or vegetable on the scale
- The system will automatically detect and weigh the item

### 2. Confirm Product
- Review the detected product and weight
- Make corrections if needed
- Click "Confirm" to add to cart

### 3. Manage Cart
- View all items in your cart
- Remove items if needed
- Proceed to checkout when ready

### 4. Checkout
- Review your total
- Complete the transaction
- Start a new session

## 🔥 Firebase Data Structure

### Scale Data
```json
{
  "SmartScale": {
    "data": {
      "timestamp": {
        "weight": 1.5,
        "item": "Apple",
        "price": 2.99,
        "timestamp": "1703123456789"
      }
    }
  }
}
```

### Sessions
```json
{
  "sessions": {
    "sessionId": {
      "id": "sessionId",
      "startTime": 1703123456789,
      "endTime": 1703123456789,
      "items": [...],
      "total": 15.99,
      "status": "completed"
    }
  }
}
```

## 🚀 Performance Optimizations

- **Code Splitting**: Components are lazy-loaded for faster initial load
- **Bundle Optimization**: Manual chunking for better caching
- **Tree Shaking**: Unused code elimination
- **Image Optimization**: Optimized images and lazy loading
- **Caching**: Strategic caching for better performance

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Connection Failed**
   - Check your environment variables
   - Verify Firebase project configuration
   - Ensure database rules allow read/write

2. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run build`

3. **Deployment Issues**
   - Verify Vercel configuration
   - Check environment variables in Vercel dashboard
   - Ensure build command is correct

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@Jockey12https](https://github.com/Jockey12https)
- Email: jithinsj123@gmail.com

## 🙏 Acknowledgments

- [Firebase](https://firebase.google.com) for real-time database
- [Radix UI](https://www.radix-ui.com) for accessible components
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Vite](https://vitejs.dev) for fast development experience

---

⭐ **Star this repository if you found it helpful!**
