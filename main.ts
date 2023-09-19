import {TaskModel} from "./tasks/task.model";
import {TaskService} from "./tasks/task.service";

const taskService = new TaskService();
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require("express")
const app = express()

app.use(cors());
app.use(bodyParser.json());
app.get("/",function(request,response){
    response.send("Hello World!")
})



app.get('/tasks', (req, res) => {
    let tasksToReturn: TaskModel[] = taskService.getTasks()
    // res.status(200).json({});
    if (!tasksToReturn) {
        res.status(404).json({error: 'No tasks found'});
    } else {
        res.status(200).json(tasksToReturn);
    }
})


app.post('/tasks', (req, res) => {
    const createdTask: TaskModel = taskService.createTask(req.body);

    if (createdTask) {
        res.status(201).json(createdTask);
    } else {
        res.status(404).json({error: 'Invalid request'});
    }
})


app.put('/tasks/:taskId', (req, res) => {
    const taskId: number = Number(req.params.taskId);
    const changedTask = taskService.changeTaskById(taskId, req.body);

    if (changedTask) {
        res.json(changedTask);
    } else {
        res.status(404).json({error: `task with id: ${taskId}  NOT FOUND`});
    }

})


app.delete('/tasks/:taskId', (req, res) => {
    const taskId: number = Number(req.params.taskId);
    let deletedTask: TaskModel = taskService.deleteTaskById(taskId);

    if (deletedTask) {
        res.json(deletedTask);
    } else {
        res.status(404).json({error: `product with id: ${taskId}  NOT FOUND`});
    }

})


app.listen(10000, function () {
    console.log("Started application on port %d", 10000)
});