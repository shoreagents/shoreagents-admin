# ShoreAgents Admin Dashboard

A modern desktop application built with Electron, Next.js, and shadcn/ui for managing ShoreAgents platform.

## Features

- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Responsive Design**: Works seamlessly on different screen sizes
- **Dashboard Analytics**: Overview of platform metrics and statistics
- **User Management**: Interface for managing platform users
- **Real-time Updates**: Live activity feed and notifications
- **Cross-platform**: Runs on Windows, macOS, and Linux

## Tech Stack

- **Frontend**: Next.js 14 with React 18
- **Desktop**: Electron 27
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Icons**: Lucide React icons
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd shoreagents-admin
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

This will start both the Next.js development server and the Electron application.

### Build Commands

- `npm run dev` - Start development mode (Next.js + Electron)
- `npm run build` - Build Next.js application
- `npm run build:electron` - Build Electron application for distribution
- `npm run start` - Start production Next.js server
- `npm run lint` - Run ESLint

## Project Structure

```
shoreagents-admin/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── layout.tsx       # Root layout component
│   │   └── page.tsx         # Main dashboard page
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── header.tsx       # Dashboard header
│   │   └── sidebar.tsx      # Navigation sidebar
│   ├── electron/            # Electron main process
│   │   └── main.js          # Electron entry point
│   ├── lib/                 # Utility functions
│   │   └── utils.ts         # Tailwind utilities
│   └── styles/              # Global styles
│       └── globals.css      # Tailwind CSS imports
├── public/                  # Static assets
├── package.json             # Project dependencies
├── next.config.js           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## Dashboard Features

### Main Dashboard
- **Statistics Cards**: Display key metrics like user count, revenue, and growth
- **Analytics Chart**: Visual representation of platform performance
- **Recent Activity**: Live feed of platform events
- **Quick Actions**: Shortcuts to common administrative tasks

### Navigation
- **Sidebar**: Easy navigation between different sections
- **Header**: Search functionality and quick actions
- **User Profile**: Admin user information and settings

## Development

### Adding New Components

1. Create new components in `src/components/`
2. Use shadcn/ui components for consistent styling
3. Follow the existing pattern for props and styling

### Styling

- Use Tailwind CSS classes for styling
- Utilize the custom design tokens defined in `tailwind.config.ts`
- Follow the shadcn/ui design system conventions

### Electron Integration

- The Electron main process is in `src/electron/main.js`
- Window configuration and menu setup is handled automatically
- Development mode opens DevTools automatically

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 