# Flexrr Studio

Flexrr Studio is a modern web application management platform that allows developers to create, manage, and deploy Flexrr projects effortlessly. The platform provides a streamlined interface for managing project repositories, environment variables, and deployments.

## Features

- **GitHub Integration**: Seamlessly create and manage repositories through GitHub
- **Project Management**: View, update, and monitor your Flexrr projects
- **Environment Management**: Securely manage environment variables
- **Version Control**: Stay up-to-date with the latest Flexrr template updates
- **Easy Deployment**: Deploy your projects directly to Vercel or other platforms
- **Responsive UI**: Beautiful, responsive interface that works on all devices

## Getting Started

### Prerequisites

- Node.js 18 or higher
- MongoDB database
- GitHub account with OAuth app credentials

### Environment Variables

Create a `.env.local` file with the following variables:

```
# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# GitHub OAuth
GITHUB_ID=your-github-oauth-app-id
GITHUB_SECRET=your-github-oauth-app-secret

# Database
MONGODB_URI=your-mongodb-connection-string

# Security
ENCRYPTION_KEY=32-character-hex-string-for-encrypting-tokens
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/flexrr-studio.git
   cd flexrr-studio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

### Vercel Deployment

The easiest way to deploy Flexrr Studio is to use the Vercel Platform:

1. Push your code to GitHub
2. Import your repository to Vercel
3. Set the environment variables in the Vercel dashboard
4. Deploy!

### Other Platforms

Flexrr Studio can be deployed to any platform that supports Next.js applications, such as:

- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Self-hosted on your own server

## Architecture

Flexrr Studio is built with the following technologies:

- **Next.js**: React framework with App Router
- **NextAuth.js**: Authentication with GitHub OAuth
- **MongoDB**: Database for storing project data
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe JavaScript
- **Octokit**: GitHub API client
- **Framer Motion**: Animation library

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Flexrr template - the foundation for projects managed by this platform
- Next.js team for their amazing framework
- All open-source contributors whose libraries make this project possible
