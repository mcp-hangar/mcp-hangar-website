# MCP Hangar Website

Production-grade landing page for [MCP Hangar](https://github.com/mapyr/mcp-hangar) — infrastructure for Model Context Protocol.

## Overview

This is the official website for MCP Hangar, showcasing features, documentation links, and providing installation instructions for the MCP Hangar infrastructure tool.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Vercel** - Deployment platform

## Prerequisites

- Node.js 18+ and npm
- Git

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/mapyr/mcp-hangar-website.git
cd mcp-hangar-website

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Building

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

### Code Quality

```bash
# Run linter
npm run lint

# Format code
npx prettier --write .

# Run tests
npm test
```

## Project Structure

```
mcp-hangar-website/
├── public/           # Static assets (favicon, install.sh)
├── src/
│   ├── components/   # React components
│   ├── App.tsx       # Main application component
│   ├── main.tsx      # Application entry point
│   └── index.css     # Global styles
├── dist/             # Production build output
├── index.html        # HTML template
└── vercel.json       # Vercel deployment config
```

## Deployment

This project is deployed to Vercel. The deployment automatically triggers on pushes to the `main` branch.

### Custom Domains

- **mcp-hangar.io** - Main website
- **get.mcp-hangar.io** - Redirects to install.sh for curl-based installation

## Features

- Responsive design for all screen sizes
- Animated terminal demo
- Clipboard integration for install command
- SEO optimized with Open Graph tags
- Dark mode design with emerald accent colors
- Performance optimized with Vite

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run linting and formatting
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Related Projects

- [MCP Hangar](https://github.com/mapyr/mcp-hangar) - Main infrastructure project
- [MCP Hangar Docs](https://mapyr.github.io/mcp-hangar/) - Documentation

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- GitHub Issues: [Report a bug or request a feature](https://github.com/mapyr/mcp-hangar/issues)
- Documentation: [https://mapyr.github.io/mcp-hangar/](https://mapyr.github.io/mcp-hangar/)

---

Made with ♥ for the MCP community
