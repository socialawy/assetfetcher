# Changelog

All notable changes to Asset Fetcher will be documented in this file.

## [Unreleased]

### Added
- Initial release of Asset Fetcher
- Multi-source asset search (Unsplash, Pexels, Pixabay, Poly Haven)
- 3D model viewer with @google/model-viewer
- Dark mode support
- Favorites system with local storage
- Responsive design with Tailwind CSS
- API key management system
- Attribution generation with copy-to-clipboard
- Type filtering (image, video, model, texture, HDRI)
- Orientation filtering (landscape, portrait, square)
- Pagination and infinite scroll
- Error handling and loading states

### Fixed
- TypeScript errors for model-viewer component
- Poly Haven API type parameters (hdri → hdris, tex → textures, mod → models)
- Image display issues for texture assets
- Missing User-Agent header for API compliance

### Technical
- Next.js 16 with App Router
- TypeScript for type safety
- shadcn/ui components
- Local storage for data persistence
- Proper error boundaries and fallbacks

---

## Versioning

This project follows [Semantic Versioning](https://semver.org/).

## Format

- `Added` for new features
- `Changed` for changes in existing functionality
- `Deprecated` for soon-to-be removed features
- `Removed` for now removed features
- `Fixed` for any bug fixes
- `Security` for vulnerability fixes
