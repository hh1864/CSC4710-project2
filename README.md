# CSC4710-project2


-- Create the database
CREATE DATABASE DrivewaySealingDB;
USE DrivewaySealingDB;

-- Clients table
CREATE TABLE Clients (
    ClientID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Address VARCHAR(255) NOT NULL,
    CreditCardInfo VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(15) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    RegistrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quotes table
CREATE TABLE Quotes (
    QuoteID INT AUTO_INCREMENT PRIMARY KEY,
    ClientID INT NOT NULL,
    PropertyAddress VARCHAR(255) NOT NULL,
    SquareFeet INT NOT NULL,
    ProposedPrice DECIMAL(10, 2) NOT NULL,
    Pictures TEXT NOT NULL, -- Store picture URLs or file paths
    Note TEXT,
    ResponseStatus ENUM('Pending', 'Rejected', 'Accepted', 'Negotiation', 'Closed') DEFAULT 'Pending',
    CounterPrice DECIMAL(10, 2),
    WorkTimeWindow VARCHAR(50),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ClientID) REFERENCES Clients(ClientID)
);

-- Orders table
CREATE TABLE Orders (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    QuoteID INT NOT NULL,
    ClientID INT NOT NULL,
    OrderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    WorkStatus ENUM('Scheduled', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
    FOREIGN KEY (QuoteID) REFERENCES Quotes(QuoteID),
    FOREIGN KEY (ClientID) REFERENCES Clients(ClientID)
);

-- Bills table
CREATE TABLE Bills (
    BillID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT NOT NULL,
    ClientID INT NOT NULL,
    Amount DECIMAL(10, 2) NOT NULL,
    Status ENUM('Pending', 'Paid', 'Disputed') DEFAULT 'Pending',
    Notes TEXT,
    GeneratedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (ClientID) REFERENCES Clients(ClientID)
);

-- Negotiation responses table (for tracking negotiation history)
CREATE TABLE Negotiations (
    NegotiationID INT AUTO_INCREMENT PRIMARY KEY,
    QuoteID INT NOT NULL,
    ClientID INT NOT NULL,
    ResponseType ENUM('Quote', 'Bill') NOT NULL,
    Note TEXT,
    ResponseDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (QuoteID) REFERENCES Quotes(QuoteID),
    FOREIGN KEY (ClientID) REFERENCES Clients(ClientID)
);
