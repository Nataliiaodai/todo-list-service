const bodyParser = require('body-parser');
const cors = require('cors');
const express = require("express")
const app = express()



app.use(cors());
app.use(bodyParser?.json());


const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/todolist', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const schema = mongoose.Schema({
    taskName: String,
    isDone: Boolean,
    isStarred: Boolean
})

const TaskMongooseModel = mongoose.model("model", schema, "tasks");

app.post('/tasks', async (req, res) => {
    console.log("Request body", req.body)
    let task = new TaskMongooseModel(req.body);
    try {
        const savedTask = await task.save();
        console.log("savedTask", savedTask);

        const responseBody = {};
        Object.assign(responseBody, savedTask._doc);
        responseBody["taskId"] = savedTask._id;
        delete responseBody["_id"];
        delete responseBody["__v"];
        console.log("responseBody", responseBody);

        res.status(201).json(responseBody);
        console.log("Document inserted succussfully!");
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
})


app.get('/tasks', async (req, res) => {
    try {
        const tasks = await TaskMongooseModel.find({}).exec();
        // console.log("Get tasks---", tasks);
        res.status(200).send(tasks);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


app.get('/tasks/:id', async (req, res) => {
    const {id} = req.params;
    const task = await TaskMongooseModel.findOne({_id: id});
    // console.log("Get tasks by Id ---", task);
    // console.log(" tasks Id---", id);

    if(!task) {
        return res.status(404).json({message: `Task with id ${id} not found. `});
    }

    return res.status(200).json({data: task});
})


app.put('/tasks/:id', async (req, res) => {
    console.log("req.body BEFORE---", req.body);
    const { id } = req.params;
    const { taskName, isDone, isStarred } = req.body;

    const task = await TaskMongooseModel.findOne({ _id: id });

    if (!task) {
        return res.status(404).json({ message: `Task with id "${id}" not found.` });
    }

    if (!taskName) {
        return res.status(422).json({ message: 'The field taskName is required' });
    }

    await TaskMongooseModel.updateOne({ _id: id }, { taskName, isDone, isStarred });
     const taskUpdated = await TaskMongooseModel.findById(id);

    console.log("taskUpdated---", taskUpdated);
    return res.status(200).json({ data: taskUpdated });
});


app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;

    await TaskMongooseModel.findByIdAndDelete(id);

    return res.status(200).json({ message: `Task with id "${id}" deleted successfully.` });
});


// app.get('/tasks', (req, res) => {
//     let tasksToReturn: TaskModel[] = taskService.getTasks()
//
//     if (!tasksToReturn) {
//         res.status(404).json({error: 'No tasks found'});
//     } else {
//         res.status(200).json(tasksToReturn);
//     }
//
// })
//
//
// app.post('/tasks', (req, res) => {
//     const createdTask: TaskModel = taskService.createTask(req.body);
//
//     if (createdTask) {
//         res.status(201).json(createdTask);
//     } else {
//         res.status(404).json({error: 'Invalid request'});
//     }
// })
//
//
//
// app.put('/tasks/:taskId', (req, res) => {
//     const taskId: number = Number(req.params.taskId);
//     const changedTask = taskService.changeTaskById(taskId, req.body);
//
//     if (changedTask) {
//         res.json(changedTask);
//     } else {
//         res.status(404).json({error: `task with id: ${taskId}  NOT FOUND`});
//     }
//
// })
//
//
// app.delete('/tasks/:taskId', (req, res) => {
//     const taskId: number = Number(req.params.taskId);
//     let deletedTask: TaskModel = taskService.deleteTaskById(taskId);
//
//     if (deletedTask) {
//         res.json(deletedTask);
//     } else {
//         res.status(404).json({error: `product with id: ${taskId}  NOT FOUND`});
//     }
//
// })
//

app.listen(10000, function () {
    console.log("Started application on port %d", 10000)
});







