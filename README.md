========================================================================
EECS 4413 Project Submission
Dongling Yu 219511039
Yifei Liu 218968735
Hang Chen 218426106
Li Sha Su 213581772
========================================================================
1. SOURCE CODE REPOSITORY
------------------------------------------------------------------------
The complete source code is hosted on GitHub (Public):
https://github.com/dyu55/eecs4413
sneaker
store
_
_
2. INSTRUCTIONS TO DOWNLOAD SOURCE CODE
------------------------------------------------------------------------
To download the source code, please open a terminal and run:
git clone https://github.com/dyu55/eecs4413
sneaker
_
_
store.git
3. SQL SCRIPTS LOCATION
------------------------------------------------------------------------
The database initialization scripts (schema and data) are located in the
backend resource directory:
- Path in Repository:
/backend/sneaker
store
backend/src/main/resources/
_
_
- Files:
- schema.sql (Table creation)
- data.sql (Initial data seeding)
- Direct GitHub Link:
https://github.com/dyu55/eecs4413
sneaker
store/tree/main/backend/sneaker
store
_
_
_
_
src/main/resources
backend/
4. ONLINE DEPLOYMENT (CLOUD URL)
------------------------------------------------------------------------
The application is deployed on the cloud (Frontend on Vercel, Backend on Render, Database on
Railway).
- Access the Application here:
https://eecs4413-sneaker-store-deploy.vercel.app
5. ADMIN CREDENTIALS
------------------------------------------------------------------------
To access the Admin Dashboard:
- Username/Email: demo@sneakerstore.test
- Password: password
6. LOCALHOST RUN INSTRUCTIONS
------------------------------------------------------------------------
Prerequisites:
- Java 21 (or compatible JDK)
- Node.js & npm
- MySQL Server (running locally on port 3306)
[Step 1: Database Setup]
1. Create a local MySQL database named 'sneaker
store'
.
_
2. The backend will automatically initialize tables using 'schema.sql'
.
[Step 2: Backend Setup]
1. Navigate to the backend directory:
cd eecs4413
sneaker
store/backend/sneaker
store
_
_
_
_
backend
2. Configure environment variables (or update application.properties):
(Ensure DB
_
URL points to jdbc:mysql://localhost:3306/sneaker
_
store)
3. Run the Spring Boot application:
./gradlew bootRun
[Step 3: Frontend Setup]
1. Open a new terminal and navigate to the frontend directory:
cd eecs4413
sneaker
store/frontend
_
_
2. Install dependencies:
npm install
3. Start the development server:
npm run dev
4. Open your browser at http://localhost:5173
