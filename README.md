# Web Phaser Engine

This project is a web-based game engine using Phaser, React, and a Node.js server.

## How to Run

This project is split into two parts: a frontend client and a backend server.

### Backend (Server)

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The server will be running on `http://localhost:3000`.

### Frontend (Client)

1.  **Navigate to the root directory (if you are in the server directory, go back one level):**
    ```bash
    cd ..
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The client will be running on `http://localhost:5173` by default (check your terminal for the exact URL).

## Testing

This project includes tests for both the backend and frontend.

### Backend (Server)

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```

2.  **Run the tests:**
    ```bash
    npm test
    ```

### Frontend (Client)

1.  **Navigate to the root directory:**
    ```bash
    cd .
    ```

2.  **Run the Cypress tests:**
    ```bash
    npm run cypress:run
    ```

## Running Tests with Docker

This project is configured to run the Cypress tests in a Docker container. This ensures a consistent testing environment.

1.  **Build and run the tests:**
    ```bash
    docker-compose up --build
    ```
    This command will build the Docker image, start the web server, and run the Cypress tests. The `--build` flag is only necessary the first time you run the command, or if you have made changes to the `Dockerfile` or the application code.
