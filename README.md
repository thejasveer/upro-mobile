# Builders Native uPro 📱

A modern React Native mobile application built with Expo, featuring Supabase authentication and NativeWind styling.

## 🌟 Features

- ✅ User Authentication (Sign In, Password Reset)
- ✅ Responsive UI with NativeWind (Tailwind CSS for React Native)
- ✅ Supabase Backend Integration
- ✅ Expo Router for Navigation
- ✅ TypeScript Support
- ✅ Cross-platform (iOS, Android, Web)

## 🚀 Quick Start Guide

Follow these steps to get the app running on your device:

### 📋 Prerequisites

- [Node.js 18.0 or later](https://nodejs.org/en/download)
- npm or yarn
- A smartphone (iOS or Android) with internet connection
- Supabase account

### 📱 Step 1: Install Expo Go App

Download the Expo Go app on your mobile device:

- **iOS**: [Download from App Store](https://apps.apple.com/app/expo-go/id982107779)
- **Android**: [Download from Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

### 💾 Step 2: Download and Setup Project

1. **Fork the repository:**

   - Go to [https://github.com/Builder-s-League/builders-native-upro](https://github.com/Builder-s-League/builders-native-upro)
   - Click the "Fork" button in the top-right corner
   - This creates a copy of the repository in your GitHub account

2. **Clone your forked repository:**

   ```bash
   git clone https://github.com/YOUR-USERNAME/builders-native-upro.git
   cd builders-native-upro
   ```

   **Note**: Replace `YOUR-USERNAME` with your actual GitHub username

3. **Install dependencies:**
   ```bash
   npm install
   ```

### 🗄️ Step 3: Setup Supabase Backend

#### 3.1 Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign Up"
3. Sign up with your email or GitHub account

#### 3.2 Create a New Project

1. After logging in, click "New Project"
2. Choose your organization (or create one)
3. Fill in project details:
   - **Name**: `builders-native-upro` (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to you
4. Click "Create new project"
5. Wait for the project to be set up (takes 1-2 minutes)

#### 3.3 Get API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (the long string under "Project API keys")

#### 3.3 Database Setup

1. **Setup schema**

   In your supabase project:
   
   - On the left side bar open `SQL Editor`
   - Click new SQL Snippet
   - Paste the contents of the [schema](https://raw.githubusercontent.com/BuildersLeague/upro-web/refs/heads/main/supabase_schema.sql)
   - Click run at the bottom right

2. **Setup database sample data**

   In your supabase project:
   
   - On the left side bar open `SQL Editor`
   - Click new SQL Snippet (or click the new tab button near the `Tab Title`)
   - Paste the contents of the [seed file](https://raw.githubusercontent.com/BuildersLeague/upro-web/refs/heads/main/seed_data.sql)
   - Click run at the bottom right

### 🔧 Step 4: Configure Environment Variables

1. **Create environment file:**

   ```bash
   # In the project root directory
   touch .env.local
   ```

2. **Add your Supabase credentials to `.env.local`:**

   ```bash
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

   **Important**: Replace the values with your actual Supabase URL and anon key from Step 3.3

### 🏃‍♂️ Step 5: Run the App

1. **Start the development server with tunnel:**

   ```bash
   npx expo start --tunnel
   ```

2. **Connect your mobile device:**

   - A QR code will appear in your terminal
   - Open the **Expo Go** app on your phone
   - Scan the QR code with your phone's camera (iOS) or using the "Scan QR Code" option in Expo Go (Android)

3. **Wait for the app to load:**
   - The app will download and install on your device
   - This may take a few minutes on first run

### 🎯 Step 6: Test the App

1. **Create an account:**

   - Open the app on your phone
   - Tap "Don't have an account? Sign up"
   - Enter your email and password
   - Tap "Sign Up"
   - Check your email for the confirmation link and click it

2. **Sign in:**
   - Return to the app
   - Enter your email and password
   - Tap "Sign In"

## 🛠️ Development Commands

```bash
# Start development server
npm start

# Start with tunnel (for testing on physical devices)
npx expo start --tunnel

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web

# Lint code
npm run lint

# Reset project (removes example code)
npm run reset-project
```

## 📁 Project Structure

```
builders-native-upro/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab-based navigation
│   ├── _layout.tsx        # Root layout
│   └── +not-found.tsx     # 404 page
├── components/            # Reusable React components
│   ├── AuthScreen.tsx     # Authentication screen
│   └── ui/               # UI components
├── contexts/             # React Context providers
│   └── AuthContext.tsx   # Authentication context
├── lib/                  # Utility libraries
│   └── supabase.ts       # Supabase client setup
├── constants/            # App constants
├── hooks/                # Custom React hooks
└── assets/               # Images, fonts, etc.
```

## 🔒 Environment Variables

Required environment variables in `.env.local`:

| Variable                        | Description                   | Example                                   |
| ------------------------------- | ----------------------------- | ----------------------------------------- |
| `EXPO_PUBLIC_SUPABASE_URL`      | Your Supabase project URL     | `https://abcdefgh.supabase.co`            |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon public key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

## 🐛 Troubleshooting

### Common Issues:

1. **"Unable to resolve module" errors:**

   ```bash
   # Clear cache and reinstall
   npx expo install --fix
   npm install
   ```

2. **Environment variables not working:**

   - Ensure `.env.local` is in the project root
   - Restart the Expo development server after adding variables
   - Make sure variables start with `EXPO_PUBLIC_`

3. **Supabase connection issues:**

   - Verify your URL and anon key are correct
   - Check that your Supabase project is active
   - Ensure you're using the anon key, not the service role key

4. **QR code not working:**

   - Make sure your phone and computer are on the same network
   - Try using the tunnel option: `npx expo start --tunnel`
   - Check if your firewall is blocking the connection

5. **App crashes on startup:**
   - Check the Expo Go app logs
   - Ensure all dependencies are installed
   - Try clearing the Expo cache: `npx expo start -c`

### Getting Help:

- Check the [Expo Documentation](https://docs.expo.dev/)
- Visit [Supabase Documentation](https://supabase.com/docs)
- Open an issue in this repository

## 📱 Supported Platforms

- ✅ iOS (iPhone/iPad)
- ✅ Android
- ✅ Web (PWA)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) for the amazing development platform
- [Supabase](https://supabase.com/) for the backend infrastructure
- [NativeWind](https://www.nativewind.dev/) for Tailwind CSS in React Native
- [React Native](https://reactnative.dev/) for the cross-platform framework

---

Built with ❤️ by the Builders League team
