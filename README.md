# User Management Backend System

This is a RESTful API for user management and task management built using Express.js, Mongoose, JWT, bcrypt, and Swagger for API documentation.

## Want to see how the Swagger-docx looks like 
![image](https://github.com/rakesh4902/todotasksmanagement-backend/assets/83058036/056d1485-e569-409e-bae0-5ca4cbb4df23)


## User Management Backend:

### Database Setup:

- Utilizes two MongoDB databases: UserManagementDB and TaskManagementDB.
- UserManagementDB contains a users collection for storing user data.
- TaskManagementDB contains a tasks collection for storing task data.

### User Registration:

- Users register by sending a POST request to `/users` with username, email, and password.
- Backend checks uniqueness of username and email, hashes the password, and stores user data in users collection of UserManagementDB.

### Viewing All Users:

- User management backend can view all registered users by sending a GET request to `/users`.
- Retrieves all user data from the users collection of UserManagementDB.

### Viewing All Tasks:

- User management backend can view all tasks created by all users by sending a GET request to `/Usertasks`.
- Fetches all tasks from the tasks collection of TaskManagementDB.

### Viewing Tasks of a Specific User:

- User management backend can view tasks associated with a specific user by sending a GET request to `/tasks/{username}`.
- Retrieves tasks associated with the specified username from the tasks collection of TaskManagementDB.

## User Interaction:

### User Login:

- Users authenticate themselves by sending a POST request to `/login` with their email and password.
- Backend verifies the provided credentials, generates a JWT token upon successful authentication, and sends it back to the user.
- The JWT token is used for authorization in subsequent requests.

### Creation of Tasks:

- Authenticated users can create tasks by sending a POST request to `/tasks`.
- The request must include the task details such as title, description, due date, and status.
- Backend associates the task with the logged-in user and stores it in the tasks collection of TaskManagementDB.
- Upon successful creation, the backend responds with a status code 201 and the created task details.

### Fetching All Tasks of Logged-in User:

- Authenticated users can retrieve all tasks associated with them by sending a GET request to `/tasks`.
- Backend extracts the user ID from the JWT token, retrieves all tasks associated with that user from the database, and sends them back to the user.
- Users can view the tasks they have created along with their details such as title, description, due date, and status.

### Updating Task Status:

- Authenticated users can update the status of a task by sending a PUT request to `/tasks/{taskId}/status`.
- The request must include the task ID in the URL path and the new status as a query parameter.
- Backend verifies the user's authorization using the JWT token and ensures that the provided status is valid (TODO, IN_PROGRESS, DONE).
- If the task exists and the status is valid, the backend updates the task's status in the database and responds with a status code 200 and a success message.
- If the task does not exist or the provided status is invalid, appropriate error responses are sent back to the user.


## Using the Application on Your Own PC

### Setting Up the Backend

To use the application on your own PC, follow these steps to set up the backend:

### Prerequisites:

- Install Node.js: 
  - Download and install Node.js from [here](https://nodejs.org/).

- Install MongoDB: 
  - Download and install MongoDB Community Server from [here](https://www.mongodb.com/try/download/compass).

### Installation and Setup:

#### 1. Download the Code:
- First, download the zip file containing the application code from the GitHub repository.

#### 2. Unzip the File:
- Unzip the downloaded file to access the application code.

#### 3. Open with VS Code:
- Open the unzipped folder using any code editor, such as Visual Studio Code.

#### 4. npm install
- Run the command for installing the required packages

### 5. Replace MONGODB_URI
- After installation of mongoDB Compass open it and you will see one uri to connect(ex:mongodb://localhost:27017/UserManagementDB) now click on connect and paste that uri in the MONGODB_URI value which is located in index.js page.
  
#### 5. npm start
- Now Run this command to start with the application

Runs the app in the development mode.\
Open [http://localhost:3000/api-docs/#/](http://localhost:3000/api-docs/#/) to view it in your browser.

### API Interaction in Swagger UI

## API Documentation

### User Management Backend 

#### User Registration

#### Endpoint: POST /users

Creates a new user in the system.

**Request Body:**
```json
{
  "username": "example_user",
  "email": "user@example.com",
  "password": "password"
}

```
**Response:**
- Status: 200 OK
- Body: 
```json
{
  "_id": "6092e1fa86bebb001fc4ab4a",
  "username": "example_user",
  "email": "user@example.com",
  "password": "$2b$10$btVlNKlI7yMvn2sYF62Ke.HiI9hs2.."
}
 ```

#### Get All Users

#### Endpoint: GET /users

Retrieves all users from the database.

**Response:**
- Status: 200 OK
- Body: Array of user objects
```json
[
  {
    "_id": "6092e1fa86bebb001fc4ab4a",
    "username": "example_user",
    "email": "user@example.com",
    "password": "$2b$10$btVlNKlI7yMvn2sYF62Ke.HiI9hs2.."
  },
  {
    "_id": "6092e1fa86bebb001fc4ab4b",
    "username": "another_user",
    "email": "anotheruser@example.com",
    "password": "$2b$10$btVlNKlI7yMvn2sYF62Ke.HiI9hs2.."
  },
  ...
]
```

#### Get All Tasks

#### Endpoint: GET /Usertasks

Retrieves all tasks from the database.

**Response:**
- Status: 200 OK
- Body: Array of task objects
```json
[
  {
    "_id": "6092e1fa86bebb001fc4ab4c",
    "title": "Task 1",
    "description": "Description of Task 1",
    "dueDate": "2024-04-10",
    "status": "TODO",
    "userId": "6092e1fa86bebb001fc4ab4a"
  },
  {
    "_id": "6092e1fa86bebb001fc4ab4d",
    "title": "Task 2",
    "description": "Description of Task 2",
    "dueDate": "2024-04-12",
    "status": "IN_PROGRESS",
    "userId": "6092e1fa86bebb001fc4ab4a"
  },
  ...
]

```
#### Get Tasks for a Specific User

#### Endpoint: GET /tasks/{username}

Retrieves tasks associated with a specific user from the database.

**Parameters:**
- username: The username of the user to fetch tasks for.

**Response:**
- Status: 200 OK
- Body: Array of task objects
```json
[
  {
    "_id": "6092e1fa86bebb001fc4ab4c",
    "title": "Task 1",
    "description": "Description of Task 1",
    "dueDate": "2024-04-10",
    "status": "TODO",
    "userId": "6092e1fa86bebb001fc4ab4a"
  },
  {
    "_id": "6092e1fa86bebb001fc4ab4d",
    "title": "Task 2",
    "description": "Description of Task 2",
    "dueDate": "2024-04-12",
    "status": "IN_PROGRESS",
    "userId": "6092e1fa86bebb001fc4ab4a"
  },
  ...
]

```

### User Interaction

#### User Login

#### Endpoint: POST /login

Authenticates the user and generates a JWT token for authorization.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Response:**
- Status: 200 OK
- Body: Array of task objects
```json
{
  "accessToken": "<generated JWT token>"
}

```
### Note : Use this access token to authorize click on authorize button in right-end of swagger docx and paste this access token then click on authorize button.

#### Create Task

#### Endpoint: POST /tasks

Creates a new task.

**Request Body:**
```json
{
  "title": "Task Title",
  "description": "Task Description",
  "dueDate": "2024-04-10",
  "status": "TODO"
}
```
**Response:**
- Status: 201 Created
- Body:
```json
{
  "_id": "6092e1fa86bebb001fc4ab4a",
  "title": "Task Title",
  "description": "Task Description",
  "dueDate": "2024-04-10",
  "status": "TODO",
  "userId": "<user_id>"
}
```

#### Get All Tasks

#### Endpoint: GET /tasks

Retrieves all tasks from the database.

**Response:**
- Status: 200 OK
- Body:
```json
[
  {
    "_id": "6092e1fa86bebb001fc4ab4a",
    "title": "Task Title 1",
    "description": "Task Description 1",
    "dueDate": "2024-04-10",
    "status": "TODO",
    "userId": "<user_id>"
  },
  {
    "_id": "6092e1fa86bebb001fc4ab4b",
    "title": "Task Title 2",
    "description": "Task Description 2",
    "dueDate": "2024-04-11",
    "status": "IN_PROGRESS",
    "userId": "<user_id>"
  },
  ...
]

```

### Update Task Status

#### Endpoint: PUT /tasks/{taskId}/status

Updates the status of a specific task.

**Request Parameters:**
- taskId (path): The ID of the task to update.

**Query Parameters:**
- status (query): The new status for the task. Valid values are 'TODO', 'IN_PROGRESS', or 'DONE'.

**Response:**
- Status: 200 OK
- Body:
```json
{
  "message": "Task status updated successfully"
}

```




