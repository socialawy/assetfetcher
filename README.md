# Asset Fetcher

A powerful web application for searching and downloading high-quality assets from multiple sources including Unsplash, Pexels, Pixabay, and Poly Haven.

## ✨ Features

### 🎯 Asset Sources
- **Unsplash** - High-quality photography with orientation filters
- **Pexels** - Stock photos and videos with orientation filters  
- **Pixabay** - Images, videos, and illustrations
- **Poly Haven** - HDRIs, PBR textures, and 3D models (no API key required)

### 🔍 Search & Discovery
- **Universal Search** - Search across all asset sources simultaneously
- **Type Filtering** - Filter by image, video, model, texture, or HDRI
- **Orientation Filters** - Landscape, portrait, or square orientations
- **Real-time Results** - Instant search with pagination

### 🎨 User Interface
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Dark Mode** - Toggle between light and dark themes
- **Asset Cards** - Beautiful cards showing thumbnails, metadata, and actions
- **Preview Modal** - Full-screen preview with detailed information
- **Favorites System** - Save and manage favorite assets locally

### ⚡ Advanced Features
- **3D Model Viewer** - Interactive 3D model preview with rotation and zoom
- **Smart Attribution** - Auto-generated attribution text with copy-to-clipboard
- **Direct Downloads** - One-click download to original asset source
- **Error Handling** - Graceful handling of API limits and missing data

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/asset-fetcher.git
cd asset-fetcher

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

```bash
# Development
npm run dev          # Start development server on port 3000

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 🔧 Configuration

### API Keys

The application works out of the box with Poly Haven (no API key required). For other sources:

1. Open the application
2. Click the settings icon
3. Add your API keys:
   - **Unsplash**: Get your key at [unsplash.com/developers](https://unsplash.com/developers)
   - **Pexels**: Get your key at [pexels.com/api](https://pexels.com/api)
   - **Pixabay**: Get your key at [pixabay.com/api/docs](https://pixabay.com/api/docs)

API keys are stored locally in your browser and are never sent to external servers.

## 🏗️ Technology Stack

### Core Framework
- **⚡ Next.js 16** - React framework with App Router
- **📘 TypeScript** - Type-safe development
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **🧩 shadcn/ui** - High-quality UI components

### Key Libraries
- **@google/model-viewer** - 3D model visualization
- **Lucide React** - Beautiful icon library
- **next-themes** - Dark mode support
- **React Hook Form** - Form management with validation

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main application component
│   ├── layout.tsx         # Root layout with metadata
│   └── api/             # API routes (if needed)
├── components/
│   ├── ui/              # shadcn/ui components
│   └── model-viewer.tsx  # 3D model viewer wrapper
├── hooks/
│   ├── use-toast.ts       # Toast notifications
│   └── use-mobile.ts     # Mobile detection
└── lib/
    ├── utils.ts          # Utility functions
    └── db.ts            # Database configuration
```

## 🎯 Asset Types

### Images
- **Source**: Unsplash, Pexels, Pixabay
- **Formats**: JPEG, PNG, WebP
- **Features**: Orientation filters, color search

### Videos
- **Source**: Pexels, Pixabay
- **Formats**: MP4, WebM
- **Features**: Duration filters, resolution options

### 3D Models
- **Source**: Poly Haven
- **Formats**: GLB, GLTF
- **Features**: Interactive preview, material information

### HDRIs
- **Source**: Poly Haven
- **Formats**: HDR, EXR
- **Features**: 360° environment maps, lighting presets

### Textures
- **Source**: Poly Haven
- **Formats**: PNG, JPG (PBR maps)
- **Features**: Material properties, seamless tiles

## 🔒 Privacy & Security

- **Local Storage** - All data stored locally in your browser
- **No Tracking** - No analytics or tracking scripts
- **API Key Security** - Keys never leave your device
- **HTTPS Ready** - Secure connections for all API calls

## 📝 License Information

Each asset source maintains its own licensing terms:

- **Unsplash**: Unsplash License (free for commercial use)
- **Pexels**: Pexels License (free for commercial use)
- **Pixabay**: Pixabay License (free for commercial use)
- **Poly Haven**: CC0 (Public Domain)

Always check individual asset licenses before commercial use.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow the existing code style
- Test with multiple asset sources
- Ensure responsive design
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Unsplash** - For providing amazing photography
- **Pexels** - For high-quality stock media
- **Pixabay** - For diverse asset collection
- **Poly Haven** - For incredible 3D assets and HDRIs
- **shadcn/ui** - For beautiful UI components

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/asset-fetcher/issues) page
2. Create a new issue with detailed information
3. Join our [Discussions](https://github.com/yourusername/asset-fetcher/discussions) for questions

---

Made with ❤️ for the creative community
