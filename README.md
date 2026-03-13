# Dinner Menu

A weekly meal planning app for browsing recipes, planning dinners for the week, and generating shopping lists.

## Tech Stack

- **Client:** Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query
- **Server:** .NET 10, C#, Entity Framework Core, SQLite

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [.NET 10 SDK](https://dotnet.microsoft.com/)

### Run the server

```bash
cd server
dotnet run
```

Runs on `http://localhost:5001`.

### Run the client

```bash
cd client
npm install
npm run dev
```

Runs on `http://localhost:3000`.

## Features

- Browse and search recipes
- Create, edit, and delete recipes
- Favorite recipes
- Plan meals for each day of the week
- Randomize the weekly meal plan
- Generate a shopping list from planned meals
- Track meal history by date

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recipes` | List all recipes |
| POST | `/api/recipes` | Create a recipe |
| GET | `/api/recipes/{id}` | Get a recipe |
| PUT | `/api/recipes/{id}` | Update a recipe |
| DELETE | `/api/recipes/{id}` | Delete a recipe |
| PATCH | `/api/recipes/{id}/favorite` | Toggle favorite |
| GET | `/api/recipes/random` | Get 7 random recipes |
| GET | `/api/weekplan` | Get the week plan |
| PUT | `/api/weekplan` | Update the week plan |
| DELETE | `/api/weekplan` | Clear the week plan |
| GET | `/api/mealhistory` | Get meal history |
| PUT | `/api/mealhistory` | Save meal history |
