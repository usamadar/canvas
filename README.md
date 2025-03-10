# Canvas - Full-Stack Drawing Application

![Canvas Screenshot](./canvas-screenshot.png)

Canvas is a modern full-stack drawing application built with TypeScript, React, and Node.js. It provides a rich set of drawing tools and UI components for creating and managing digital artwork. Originally created through Replit Agent, ehanced using DeepSeek using Celine and Claude Sonnet using Cursor Agent. 

## Features

- Interactive drawing canvas with layers support
- Customizable color palette with advanced color controls
- Various drawing tools (brush, eraser, shapes, templates)
- Responsive UI components with mobile support
- Advanced undo/redo history
- Template management system
- Toast notifications system
- Server-side persistence and state management

## Technologies

- **Frontend**: React, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express
- **Database**: Drizzle ORM
- **Styling**: Tailwind CSS, CSS Modules
- **Build Tools**: Vite, TypeScript
- **UI Components**: Comprehensive shadcn/ui component library

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/canvas.git
   cd canvas
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the required configuration.

## Running the Project

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Project Structure

```
canvas/
├── client/                # Frontend application
│   ├── src/               # React components and pages
│   │   ├── components/    # UI components
│   │   │   ├── Canvas/    # Canvas components
│   │   │   ├── ui/        # shadcn/ui components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Shared utilities
│   │   ├── pages/         # Application pages
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   ├── index.html         # Main HTML entry point
│   └── ...                # Other frontend files
├── server/                # Backend server
│   ├── routes.ts          # API routes
│   └── index.ts           # Server entry point
├── db/                    # Database configuration
│   ├── schema.ts          # Database schema
│   └── index.ts           # Database connection
├── public/                # Static assets
├── .env                   # Environment variables
├── package.json           # Project dependencies
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── ...                    # Other configuration files
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
