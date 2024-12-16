Install:
Open XAMPP and start Apache and MYSQL.

Open phpMyAdmin and create a database named project2.

Run the sql in sql.txt to create the tables.

Run your command prompt as administer and change directory to wherever XAMPP is downloaded, ie cd C:\xampp\htdocs

Clone the project locally from github: git clone https://github.com/hh1864/CSC4710-project2.git

Configure:
Change directory to the backend of the project: cd C:\xampp\htdocs\CSC4710-project2\backend and put in these commands:
npm install
npm install multer
npm install cors

Run:
Open a new terminal with and cd into the frontend directory of the project: cd C:\xampp\htdocs\CSC4710-project2\backend
npm start in both backend and frontend.
Verify that the backend and frontend are running on the eifht ports (3000 for frontend, 5000 for backend)


