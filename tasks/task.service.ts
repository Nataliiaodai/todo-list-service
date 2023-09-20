

import {TaskModel} from "./task.model";

export class TaskService {
    readonly tasks: TaskModel[] = [];
    private maxId: number = 0;

    createTask(source: TaskModel) {
        console.log('source = ', source);
        if (source.taskName === '') {
            return;
        }

        let createdTask: TaskModel;
        this.maxId += 1;
        source.taskId = this.maxId;

        this.tasks.push(source);
        createdTask = source;

        return createdTask;
    }

    getTasks(): TaskModel[] {
            if (this.tasks.length > 0) {
                return this.tasks;
            } else {
                return [];
            }
    }

    getTaskById(id: number): TaskModel {
        for (let task of this.tasks) {
            if (task.taskId === id) {
                return task;
            }
        }
    };

    changeTaskById(id: number, source: TaskModel ){
        let changedTask: TaskModel;
        // console.log(createdTask);
        const taskToChange: TaskModel = this.getTaskById(id);

        if (taskToChange) {
            source.taskId = id;
            changedTask = Object.assign(taskToChange, source)
        }

        return changedTask;

    }

    deleteTaskById(id: number):TaskModel {
        for (let i = 0; i < this.tasks.length; i += 1) {
            let deletedTask: TaskModel = this.tasks[i];
            if (this.tasks[i].taskId === id) {
                this.tasks.splice(i, 1);
                console.log(`Task with id ${id} was successful deleted.`);
                return deletedTask;
            }
        }
        console.log('there is no task with such id');
    }


}