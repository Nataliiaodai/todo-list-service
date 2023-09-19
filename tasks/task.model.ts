export class  TaskModel{
    taskId: number;
    taskName: string;
    isDone: boolean;
    isStarred: boolean;


    constructor(taskId: number = 0, taskName: string = '', isDone: boolean = false, isStarred: boolean = false) {
        this.taskId = taskId;
        this.taskName = taskName;
        this.isDone = isDone;
        this.isStarred = isStarred;
    }

}