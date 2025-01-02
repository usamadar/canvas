# Canvas - Full-Stack Drawing Application

Canvas is a modern full-stack drawing application built with TypeScript, React, and Node.js. It provides a rich set of drawing tools and UI components for creating and managing digital artwork. Originally created through Replit Agent, ehanced using DeepSeek using Celine and Claude Sonnet using Cursor Agent. 

## Features

- Interactive drawing canvas
- Customizable color palette
- Various drawing tools (brush, eraser, shapes)
- Responsive UI components
- Server-side persistence

## Technologies

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: Drizzle ORM
- **Styling**: Tailwind CSS, CSS Modules
- **Build Tools**: Vite, TypeScript

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
│   ├── index.html         # Main HTML entry point
│   └── ...                # Other frontend files
├── server/                # Backend server
│   ├── routes.ts          # API routes
│   └── index.ts           # Server entry point
├── db/                    # Database configuration
│   ├── schema.ts          # Database schema
│   └── index.ts           # Database connection
├── package.json           # Project dependencies
├── tsconfig.json          # TypeScript configuration
└── ...                    # Other configuration files
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
