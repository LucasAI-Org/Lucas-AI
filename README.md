# Lucas MVP Backend

A gamified learning platform backend built with Node.js, Express, and Firebase.

## Features

- 🔐 Firebase Authentication integration
- 🎯 Quest system with XP and levels
- 🚀 Project-based learning unlocks
- 💼 Multiple career paths
- 📊 User progress tracking
- 🔄 Career switching at high levels

## Quick Start

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Firebase Setup**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password and Google OAuth)
   - Enable Firestore Database
   - Download service account key and save as `firebase-service-account.json`

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase credentials
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```

5. **Start the server**
   ```bash
   npm run dev  # Development with nodemon
   npm start    # Production
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user profile
- `GET /api/auth/profile` - Get current user profile

### User Management
- `GET /api/user/:id` - Get user profile
- `PUT /api/user/:id` - Update user profile
- `POST /api/user/:id/switch-career` - Switch career (Level 20+)

### Quests
- `GET /api/quests/:careerId` - Get quests for career
- `GET /api/quests/user/current` - Get user's current quests
- `POST /api/quests/complete/:questId` - Complete quest
- `POST /api/quests/skip/:questId` - Skip quest

### Projects
- `GET /api/projects/:careerId` - Get projects for career
- `GET /api/projects/details/:projectId` - Get project details

### Careers
- `GET /api/careers` - Get all careers
- `GET /api/careers/:careerId` - Get specific career

## Frontend Integration

### Authentication Flow
1. User authenticates with Firebase Auth on frontend
2. Frontend sends ID token to backend in Authorization header: `Bearer <token>`
3. Backend verifies token and processes requests

### Example Frontend Code
```javascript
// Login and get token
const userCredential = await signInWithEmailAndPassword(auth, email, password);
const idToken = await userCredential.user.getIdToken();

// Make API request
const response = await fetch('/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${idToken}`,
    'Content-Type': 'application/json'
  }
});
```

## Database Schema

### Users Collection
```json
{
  "id": "firebase-uid",
  "email": "user@example.com",
  "name": "John Doe",
  "skills": ["HTML", "CSS", "JavaScript"],
  "careerPath": "Frontend Developer",
  "xp": 150,
  "level": 3,
  "questsCompleted": ["quest-html-1", "quest-css-1"],
  "currentQuests": ["quest-js-1", "quest-react-1"],
  "createdAt": "2023-...",
  "updatedAt": "2023-..."
}
```

### Careers Collection
```json
{
  "id": "frontend-developer",
  "title": "Frontend Developer",
  "overview": "Learn modern web development...",
  "roadmapSteps": ["HTML", "CSS", "JavaScript", "React"],
  "quests": ["quest-html-1", "quest-css-1", ...],
  "projects": ["project-portfolio", "project-todo-app", ...]
}
```

## Deployment

### Firebase Functions (Recommended)
```bash
npm install -g firebase-tools
firebase init functions
firebase deploy --only functions
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Heroku
```bash
# Add Heroku buildpack
heroku buildpacks:set heroku/nodejs

# Set environment variables
heroku config:set FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}'
heroku config:set FIREBASE_DATABASE_URL='https://your-project.firebaseio.com'

# Deploy
git push heroku main
```

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Make changes and test
4. Commit changes: `git commit -am 'Add new feature'`
5. Push to branch: `git push origin feature/new-feature`
6. Create Pull Request

## License

MIT License - see LICENSE file for details