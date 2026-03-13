# Dinner Table

A weekly meal planning app for browsing recipes, planning dinners for the week, and generating shopping lists.

## Tech Stack

- **Framework:** Next.js 16, React 19, TypeScript
- **Database:** MongoDB (Mongoose)
- **Styling:** Tailwind CSS, shadcn/ui
- **Data Fetching:** TanStack Query

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- A MongoDB database (e.g. [MongoDB Atlas](https://www.mongodb.com/atlas))

### Setup

```bash
cd client
cp .env.example .env.local   # then fill in your MONGODB_URI and API_SECRET_KEY
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
| GET | `/api/mealhistory` | Get meal history |
| PUT | `/api/mealhistory/{date}` | Set/clear meal for a date |
