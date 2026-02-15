# Troubleshooting Guide

This document covers common issues and their solutions for Asset Fetcher.

## 🔍 Search Issues

### No Results Found

**Problem**: Search returns no assets

**Solutions**:
1. Check spelling of search terms
2. Try broader search terms
3. Verify API keys are correctly configured
4. Check if selected source supports the asset type
5. Try different orientation filters

**Debug Steps**:
```javascript
// Check browser console for API errors
// Open Network tab in DevTools
// Look for failed API requests
```

### Slow Search Performance

**Problem**: Search takes too long to return results

**Solutions**:
1. Check internet connection speed
2. Disable browser extensions that might interfere
3. Clear browser cache and cookies
4. Try different browser
5. Check API service status

## 🖼️ Image Display Issues

### Images Not Loading

**Problem**: Thumbnail or preview images not showing

**Solutions**:
1. Check browser console for error messages
2. Verify internet connectivity
3. Disable ad blockers temporarily
4. Check if images are blocked by network policy
5. Clear browser cache

**Common Console Errors**:
```
Failed to load resource: net::ERR_BLOCKED_BY_CLIENT
CORS policy: No 'Access-Control-Allow-Origin' header
```

### Broken Images

**Problem**: Images show as broken or placeholders

**Solutions**:
1. Wait for images to fully load
2. Refresh the page
3. Check if asset source is experiencing issues
4. Try different asset source

## 🔑 API Key Issues

### Invalid API Key Error

**Problem**: "401 Unauthorized" or "Invalid API key"

**Solutions**:
1. Verify API key is correct
2. Check for extra spaces or characters
3. Ensure key has required permissions
4. Generate new API key if needed

**API Key Sources**:
- [Unsplash Dashboard](https://unsplash.com/developers)
- [Pexels API](https://pexels.com/api/)
- [Pixabay API](https://pixabay.com/api/docs/)

### Rate Limit Exceeded

**Problem**: "429 Too Many Requests" error

**Solutions**:
1. Wait for rate limit to reset
2. Upgrade API plan if available
3. Implement caching in your usage
4. Use multiple API keys if allowed

**Rate Limits by Service**:
- Unsplash: 50 requests/hour
- Pexels: 200 requests/hour  
- Pixabay: 100 requests/hour
- Poly Haven: No limit

## 🎨 UI/UX Issues

### Responsive Design Problems

**Problem**: Layout broken on mobile devices

**Solutions**:
1. Refresh the page
2. Clear browser cache
3. Update browser to latest version
4. Try different mobile browser
5. Check device orientation

### Dark Mode Issues

**Problem**: Dark mode not working or not persisting

**Solutions**:
1. Check if localStorage is enabled
2. Clear browser cache
3. Check browser privacy settings
4. Try manual theme toggle

**Debug localStorage**:
```javascript
// Check in browser console
localStorage.getItem('theme')
localStorage.setItem('theme', 'dark')
```

## 🎬 3D Model Issues

### Models Not Loading

**Problem**: 3D models show as blank or error

**Solutions**:
1. Check if browser supports WebGL
2. Update graphics drivers
3. Try different browser (Chrome recommended)
4. Check model file format compatibility

**WebGL Support Check**:
```javascript
// Run in browser console
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
console.log('WebGL supported:', !!gl);
```

### Model Viewer Controls Not Working

**Problem**: Can't rotate, zoom, or interact with 3D models

**Solutions**:
1. Click on the model viewer to focus
2. Try mouse/touch interactions
3. Check if controls are enabled
4. Refresh the page

## 💾 Local Storage Issues

### Favorites Not Saving

**Problem**: Favorite assets not persisting

**Solutions**:
1. Check if localStorage is enabled
2. Clear browser cache and try again
3. Check browser privacy settings
4. Try incognito mode to test

**Debug Favorites**:
```javascript
// Check in browser console
console.log('Favorites:', JSON.parse(localStorage.getItem('favorites') || '[]'));
```

### Settings Not Persisting

**Problem**: API keys or preferences not saved

**Solutions**:
1. Check localStorage quota
2. Clear corrupted localStorage data
3. Disable browser extensions that block storage
4. Try different browser

## 🌐 Network Issues

### CORS Errors

**Problem**: Cross-origin request blocked

**Solutions**:
1. Check if API is accessible directly
2. Verify API endpoints are correct
3. Check for firewall/proxy interference
4. Try different network

### Connection Timeouts

**Problem**: Requests timing out

**Solutions**:
1. Check internet connection stability
2. Try different network (WiFi vs mobile)
3. Restart router/modem
4. Check DNS settings

## 🔧 Development Issues

### Build Failures

**Problem**: `npm run build` fails

**Solutions**:
1. Check Node.js version (requires 18+)
2. Clear node_modules and reinstall
3. Update to latest npm version
4. Check disk space

```bash
# Clean reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

**Problem**: Type errors during development

**Solutions**:
1. Run `npm run lint` to identify issues
2. Check TypeScript configuration
3. Update type definitions
4. Verify all imports are correct

## 📱 Browser Compatibility

### Supported Browsers
- **Chrome**: 90+ (recommended)
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Browser-Specific Issues

**Safari**:
- Enable WebGL in Settings > Advanced
- Check if Experimental Features are enabled

**Firefox**:
- Check WebGL support in `about:support`
- Enable hardware acceleration

**Edge**:
- Use Chromium-based Edge
- Check compatibility mode

## 🐛 Reporting Bugs

### Information to Include

When reporting issues, provide:

1. **Browser and Version**: Chrome 120.0.0
2. **Operating System**: Windows 11, macOS 14, Ubuntu 22.04
3. **Steps to Reproduce**: Detailed step-by-step instructions
4. **Expected vs Actual**: What should happen vs what happens
5. **Console Errors**: Copy any error messages
6. **Screenshots**: Visual evidence of the issue

### Bug Report Template

```markdown
## Description
[Clear description of the issue]

## Environment
- Browser: [browser and version]
- OS: [operating system]
- Device: [desktop/mobile/tablet]

## Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Console Errors
```
[Paste any console errors here]
```

## 📞 Getting Help

### Self-Service Resources
- [FAQ](../README.md#faq)
- [API Documentation](API.md)
- [Contributing Guide](../CONTRIBUTING.md)

### Community Support
- [GitHub Issues](https://github.com/yourusername/asset-fetcher/issues)
- [GitHub Discussions](https://github.com/yourusername/asset-fetcher/discussions)

### Contact Information
- Create a detailed issue on GitHub
- Include screenshots and console errors
- Provide steps to reproduce the problem

---

For additional help, see the [main documentation](../README.md).
