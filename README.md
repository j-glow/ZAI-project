# ZAI Project - Advanced Internet Applications

This document provides a comprehensive overview of the ZAI project, a web application for collecting and presenting measurement data. It covers the application's features, technical implementation, setup instructions, and security aspects, as per the project requirements.

## Table of Contents
1.  [Project Overview](#project-overview)
2.  [Functional Requirements Checklist](#functional-requirements-checklist)
3.  [Technical Requirements Checklist](#technical-requirements-checklist)
4.  [Live Demo](#live-demo)
5.  [Screenshots](#screenshots)
6.  [Technology Stack](#technology-stack)
7.  [Database Schema](#database-schema)
8.  [Codebase Overview](#codebase-overview)
9.  [Security Aspects Addressed](#security-aspects-addressed)
10. [API Documentation](#api-documentation)
11. [Local Setup and Operation](#local-setup-and-operation)

---

## Project Overview

This application is designed to collect, manage, and visualize time-series data from various sources. It provides a graphical user interface (GUI) to display data in both chart and table formats, with filtering capabilities. The system supports multiple user roles, data validation, and secure data handling.

An optional extension has been implemented to allow autonomous sensors to send data directly to the backend API, simulating a real-world IoT scenario.

---

## Functional Requirements Checklist

Here is a summary of how the application meets the specified functional requirements:

- **1. Measurement Data Structure:** A measurement consists of a floating-point `value`, a `timestamp`, and an identifier for the `series` it belongs to.

- **2. Data Series:** Series group related measurements. Each series has an editable `name`, a configurable `color` for chart representation, and a `min_value`/`max_value` range for data validation.

- **3. User Roles:** The application supports two user groups:
    - **Readers (Unauthenticated):** Can view all measurement data.
    - **Administrators (Authenticated):** Have full CRUD (Create, Read, Update, Delete) access to series and measurements.

- **4. Unauthenticated Access:** Users who are not logged in have read-only access to the data.

- **5. Administrator Privileges:** Logged-in users can manage all data, including adding, editing, and deleting series and individual measurements.

- **6. Data Validation:** The backend validates new measurements against the `min_value` and `max_value` defined for the corresponding series. Submissions outside this range are rejected with an appropriate error message.

- **7. User Experience (UX):** The frontend includes UX enhancements such as real-time input validation and the ability to submit forms by pressing the "Enter" key.

- **8. Printing:** The application features a print-friendly view. When printing, all UI elements (buttons, forms, etc.) are hidden via CSS media queries, leaving only the chart and data table for a clean report.

- **9. Password Management:** User passwords are securely hashed. Logged-in users have the ability to change their password.

- **10. Responsive Web Design (RWD):** The user interface is fully responsive and provides an optimal viewing experience across a wide range of devices, from mobile phones to desktop computers.

- **11. UI Interactivity:** Clicking on a data record in the table highlights the corresponding point on the chart, improving data analysis.

- **Optional Extension - Autonomous Sensors:** The backend includes endpoints for registered sensors to submit data directly. A Python script (`sensor_simulator.py`) is provided to demonstrate this functionality, simulating a sensor that sends locally generated data.

---

## Technical Requirements Checklist

- **1. Backend Technology:** The backend is implemented in **Node.js** with the **Express** framework.

- **2. Frontend Technology:** The frontend is a **Single Page Application (SPA)** built with **React**.

- **3. REST API & Documentation:** Communication between the frontend and backend is handled via a well-defined REST API. The API is documented using **Swagger**, and the documentation is available through the backend.

- **4. Database Design:** A relational database structure is implemented using **PostgreSQL** and the **Sequelize** ORM. The design includes appropriate data types, relationships, and foreign key constraints.

- **5. Responsive Web Design (RWD):** The frontend is designed using RWD principles, ensuring usability on various screen sizes.

- **6. Print View via CSS:** The printing functionality is implemented using CSS `@media print` queries, which modify the standard view to create a clean, paper-friendly report.

- **7. Security Aspects:** Three key security aspects have been addressed: authentication, SQL injection prevention, and secure password storage.

- **8. Public Deployment:** The application is deployed and publicly accessible.

- **9. Project Documentation & Sample Data:** This `README.md` serves as the primary documentation. The project includes a seeding script to populate the database with sample data for immediate functionality demonstration.

---

## Live Demo

The application is hosted and can be accessed at the following URL:

https://zai-project.vercel.app/

---

## Screenshots

### Login Page
![Login Page](imgs/login_page.png)

### Guest View (Read-Only)
![Guest View](imgs/guest_view.png)

### Admin View (Full CRUD) & Chart Highlights
![Admin View](imgs/admin_view+chart_highlights.png)

### Filtering Menu
![Filtering Menu](imgs/filter_menu.png)

### Adding a New Series
![Adding a New Series](imgs/series_add.png)

### Adding a New Measurement
![Adding a New Measurement](imgs/measurement_add.png)

### Changing Password
![Changing Password](imgs/password_change.png)

### Print Preview
![Print Preview](imgs/page_print_ex.png)

---

## Technology Stack

- **Backend:** Node.js, Express, Sequelize, PostgreSQL, JWT, Bcrypt.js
- **Frontend:** React, Axios, Recharts, React Router
- **API Documentation:** Swagger (OpenAPI)

---

## Database Schema

The database consists of three main tables: `Users`, `Series`, and `Measurements`.

- **Users:** Stores administrator and sensor credentials.
  - `id`: Primary Key
  - `username`: String, Unique
  - `password`: String (Hashed)

- **Series:** Defines a data series.
  - `id`: Primary Key
  - `name`: String, Unique
  - `min_value`: Float
  - `max_value`: Float
  - `color`: String (for UI)

- **Measurements:** Stores individual data points.
  - `id`: Primary Key
  - `value`: Float
  - `timestamp`: DateTime
  - `seriesId`: Foreign Key referencing `Series.id`

### Entity-Relationship Diagram (ERD)

```
+-------------+       +------------+       +----------------+
|    Users    |       |   Series   |       |  Measurements  |
+-------------+       +------------+       +----------------+
| id (PK)     |       | id (PK)    |       | id (PK)        |
| username    |       | name       |       | value          |
| password    |       | min_value  |       | timestamp      |
+-------------+       | max_value  |       | seriesId (FK)  |
                      | color      |       +----------------+
                      +------------+               |
                             |                     |
                             +---------------------+
```
*A single `Series` can have many `Measurements`.*

---

## Codebase Overview

This section provides a more detailed description of the key files and their primary functions.

### Backend (`backend/`)

-   **`server.js`**: The main entry point.
    -   **Responsibilities**: Initializes the Express server, applies middleware (CORS, JSON parsing), connects to the database via Sequelize, mounts the API routes, and starts the server. It also serves the Swagger UI.

-   **`models/User.js`**: Defines the `User` model.
    -   **Class**: `User` (extends Sequelize `Model`).
    -   **Key Methods**:
        -   `matchPassword(enteredPassword)`: Securely compares a plaintext password with the stored hash using `bcrypt.compare`.
    -   **Hooks**:
        -   `beforeCreate` & `beforeUpdate`: These hooks automatically hash the user's password before any `create` or `update` operation, ensuring no plaintext passwords are ever stored.

-   **`models/Series.js`**: Defines the `Series` model for grouping measurements.
    -   **Class**: `Series` (extends Sequelize `Model`).
    -   **Fields**:
        -   `name`: The name of the series (e.g., "Temperature").
        -   `min_value`, `max_value`: Define the valid range for measurements in this series.
        -   `color`: A hex color code for representing the series in charts.

-   **`models/Measurement.js`**: Defines the `Measurement` model.
    -   **Class**: `Measurement` (extends Sequelize `Model`).
    -   **Fields**:
        -   `value`: The numerical value of the measurement.
        -   `timestamp`: The time the measurement was recorded.
    -   **Associations**:
        -   `belongsTo(Series)`: Each measurement is associated with a single series.

-   **`controllers/userController.js`**: Handles user-related business logic.
    -   **Key Functions**:
        -   `registerUser`: Creates a new user, hashes their password, and returns a JWT.
        -   `authUser`: Authenticates a user, and if successful, returns a JWT.
        -   `changePassword`: Allows a logged-in user to change their password after verifying their old password.

-   **`controllers/seriesController.js`**: Handles logic for data series.
    -   **Key Functions**:
        -   `createSeries`: Creates a new series, validating that `min_value` is less than `max_value`.
        -   `deleteSeries`: Deletes a series and also removes all associated measurements to maintain data integrity.

-   **`controllers/measurementController.js`**: Handles business logic for measurements.
    -   **Key Functions**:
        -   `getMeasurements`: Retrieves measurements, with optional filtering by series, start date, and end date.
        -   `createMeasurement`: Creates a new measurement, validating its value against the `min_value` and `max_value` of the parent series.
        -   `updateMeasurement`: Updates a measurement, with the same validation as `createMeasurement`.
        -   `deleteMeasurement`: Deletes a measurement.

-   **`middleware/authMiddleware.js`**: Contains authentication middleware.
    -   **Function**: `protect`.
    -   **Responsibility**: Verifies the JWT provided in the `Authorization` header. If the token is valid, it decodes the user's ID and attaches the user object to the request, making it available to protected routes.

-   **`routes/userRoutes.js`**: Defines the API routes for user management.
    -   `POST /api/users/register`: Registers a new user.
    -   `POST /api/users/login`: Authenticates a user and returns a JWT.
    -   `PUT /api/users/password`: Allows a logged-in user to change their password.

-   **`routes/seriesRoutes.js`**: Defines the API routes for series management.
    -   `GET /api/series`: Retrieves all series.
    -   `POST /api/series`: Creates a new series (protected).
    -   `PUT /api/series/:id`: Updates a series (protected).
    -   `DELETE /api/series/:id`: Deletes a series (protected).

-   **`routes/measurementRoutes.js`**: Defines the API routes for measurement management.
    -   `GET /api/measurements`: Retrieves all measurements, with optional query parameters for filtering.
    -   `POST /api/measurements`: Creates a new measurement (protected).
    -   `PUT /api/measurements/:id`: Updates a measurement (protected).
    -   `DELETE /api/measurements/:id`: Deletes a measurement (protected).

-   **`config/db.js`**: Configures the database connection.
    -   **Responsibilities**: Initializes Sequelize with the database URL, and provides a `connectDB` function to authenticate and connect to the database.

-   **`config/swagger.js`**: Configures Swagger for API documentation.
    -   **Responsibilities**: Defines the Swagger options, including the API title, version, and server URL. It also specifies the files that contain the API documentation.

### Frontend (`frontend/src/`)

-   **`App.js`**: The root component.
    -   **Responsibilities**: Wraps the application in the `AuthProvider` to provide global state management for authentication. It also defines the application's routes using `react-router-dom`.

-   **`pages/DashboardPage.js`**: The main page for data visualization.
    -   **Responsibilities**: Fetches all series and measurement data. It manages the application's main state, including filters for the date range and selected series. It passes this data down to the chart and table components.

-   **`pages/LoginPage.js`**: Renders the login page.
    -   **Responsibilities**: Provides a form for users to log in as an administrator. It also includes a button to continue as a guest.

-   **`components/MeasurementChart.js`**: Renders the data chart.
    -   **Responsibilities**: Displays the measurement data using `Recharts`. It includes a custom implementation to handle printing correctly (see Key Features). It also highlights specific data points when a user clicks on a corresponding row in the table.

-   **`components/MeasurementTable.js`**: Renders the data table.
    -   **Responsibilities**: Displays measurement data in a paginated table. Allows logged-in users to delete or edit records. Emits an event when a row is clicked to enable highlighting on the chart.

-   **`components/SeriesManager.js`**: Handles CRUD operations for series.
    -   **Responsibilities**: Displays a table of all series. Provides forms for adding and editing series. Includes a confirmation dialog that warns the user if they are about to delete a series that contains measurements.

-   **`context/AuthContext.js`**: Manages global authentication state.
    -   **Responsibilities**: Provides a React Context with the current `user` object, a `login` function to authenticate and store the JWT in local storage, and a `logout` function to clear user data. This allows any component in the app to access the user's authentication status.

-   **`components/AddMeasurementForm.js`**: Provides a form for adding new measurements.
    -   **Responsibilities**: Allows users to select a series, enter a value, and specify a timestamp. It includes validation to ensure the value is within the allowed range for the selected series.

-   **`components/ChangePassword.js`**: Renders a modal for changing the user's password.
    -   **Responsibilities**: Provides fields for the old password, new password, and password confirmation. It includes validation to ensure the new passwords match and meet the minimum length requirement.

-   **`components/DataFilters.js`**: Renders the filtering options for the data.
    -   **Responsibilities**: Allows users to filter data by date range and series. It also provides checkboxes to apply the filters to the chart and/or table.

-   **`components/ManagerBox.js`**: A simple container component for styling.
    -   **Responsibilities**: Provides a consistent style for the manager boxes.

-   **`components/SeriesTable.js`**: Renders a table of all series.
    -   **Responsibilities**: Displays all series with their name, min/max values, and color. It also provides buttons for editing and deleting series.

### Root

-   **`sensor_simulator.py`**: A Python script for simulating autonomous sensors.
    -   **Responsibilities**: Simulates multiple sensors that send data to the backend API. Each sensor logs in, gets a token, and then periodically sends a random measurement to its assigned series.

---

## Key Features and Implementation Details

-   **Dual-Layer Validation**: To ensure data integrity and provide a good user experience, input is validated on both the **frontend** (for immediate feedback in the UI) and the **backend** (as a final security check before data is persisted).

-   **Secure Authentication & Authorization**: The application uses **JSON Web Tokens (JWT)** for stateless authentication. Passwords are never stored in plaintext; they are hashed using **`bcryptjs`** with a salt. Protected API routes on the backend are secured using custom middleware that verifies the JWT on every request.

-   **Enhanced User Experience (UX)**:
    -   **Efficient Data Entry**: Forms can be submitted by pressing the "Enter" key.
    -   **Safe Deletion**: Users are shown a confirmation dialog with a warning before deleting a series that contains measurement data.
    -   **Interactive Data Analysis**: Clicking a row in the measurement table highlights the corresponding point on the chart, making it easier to correlate tabular and graphical data.

-   **Printing**: A known issue with the `recharts` library can cause charts to render incorrectly when printing (https://github.com/recharts/recharts/issues/1114). This application implements a workaround using `window.addEventListener` for `beforeprint` and `afterprint` events. Before printing, the interactive chart is temporarily replaced with a static SVG image of itself, ensuring a clean and accurate printout.

-   **Responsive & Adaptive Design**: The UI is fully responsive, adapting to different screen sizes from mobile to desktop. It uses CSS media queries to adjust the layout. This is also leveraged for printing, where the aspect ratio of the chart is modified to better fit a standard portrait-oriented page.

---

## Security Aspects Addressed

1.  **Correct Authentication and Session Control:** The application uses JSON Web Tokens (JWT) for stateless authentication. Upon login, a signed token is issued to the user. This token must be included in the `Authorization` header of subsequent requests to protected endpoints. The `authMiddleware` on the backend verifies the token's validity, ensuring secure session control.

2.  **Protection Against SQL Injection:** The backend uses the **Sequelize ORM** for all database interactions. Sequelize automatically parameterizes queries, which is the standard defense against SQL injection. Raw SQL queries are not used, eliminating the risk of malicious input being executed by the database.

3.  **Secure Password Storage:** User passwords are never stored in plaintext. The application uses the **`bcryptjs`** library to hash passwords with a salt before storing them in the database. The `beforeCreate` and `beforeUpdate` hooks in the `User` model ensure that hashing is always applied.

---

## API Documentation

The backend API is documented using Swagger. Once the backend server is running, the interactive Swagger UI can be accessed at:

The backend API is documented using Swagger. Once the backend server is running, the interactive Swagger UI can be accessed at `/api-docs` on the base URL of the backend server (e.g., `http://localhost:5000/api-docs`).

---

## Local Setup and Operation

Follow these steps to run the application locally.

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js and npm:** Node.js version 14 or later is required. npm (Node Package Manager) is included with the Node.js installation.
  - **To install on Linux (Debian/Ubuntu):**
    ```bash
    sudo apt update
    sudo apt install nodejs npm
    ```
  - **For other operating systems (Windows, macOS):** Download the installer from the [official Node.js website](https://nodejs.org/).

- **PostgreSQL:** A relational database required for the backend. See the setup instructions below.

- **Docker (Optional):** Recommended for an easy PostgreSQL setup. [Install Docker](https://docs.docker.com/get-docker/).

### Local PostgreSQL Setup

You need a running PostgreSQL instance for the backend. You can either install it directly on your system or use Docker.

#### Docker Installation (Recommended)

1.  **Pull the PostgreSQL Docker image:**
    ```bash
    docker pull postgres
    ```

2.  **Run the PostgreSQL container:**
    ```bash
    docker run --name zai-postgres -e POSTGRES_USER=zai_user -e POSTGRES_PASSWORD=your_password -e POSTGRES_DB=zai_project -p 5432:5432 -d postgres
    ```
    -   Replace `your_password` with a strong password.
    -   `zai-postgres` is the name of the container.
    -   `zai_user` is the database user.
    -   `zai_project` is the database name.
    -   `-p 5432:5432` maps the container's port 5432 to your host's port 5432.

3.  **Verify the container is running:**
    ```bash
    docker ps
    ```

4.  **Update your `.env` file** in the `backend` directory with the correct `DATABASE_URL`:
    ```
    DATABASE_URL="postgresql://zai_user:your_password@localhost:5432/zai_project"
    ```
    Replace `your_password` with the password you set in step 2.

#### Native Installation (Linux)

1.  **Install PostgreSQL:**
    ```bash
    sudo apt update
    sudo apt install postgresql postgresql-contrib
    ```

2.  **Switch to the `postgres` user:**
    ```bash
    sudo -i -u postgres
    ```

3.  **Create a new user and database:**
    ```bash
    createuser --interactive # When prompted, enter a username (e.g., 'zai_user'), and make them a superuser if you wish.
    createdb zai_project
    ```

4.  **Set a password for the new user:**
    ```bash
    psql
    \password zai_user
    ```
    Enter and confirm a new password. Then exit `psql` with `\q` and the postgres user session with `exit`.

5.  **Update your `.env` file** in the `backend` directory with the correct `DATABASE_URL`.

### 1. Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the `backend` directory and populate it with your database credentials, a JWT secret, and the base URL for the server:
    ```env
    # Example for a local PostgreSQL instance
    DATABASE_URL="postgresql://postgres:password@localhost:5432/zai_project"
    JWT_SECRET="a_very_strong_and_secret_key_for_jwt"
    PORT=5000
    BASE_URL="http://localhost:5000"
    ```

4.  **Initialize the database:** Before starting the server for the first time, you need to initialize the database schema. The backend does this automatically when it starts. Simply start and then stop the server once:
    ```bash
    npm start
    # Wait for 'Database synchronized' message, then press Ctrl+C
    ```

5.  **Seed the database:** Populate the database with sample data by executing the `seed.sql` script. You will need your PostgreSQL user password.
    ```bash
    # Replace [user] and [database] with your actual credentials
    psql -U [user] -d [database] -f seed.sql
    ```
    For example, if using the Docker setup:
    ```bash
    psql -U postgres -d zai_project -f seed.sql
    ```
    **Sample Login:** `username: admin`, `password: admin`

6.  **Start the backend server:**
    ```bash
    npm start
    ```
    The server will run on the `PORT` specified in your `.env` file.

### 2. Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the `frontend` directory and add the URL of the backend API:
    ```env
    REACT_APP_API_URL=http://localhost:5000/api
    ```

4.  **Start the frontend development server:**
    ```bash
    npm start
    ```
    The React application will open in your browser.

### 3. Sensor Simulator (Optional)

1.  **Navigate to the root directory.**

2.  **Set the `API_BASE_URL` environment variable** to point to your backend API. For example:
    ```bash
    export API_BASE_URL="http://localhost:5000/api"
    ```

3.  **Run the script:**
    ```bash
    python3 sensor_simulator.py
    ```
