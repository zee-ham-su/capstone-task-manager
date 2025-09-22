# Task Manager Frontend

A modern, responsive task management application built with React, TypeScript, and Tailwind CSS. This frontend connects to a NestJS backend API to provide a full-featured task management system.

## Features

- 🔐 User authentication (login, registration, password reset)
- 📝 Create, read, update, and delete tasks
- 🔍 Filter and search tasks by status, priority, and tags
- 📱 Fully responsive design that works on all devices
- 🎨 Clean, modern UI with dark mode support
- ⚡ Fast and efficient with React Query for data fetching and caching
- 🛠 Built with TypeScript for type safety and better developer experience

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Backend API (see [Backend Repository](https://github.com/your-username/task-manager-backend) for setup)

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/task-manager-frontend.git
   cd task-manager-frontend
   ```

2. **Install dependencies**

   Using npm:
   ```bash
   npm install
   ```

   Or using yarn:
   ```bash
   yarn
   ```

3. **Configure environment variables**

   Create a `.env` file in the root of the project and add the following variables:

   ```env
   VITE_API_URL=http://localhost:3001
   ```

   Adjust the API URL to match your backend server.

4. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The application will be available at `http://localhost:3000`

## Available Scripts

- `dev` - Start the development server
- `build` - Build the application for production
- `preview` - Preview the production build locally
- `lint` - Run ESLint
- `type-check` - Check TypeScript types

## Project Structure

```
src/
  ├── api/               # API client and services
  ├── assets/            # Static assets
  ├── components/        # Reusable UI components
  │   ├── auth/         # Authentication components
  │   ├── common/       # Common components (layout, buttons, etc.)
  │   └── tasks/        # Task-related components
  ├── context/          # React context providers
  ├── hooks/            # Custom React hooks
  ├── pages/            # Page components
  ├── types/            # TypeScript type definitions
  └── utils/            # Utility functions
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling. The theme configuration can be found in `tailwind.config.js`.

## State Management

- **Local State**: React's `useState` and `useReducer` hooks
- **Server State**: [React Query](https://tanstack.com/query) for data fetching and caching
- **Global State**: React Context for authentication state

## Form Handling

Forms are handled with [React Hook Form](https://react-hook-form.com/) with Zod for validation.

## Routing

Routing is handled by [React Router](https://reactrouter.com/).

## Testing

To run tests:

```bash
npm test
# or
yarn test
```

## Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## Deployment

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Ftask-manager-frontend)

1. Push your code to a GitHub repository
2. Import the project on Vercel
3. Add your environment variables
4. Deploy!

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/task-manager-frontend)

1. Push your code to a GitHub repository
2. Import the project on Netlify
3. Add your environment variables
4. Set the build command to `npm run build` and publish directory to `dist`
5. Deploy!

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Query](https://tanstack.com/query)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Heroicons](https://heroicons.com/)
