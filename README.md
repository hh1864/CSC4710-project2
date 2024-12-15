# CSC4710-project2


-- Create the database
CREATE DATABASE project 2;

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

  

CREATE TABLE Quotes(   

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

  FOREIGN KEY (requestid) REFERENCES Quotes(requestid) 

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

  FOREIGN KEY (requestid) REFERENCES Quotes(requestid)   

); 
