# GEMINI Project Analysis

## Project Overview

This project is a "Mission TODO List" application, a frontend project built with React. It's designed as a to-do list with a space mission theme. The application uses `localStorage` to persist tasks on the user's browser, with plans to potentially connect to an external database via an API in the future.

The project was bootstrapped with Create React App and uses `pnpm` as the recommended package manager.

### Key Technologies
- **Framework:** React 18
- **Styling:** CSS
- **State Management:** React Context API (`TodoContext`)
- **Package Manager:** pnpm

## Building and Running

### Prerequisites
- Node.js
- pnpm (recommended)

### Installation
To install the project dependencies, run the following command in the project's root directory:
```bash
pnpm install
```

### Running the Development Server
To start the application in development mode, run:
```bash
pnpm run start
```
This will open the application at [http://localhost:3000](http://localhost:3000). The page will automatically reload when you make changes.

### Building for Production
To create a production-ready build of the application, run:
```bash
pnpm run build
```
This command bundles the app into static files for production in the `build` folder.

### Deployment
The project includes a script for deploying to GitHub Pages:
```bash
pnpm run deploy
```
This script runs the `build` command and then deploys the `build` directory.

## Development Conventions

- **State Management:** The application uses React's Context API for global state management. The main context provider is `TodoProvider`, which can be found in `src/TodoContext/index.js`.
- **Component Structure:** Components are organized by feature within the `src/Components` directory. Each component has its own folder containing the JavaScript file and its corresponding CSS file.
- **Entry Point:** The main entry point for the application is `src/index.js`, which renders the `App` component.
- **Main Component:** The root component is `App` (`src/App/index.js`), which wraps the application with the `TodoProvider`.
