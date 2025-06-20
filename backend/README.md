# Dinner Menu API

This project is a dinner menu application that consists of a backend API and a React frontend. The backend is responsible for processing receipts, normalizing pantry items, and generating dinner menus based on available recipes. The frontend provides a user interface for interacting with the API.

## Backend Setup

1. **Create a Virtual Environment**:
   - Navigate to the `backend` directory.
   - Create a virtual environment:
     ```
     python -m venv venv
     ```
   - Activate the virtual environment:
     - On Windows:
       ```
       venv\Scripts\activate
       ```
     - On macOS/Linux:
       ```
       source venv/bin/activate
       ```

2. **Install Dependencies**:
   - Install Flask or FastAPI and other required libraries:
     ```
     pip install Flask pdf2image pytesseract sentence-transformers
     ```

3. **Run the API**:
   - Start the API server:
     ```
     python app.py
     ```

## API Endpoints

- **POST /upload-receipt**: Upload a PDF receipt to extract pantry items.
- **GET /generate-menu**: Generate a dinner menu based on the normalized pantry items.

## Frontend Setup

1. **Initialize the Frontend**:
   - Navigate to the `frontend` directory.
   - Use Create React App to set up the frontend:
     ```
     npx create-react-app .
     ```

2. **Install Axios**:
   - Install Axios for making API calls:
     ```
     npm install axios
     ```

3. **Run the Frontend**:
   - Start the React application:
     ```
     npm start
     ```

## Connecting Frontend and Backend

- Ensure that the frontend makes API calls to the correct endpoints defined in `app.py`.
- Handle CORS if necessary to allow communication between the frontend and backend.

## Testing the Application

- Run both the backend server and the React frontend.
- Test the API endpoints using tools like Postman or directly from the frontend.

## Documentation

- Update the README files in both the backend and frontend to provide clear instructions for setup and usage.