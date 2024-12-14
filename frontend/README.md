# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

SQL:
CREATE TABLE Clients (  

clientid INT PRIMARY KEY AUTO_INCREMENT,   

firstname VARCHAR(100), 

lastname VARCHAR(100),  

address VARCHAR(255),  

creditcard VARCHAR(255),  

phonenumber VARCHAR(15),  

email VARCHAR(100) UNIQUE, 

password VARCHAR(255) 

); 

 

CREATE TABLE Requests (  

requestid INT PRIMARY KEY AUTO_INCREMENT, 

clientid INT, 

address VARCHAR(255), 

drivewaysize INT, 

price DECIMAL(10, 2), 

note TEXT, 

status ENUM('pending', 'negotiating', 'agreed', 'denied') NOT NULL, 

FOREIGN KEY (clientid) REFERENCES Clients(clientid)  

); 

 

CREATE TABLE Responses ( 

responseid INT PRIMARY KEY AUTO_INCREMENT, 

requestid INT, 

counterprice DECIMAL(10, 2), 

timestart DATETIME,  

timeend DATETIME,  

responsenote TEXT, 

status ENUM('pending', 'negotiating', 'agreed', 'denied') NOT NULL, 

FOREIGN KEY (requestid) REFERENCES Requests(requestid) 

 ); 

 

CREATE TABLE Orders (  

orderid INT AUTO_INCREMENT PRIMARY KEY,  

responseid INT,  

startdate DATE,  

enddate DATE,  

agreedprice DECIMAL(10,2), 

status ENUM('pending', 'completed'), 

FOREIGN KEY (responseid) REFERENCES Responses(responseid) 

); 

 

CREATE TABLE Bills (  

billid INT PRIMARY KEY AUTO_INCREMENT,  

orderid INT,  

note TEXT, 

amount DECIMAL(10, 2),  

status ENUM('pending', 'negotiating', 'agreed', 'denied') NOT NULL, 

FOREIGN KEY (orderid) REFERENCES Orders(orderid)  

); 

 

CREATE TABLE Pictures (  

picid INT AUTO_INCREMENT PRIMARY KEY, 

requestid INT, 

picurl VARCHAR(255), 

FOREIGN KEY (requestid) REFERENCES Requests(requestid) 

); 