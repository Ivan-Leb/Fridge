# Fridge Recipe App 🍳

A full-stack web application that suggests recipes based on photos of your fridge contents using OpenAI's GPT-4 Vision API.

## Learning Objectives

## Project Structure

```
fridge-recipe-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API calls
│   │   └── types/         # TypeScript definitions
├── server/                 # Node.js backend
│   ├── routes/            # API endpoints
│   ├── services/          # Business logic
│   └── middleware/        # Request processing
├── package.json           # Root package configuration
└── README.md             # This file
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **External APIs**: OpenAI GPT-4 Vision API
- **Development**: Vite, ESLint, Prettier

## Getting Started

1. Clone this repository
2. Install dependencies: `npm run install-all`
3. Set up environment variables (see .env.example)
4. Start development servers: `npm run dev`

## Learning Path

We'll build this step by step:
1. Project setup and Git initialization
2. Backend API development
3. Frontend UI development
4. API integration
5. Testing and debugging
6. Deployment preparation 