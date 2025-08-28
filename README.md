# Split Check - Luxury Bill Splitting App

A premium React-based bill splitting application with a luxury dark theme and gold accents. Built with TypeScript, TailwindCSS, and ShadCN UI components.

## ✨ Features

### 🎨 Luxury Design

- **Dark Theme**: Sophisticated dark background with gold/royal accents
- **Glassmorphism**: Modern glass-like cards with blur effects
- **Premium Typography**: Playfair Display and Inter fonts
- **Smooth Animations**: Framer Motion powered transitions and interactions

### 📱 Core Functionality

- **Create Sessions**: Admin can create new bill splitting sessions
- **Join Sessions**: Friends can join via session links or IDs
- **Order Management**: Dynamic product entry with real-time calculations
- **Payment Tracking**: InstaPay and Cash payment methods
- **Session Summary**: Comprehensive breakdown with payment status

### 🚀 Technical Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **ShadCN UI** for premium components
- **Framer Motion** for animations
- **React Router** for navigation
- **Axios** for API communication

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd split-check
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   └── ui/                 # ShadCN UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── switch.tsx
│       ├── toast.tsx
│       └── toaster.tsx
├── hooks/
│   └── use-toast.ts        # Custom toast hook
├── lib/
│   ├── api.ts             # API client and endpoints
│   └── utils.ts           # Utility functions
├── pages/
│   ├── Landing.tsx        # Home page with session options
│   ├── CreateSession.tsx  # Admin session creation
│   ├── JoinPage.tsx       # Session ID entry
│   ├── JoinSession.tsx    # Friend order entry
│   └── SessionSummary.tsx # Session overview and management
├── types/
│   └── index.ts           # TypeScript interfaces
├── App.tsx                # Main app with routing
└── index.css              # Global styles and theme
```

## 🎯 API Integration

The app is designed to work with a Node.js/Express backend. Update the API base URL in `src/lib/api.ts`:

```typescript
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
```

### Required Backend Endpoints

- `POST /api/sessions` - Create new session
- `GET /api/sessions/{id}/summary` - Get session summary
- `POST /api/sessions/{id}/friends` - Join session
- `PATCH /api/sessions/{id}/friends/{friendId}/payment` - Update payment status
- `DELETE /api/sessions/{id}` - Delete session

## 🎨 Design System

### Color Palette

- **Primary**: Gold (#FFD700) with gradient variations
- **Background**: Dark grays (#111827, #000000)
- **Text**: White and gray variations
- **Accents**: Blue, green, red for status indicators

### Typography

- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

### Components

- **Cards**: Glassmorphism with luxury borders
- **Buttons**: Multiple variants (luxury, glass, outline)
- **Inputs**: Dark theme with gold focus states
- **Animations**: Fade, scale, slide transitions

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://your-backend-url.com/api
```

## 📱 Responsive Design

The app is fully responsive with:

- **Mobile-first** approach
- **Grid layouts** that adapt to screen size
- **Touch-friendly** interactions
- **Optimized spacing** for all devices

## 🎭 Animations

### Page Transitions

- Fade-in effects on page load
- Staggered animations for content
- Smooth navigation transitions

### Interactive Elements

- Hover effects on cards and buttons
- Scale animations on interactions
- Loading states with spinners

## 🔧 Customization

### Theme Colors

Modify CSS variables in `src/index.css`:

```css
:root {
  --primary: 45 100% 51%; /* Gold */
  --background: 222.2 84% 4.9%; /* Dark */
  /* ... other variables */
}
```

### Component Styling

All components use TailwindCSS classes and can be customized through the `className` prop or by modifying the component files.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎉 Features in Action

### Landing Page

- Luxury design with animated buttons
- Smooth fade-in animations
- Responsive grid layout

### Create Session

- Glassmorphism form design
- File upload for bill images
- Real-time validation
- Success state with copyable link

### Join Session

- Bill preview with session details
- Dynamic product entry forms
- Payment method selection
- Real-time total calculations

### Session Summary

- Comprehensive payment overview
- Interactive payment status toggles
- Detailed friend breakdowns
- Admin session management

---

Built with ❤️ using modern web technologies for a premium user experience.
