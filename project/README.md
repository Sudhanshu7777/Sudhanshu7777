# EcoSort Assist - Frontend

A modern React application for waste classification using AI-powered image recognition.

## Features

- 📸 **Image Upload & Camera Capture** - Upload images or use device camera for real-time classification
- 🤖 **AI-Powered Classification** - Advanced waste type identification with confidence scores
- 📍 **Location-Based Services** - Find nearby recycling centers and disposal facilities
- 📱 **Mobile-First Design** - Fully responsive across all devices
- 🎨 **Modern UI** - Beautiful Tailwind CSS interface with eco-themed colors
- ⚡ **Fast Performance** - Built with Vite for lightning-fast development and builds

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ErrorBoundary.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── ImageUpload.tsx
│   ├── LoadingSpinner.tsx
│   └── ResultDashboard.tsx
├── contexts/           # React contexts
│   └── GeolocationContext.tsx
├── hooks/              # Custom React hooks
│   ├── useClassification.ts
│   └── useGeolocation.ts
├── pages/              # Page components
│   ├── ClassifyPage.tsx
│   ├── ComplaintPage.tsx
│   ├── HomePage.tsx
│   └── ResultPage.tsx
├── services/           # API and external services
│   ├── api.ts
│   ├── classification.ts
│   └── geolocation.ts
├── stores/             # Zustand state stores
│   └── ClassificationStore.ts
├── types/              # TypeScript type definitions
│   └── classification.ts
├── utils/              # Utility functions
│   ├── imageUtils.ts
│   └── validation.ts
├── App.tsx             # Main app component
├── main.tsx           # App entry point
└── index.css          # Global styles
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Setup

1. Copy the environment example file:
   ```bash
   cp .env.example .env
   ```

2. Configure your API base URL in `.env`:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

Create a production build:
```bash
npm run build
```

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Pages

### Home (`/`)
- Landing page with hero section
- Feature highlights
- How it works guide
- Statistics and CTA

### Classify (`/classify`)
- Image upload interface
- Camera capture support
- Location permission handling
- Real-time processing feedback

### Results (`/result`)
- Classification results display
- Disposal instructions
- Environmental impact information
- Map placeholder for nearby facilities

### Complaint (`/complaint`)
- Issue reporting form
- Classification feedback
- Contact information collection

## Key Components

### ImageUpload
- Drag & drop support
- File validation
- Camera integration
- Preview functionality

### ResultDashboard
- Classification results
- Confidence indicators
- Disposal instructions
- Environmental impact metrics

### ErrorBoundary
- Global error handling
- User-friendly error messages
- Development error details

## State Management

The application uses Zustand for state management:

- **ClassificationStore**: Manages classification state, results, and history
- **GeolocationContext**: Handles location services and permissions

## API Integration

The app includes a comprehensive API layer:

- Axios configuration with interceptors
- Request/response error handling
- File upload support
- Authentication token management

## Responsive Design

- Mobile-first approach
- Tailwind CSS breakpoints
- Touch-friendly interactions
- Optimized for all screen sizes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style
2. Use TypeScript for all new code
3. Add appropriate tests
4. Update documentation as needed

## License

This project is licensed under the MIT License.
