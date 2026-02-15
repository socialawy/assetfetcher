# Contributing to Asset Fetcher

Thank you for your interest in contributing to Asset Fetcher! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Basic knowledge of React, TypeScript, and Next.js
- Familiarity with Tailwind CSS

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/yourusername/asset-fetcher.git
cd asset-fetcher

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📋 How to Contribute

### Reporting Issues

1. **Search existing issues** - Check if your issue already exists
2. **Use issue templates** - Provide detailed information using templates
3. **Include screenshots** - Add screenshots for UI issues
4. **Provide environment details** - Browser, OS, and version info

### Submitting Pull Requests

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow existing code style
   - Add TypeScript types for new code
   - Ensure responsive design
   - Test thoroughly

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## 🎯 Development Guidelines

### Code Style
- Use **TypeScript** for all new code
- Follow **ESLint** configuration
- Use **Prettier** for formatting (if configured)
- Write **descriptive commit messages** using conventional commits

### Component Guidelines
- Create **reusable components** in `/src/components`
- Use **shadcn/ui** components when possible
- Ensure **accessibility** with proper ARIA labels
- Make components **responsive** by default

### API Integration
- Handle **errors gracefully**
- Implement **loading states**
- Respect **rate limits**
- Add **proper TypeScript types**

### Testing
- Test with **multiple asset sources**
- Verify **responsive design** on different screen sizes
- Check **dark mode** functionality
- Test **error scenarios**

## 🏗️ Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main application
│   ├── layout.tsx         # Root layout
│   └── api/             # API routes
├── components/
│   ├── ui/              # shadcn/ui components
│   └── model-viewer.tsx  # Custom components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configs
└── types/              # TypeScript type definitions
```

## 🐛 Bug Reports

When reporting bugs, please include:

- **Description**: Clear description of the issue
- **Steps to reproduce**: Detailed steps to recreate the issue
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Environment**: Browser, OS, and version
- **Screenshots**: If applicable

## ✨ Feature Requests

For feature requests:

1. Check existing issues and discussions
2. Provide clear use case and benefits
3. Consider implementation complexity
4. Suggest UI/UX approach if possible

## 📝 Documentation

- Update **README.md** for new features
- Add **inline comments** for complex logic
- Document **API integrations** with examples
- Update **worklog.md** with development progress

## 🎨 Design Contributions

- Follow **existing design patterns**
- Use **Tailwind CSS** classes
- Maintain **consistency** with shadcn/ui
- Ensure **dark mode** compatibility

## 🔒 Security Considerations

- Never commit **API keys** or secrets
- Validate **user inputs**
- Use **HTTPS** for external requests
- Follow **CORS** best practices

## 📋 Pull Request Template

Use this template for your PR description:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested with multiple asset sources
- [ ] Tested on different screen sizes
- [ ] Tested dark mode functionality
- [ ] Added/updated tests

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No TypeScript errors
- [ ] No ESLint warnings
```

## 🤝 Community

- Be **respectful** and constructive
- Help **new contributors**
- Share **knowledge** and experience
- Follow **code of conduct**

## 📞 Getting Help

- Create an **issue** for questions
- Join **discussions** for general conversation
- Check **documentation** first

Thank you for contributing to Asset Fetcher! 🎉
