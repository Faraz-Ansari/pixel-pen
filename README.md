# Pixel Pen

**Pixel Pen** is a full-stack blog application, utilizing React.js for the frontend and Express.js for the backend. Styled with Tailwind CSS and Flowbite React components, it offers a responsive and modern user interface. The application employs MongoDB for data storage, ensuring efficient handling of blog posts and user information. Security is maintained through JSON Web Tokens and cookies, providing safe authentication and session management.

Check it out here: https://pixel-pen.onrender.com

## Table of Contents

-   [Features](#features)
-   [Prerequisites](#prerequisites)
-   [Installation](#installation)
-   [Run the application](#run-the-application)
-   [Contributing](#contributing)

## Features

-   **Seamless User Authentication:** Enjoy a secure login and registration process with JWT and cookies, ensuring safe access.
-   **Elegant, Responsive UI:** A sleek, modern design powered by Tailwind CSS and Flowbite React, offering a flawless experience on all devices.
-   **Dynamic Content Creation:** Effortlessly create, update, and manage blog posts with an intuitive interface.
-   **Robust Data Handling:** Backend powered by MongoDB, making data storage and management efficient and scalable.
-   **High Security Standards:** Protects user sessions and data with advanced security practices, ensuring user privacy and integrity.

## Prerequisites

Make sure you have the following installed on your machine:

-   Node.js (v14 or later)
-   MongoDB (local or MongoDB Atlas)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Faraz-Ansari/pixel-pen
    cd pixel-pen
    ```

2. Install dependencies for both client and server:

    ```bash
    npm install

    cd client
    npm install
    ```

3. Create a `.env` file in the `api` directory and add the following:

    ```
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    VITE_FIREBASE_API_KEY=your_firebase_api_key
    ```

## Run the application

1. Start the backend server:

    ```bash
    npm start
    ```

2. Start the frontend server:

    ```bash
    cd client
    npm start
    ```

3. Open your browser and navigate to `http://localhost:5173`.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure your code adheres to the project's coding standards.
