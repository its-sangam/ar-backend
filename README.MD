# Artist Backend

Artist Backend is a Node.js and Express-based backend application that uses MySQL as its database. This backend is designed to handle data management and API requests for an artist management system.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (LTS)
- **MySQL** (LTS)
- **npm** or **yarn**

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/its-sangam/ar-backend
   ```

2. **Navigate to the project directory:**

   ```bash
   cd ar-backend
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

## Configuration

1. **Copy a `.env.example` as `.env`** in the root directory of the project:

2. **Modify the variables accoridng to your local mysql setup**(Use the database name you created on mysql)
3. **Create an `uploads` folder** in the root directory of the project to store the uploaded files.

## Running the Application
1. **Run the migrations:**

   ```bash
   npm run migrate
   ```

   or

   ```bash
   yarn migrate
   ```

2. **Start the development server:**

   ```bash
   npm run dev
   ```

   or

   ```bash
   yarn dev
   ```

3. The application will run on `http://localhost:5000` (or the port specified in your `.env` file).

<!-- 
## Postman API Testing

After setting up the server, you can import the `ar-collection.json` file into Postman to see and test the API endpoints.

- **To import the collection:**
  - Open Postman.
  - Go to **File > Import**.
  - Select the `ar-collection.json` file and import it.

This will provide you with all available API endpoints for testing the application. -->
