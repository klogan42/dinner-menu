# Dinner Menu App

This project is a Dinner Menu application that consists of a backend API and a frontend React application. The backend processes receipts, normalizes pantry items, and generates dinner menus based on available recipes. The frontend allows users to interact with the API and view the generated menus.

## Project Structure

```
dinner-menu-app
├── backend
│   ├── app.py                # Entry point for the API
│   ├── ingest_receipts.py    # Script to process PDF receipts
│   ├── normalize_pantry.py    # Script to normalize pantry items
│   ├── generate_menu.py      # Script to generate dinner menus
│   ├── recipes.json          # JSON file containing recipes
│   ├── pantry.json           # JSON file containing raw pantry items
│   ├── normalized_pantry.json # JSON file containing normalized pantry items
│   └── README.md             # Documentation for the backend
├── frontend
│   ├── public
│   │   └── index.html        # Main HTML file for the React application
│   ├── src
│   │   ├── App.js            # Main component of the React application
│   │   ├── components
│   │   │   └── Menu.js       # Component to display the generated dinner menu
│   │   └── index.js          # Entry point for the React application
│   ├── package.json          # Configuration file for the React application
│   └── README.md             # Documentation for the frontend
└── README.md                 # Overall documentation for the project
```

## Setup Instructions

### Backend Setup

1. **Create a virtual environment**:
   - Navigate to the `backend` directory.
   - Run `python -m venv venv` to create a virtual environment.
   - Activate the virtual environment:
     - On Windows: `venv\Scripts\activate`
     - On macOS/Linux: `source venv/bin/activate`

2. **Install dependencies**:
   - Install Flask or FastAPI using pip:
     - For Flask: `pip install Flask`
     - For FastAPI: `pip install fastapi uvicorn`

3. **Run the backend**:
   - Start the API server by running `python app.py`.

### Frontend Setup

1. **Initialize the React application**:
   - Navigate to the `frontend` directory.
   - Run `npx create-react-app .` to set up the React application.

2. **Install dependencies**:
   - Install any additional dependencies required for your application.

3. **Run the frontend**:
   - Start the React application by running `npm start`.

## API Usage

- The backend API provides endpoints for generating menus and uploading receipts. Refer to the `backend/README.md` for detailed API documentation.

## Testing the Application

- Test the API endpoints using tools like Postman or directly from the frontend.
- Ensure that the frontend makes API calls to the correct endpoints defined in `app.py`.

## Documentation

- Update the README files in both the backend and frontend to provide clear instructions for setup and usage.