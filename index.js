const express = require('express');
const app = express();
const mongoose = require('mongoose');
const swaggerUi = require("swagger-ui-express"); 
const swaggerJSDoc =require("swagger-jsdoc");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/UserManagementDB')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(express.json());


const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    dueDate: { type: String, required: true },
    status: { type: String, enum: ["TODO", "IN_PROGRESS", "DONE"], default: "TODO" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Task = mongoose.model('Task',taskSchema)

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User Management API',
            version: '1.0.0',
            description: 'API documentation for user management',
        },
        tags: [
            {
                name: 'Users',
                description: 'Operations related to users management',
            },
            {
                name: 'Users Operations',
                description: 'task Creation Operations',
            },
        ],
        components: {
            securitySchemes: {
              bearerAuth: {
                type: 'http',
                in: 'header',
                name: 'Authorization',
                description: 'Bearer Token',
                scheme: 'bearer',
                bearerFormat: 'JWT',
              },
            },
          },
          security: {
            bearerAuth: [],
          },
    },
    apis: ['./index.js'],
};



// Routes


// Middleware to authenticate the JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).send("Unauthorized - No token provided");

    jwt.verify(token, "user-login", (err, user) => {
        if (err) return res.status(403).send("Forbidden - Invalid token");
        req.user = user;
        next();
    });
};


// Creating a User
/**
     * @swagger
     * /users:
     *   post:
     *     summary: Create a new user
     *     description: Endpoint to create a new user.
     *     tags:
     *         - Users
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       '201':
     *         description: User created successfully
     *       '400':
     *         description: Bad request
     *       '500':
     *         description: Internal Server Error
*/
app.post('/users', async (req, res) => {
    
    try {
        const { username, email, password } = req.body;

        console.log(username)
        // Check if the username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        // Create a new user
        
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({ username, email, password:hashedPassword });
        await newUser.save();

        res.status(201).json(newUser);
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get All Users
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users.
 *     description: Retrieve all users from the database.
 *     tags:
 *          - Users
 *     responses:
 *       '200':
 *         description: A JSON array of all users.
 *       '500':
 *         description: Internal Server Error.
 */
app.get('/users', async (req, res) => {
    try {
        // Retrieve all users from the database
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        console.error('Error retrieving users:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get All Tasks
/**
 * @swagger
 * /Usertasks:
 *   get:
 *     summary: Get all tasks.
 *     description: Retrieve all tasks from the database.
 *     tags:
 *        - Users
 *     responses:
 *       '200':
 *         description: A JSON array of all tasks.
 *       '500':
 *         description: Internal Server Error.
 */
app.get('/Usertasks', async (req, res) => {
    try {
        // Fetch all tasks from the database
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Go to Particular User And Observe Tasks
/**
 * @swagger
 * /tasks/{username}:
 *   get:
 *     summary: Get tasks for a specific user.
 *     description: Retrieve tasks associated with a specific user from the database.
 *     tags:
 *          - Users
 *     parameters:
 *       - in: path
 *         name: username
 *         description: The username of the user to fetch tasks for.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A JSON array of tasks associated with the user.
 *       '404':
 *         description: User not found.
 *       '500':
 *         description: Internal Server Error.
 */
app.get('/tasks/:username', async (req, res) => {
    try {
        const { username } = req.params;

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch tasks associated with the user
        const tasks = await Task.find({ userId: user._id });
        res.status(200).json(tasks);
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Login as User

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Endpoint for user authentication and login.
 *     tags:
 *       - Users Operations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User authenticated successfully
 *       '401':
 *         description: Unauthorized - Invalid credentials
 *       '500':
 *         description: Internal Server Error
 */

app.post('/login', async (req,res)=>{
    try{
    const {email,password}=req.body;
    const user = await User.findOne({email})
    console.log(user)
    if(!user){
        return res.status(400).jason({error:'User not found'})
    }

    const validPassword = await bcrypt.compare(password,user.password);
    
    if(!validPassword){
        return res.status(400).json({error:'Invalid Password.Please Enter Correct Password'})
    }

    const accessToken = jwt.sign({userId:user._id},"user-login")
    res.json({accessToken:accessToken}
    )
} catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ error: 'Internal Server Error' });
}
})

// Creation Of Tasks
/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     description: Endpoint to create a new task.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users Operations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Task created successfully
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal Server Error
 */
app.post('/tasks', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { title, description, dueDate, status } = req.body;

        // Create a new task
        const newTask = new Task({ title, description, dueDate, status, userId });
        await newTask.save();

        res.status(201).json(newTask);
    } catch (err) {
        console.error('Error creating task:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch All Tasks Of Logged-in user

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get tasks for logged-in user.
 *     description: Retrieve all tasks associated with the logged-in user.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users Operations
 *     responses:
 *       '200':
 *         description: A JSON array of tasks.
 *       '401':
 *         description: Unauthorized - Invalid token.
 *       '500':
 *         description: Internal Server Error.
 */
app.get('/tasks', authenticateToken, async (req, res) => {
    try {
        // Get the user ID from the token
        const userId = req.user.userId;
        console.log(userId)
        // Find all tasks associated with the user ID
        const tasks = await Task.find({ userId: userId });

        res.status(200).json(tasks);
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Update the status of task
/**
 * @swagger
 * /tasks/{taskId}/status:
 *   put:
 *     summary: Update task status for a specific user.
 *     description: Update the status of a task associated with a specific user. 
 *     security:
 *         - bearerAuth : []
 *     tags:
 *         - Users Operations
 *     parameters:
 *       - in: path
 *         name: taskId
 *         description: ID of the task to update.
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         description: New status for the task ('TODO', 'IN_PROGRESS', 'DONE').
 *         required: true
 *         schema:
 *           type: string
 *           enum: [TODO, IN_PROGRESS, DONE]
 *     responses:
 *       '200':
 *         description: Task status updated successfully.
 *       '400':
 *         description: Bad request.
 *       '401':
 *         description: Unauthorized - Invalid token.
 *       '403':
 *         description: Forbidden - Access denied.
 *       '404':
 *         description: Task not found.
 *       '500':
 *         description: Internal Server Error.
 */
app.put('/tasks/:taskId/status', authenticateToken, async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status } = req.query;
        console.log(status)
        // Find the task by ID
        const task = await Task.findById(taskId);
        console.log(task)
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Update task status if provided
        if (!['TODO', 'IN_PROGRESS', 'DONE'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }
        task.status = status;

        // Save the updated task
        await task.save();

        res.status(200).json({ message: 'Task status updated successfully' });
    } catch (err) {
        console.error('Error updating task status:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



const swaggerSpec=swaggerJSDoc(options)
// Swagger UI endpoint
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
