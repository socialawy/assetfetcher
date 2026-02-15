# API Documentation

This document describes how Asset Fetcher integrates with various asset APIs and how you can extend it.

## 🌐 Supported APIs

### Unsplash
- **Base URL**: `https://api.unsplash.com`
- **Authentication**: API Key required
- **Rate Limits**: 50 requests/hour
- **Features**: Photos, search, orientation filters

#### Key Endpoints
```javascript
// Search photos
GET /search/photos
// Parameters: query, page, per_page, orientation
```

#### Example Request
```javascript
const response = await fetch(
  `https://api.unsplash.com/search/photos?query=${query}&page=${page}&per_page=20&orientation=${orientation}`,
  {
    headers: {
      'Authorization': `Client-ID ${apiKey}`,
      'User-Agent': 'AssetFetcher/1.0'
    }
  }
);
```

### Pexels
- **Base URL**: `https://api.pexels.com/v1`
- **Authentication**: API Key required
- **Rate Limits**: 200 requests/hour
- **Features**: Photos, videos, search, orientation filters

#### Key Endpoints
```javascript
// Search photos
GET /search
// Parameters: query, page, per_page, orientation

// Search videos
GET /videos/search
// Parameters: query, page, per_page, orientation
```

#### Example Request
```javascript
const response = await fetch(
  `https://api.pexels.com/v1/search?query=${query}&page=${page}&per_page=20&orientation=${orientation}`,
  {
    headers: {
      'Authorization': apiKey,
      'User-Agent': 'AssetFetcher/1.0'
    }
  }
);
```

### Pixabay
- **Base URL**: `https://pixabay.com/api/`
- **Authentication**: API Key required
- **Rate Limits**: 100 requests/hour
- **Features**: Images, videos, illustrations, vectors

#### Key Endpoints
```javascript
// Search images/videos
GET /
// Parameters: key, q, page, per_page, image_type, video_type, orientation, safesearch
```

#### Example Request
```javascript
const response = await fetch(
  `https://pixabay.com/api/?key=${apiKey}&q=${query}&page=${page}&per_page=20&image_type=${imageType}&orientation=${orientation}&safesearch=true`,
  {
    headers: {
      'User-Agent': 'AssetFetcher/1.0'
    }
  }
);
```

### Poly Haven
- **Base URL**: `https://api.polyhaven.com`
- **Authentication**: No API key required
- **Rate Limits**: None specified
- **Features**: HDRIs, textures, 3D models

#### Key Endpoints
```javascript
// Get assets by type
GET /assets
// Parameters: t (type: hdris, textures, models, all)
```

#### Example Request
```javascript
const response = await fetch(
  `https://api.polyhaven.com/assets?t=${type}`,
  {
    headers: {
      'User-Agent': 'AssetFetcher/1.0'
    }
  }
);
```

## 🔧 Adding New APIs

To add a new asset source to Asset Fetcher:

### 1. Create API Client
```typescript
interface NewAPIClient {
  search(query: string, page: number, filters: SearchFilters): Promise<SearchResults>;
}
```

### 2. Implement Search Function
```typescript
const newAPI: NewAPIClient = {
  async search(query: string, page: number, filters: SearchFilters): Promise<SearchResults> {
    // Implement API call
    // Map response to Asset interface
    // Handle errors gracefully
  }
};
```

### 3. Add to Main Application
```typescript
// Add to API clients object
const apiClients = {
  unsplash: unsplashAPI,
  pexels: pexelsAPI,
  pixabay: pixabayAPI,
  polyhaven: polyhavenAPI,
  newsource: newAPI, // Add your API
};
```

### 4. Update UI
- Add option to source selector
- Update type filters if needed
- Add API key configuration if required

## 📋 Asset Interface

All APIs must return assets matching this interface:

```typescript
interface Asset {
  id: string
  type: 'image' | 'video' | 'model' | 'texture' | 'hdri'
  title: string
  thumbnail: string
  previewUrl?: string
  downloadUrl: string
  author: string
  authorUrl?: string
  source: 'unsplash' | 'pexels' | 'pixabay' | 'polyhaven' | 'newsource'
  license: string
  width?: number
  height?: number
  tags?: string[]
  modelUrl?: string
}
```

## 🔒 Security Considerations

### API Keys
- Store keys in environment variables or secure storage
- Never commit keys to version control
- Use HTTPS for all API requests
- Implement key rotation if needed

### Request Headers
Always include proper User-Agent header:
```javascript
headers: {
  'User-Agent': 'AssetFetcher/1.0'
}
```

### Rate Limiting
- Implement exponential backoff for rate limits
- Cache responses when possible
- Show user-friendly error messages
- Track remaining requests if API provides limits

## 🚨 Error Handling

### Common Error Codes
- `401` - Invalid API key
- `429` - Rate limit exceeded
- `500` - Server error
- `404` - Resource not found

### Error Response Format
```typescript
interface APIError {
  code: number;
  message: string;
  source: string;
}
```

### Handling Strategy
1. Log errors for debugging
2. Show user-friendly messages
3. Implement retry logic for transient errors
4. Fallback to other sources if possible

## 📊 Performance Optimization

### Caching
- Cache thumbnail URLs
- Store search results temporarily
- Implement pagination caching
- Use service workers for offline support

### Request Optimization
- Batch multiple requests
- Use connection pooling
- Implement request deduplication
- Compress request payloads when possible

## 🔍 Best Practices

1. **Validate Inputs**: Sanitize search queries
2. **Handle Pagination**: Implement proper pagination
3. **Respect Limits**: Follow API rate limits
4. **Error Recovery**: Implement graceful degradation
5. **User Experience**: Show loading states and progress indicators
6. **Data Privacy**: Don't log sensitive user data

For more information, see the [Contributing Guide](../CONTRIBUTING.md).
