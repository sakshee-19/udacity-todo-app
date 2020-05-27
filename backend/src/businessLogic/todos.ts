import * as uuid from 'uuid'
import { TodoItem } from '../models/TodoItem';
import { parseUserId } from '../auth/utils';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { TodoAccess } from '../dataLayer/todosAccess'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';

const todoAccess = new TodoAccess()

export async function createTodos(todoItemRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {
    const itemId = uuid.v4()
    const userId = parseUserId(jwtToken)
    const date = new Date().toISOString()

    const createTodoItem: TodoItem = {
        userId: userId,
        todoId: itemId,
        createdAt: date,
        name: todoItemRequest.name,
        dueDate: todoItemRequest.dueDate,
        attachmentUrl: "url",
        done: false
    }

    return await todoAccess.createTodo(createTodoItem)
}

export function generateUploadUrl(todoId: string):string {
    return todoAccess.generateUrl(todoId)
}

 export async function getAllTodos(jwtToken: string) : Promise<TodoItem[]> {
    const userId = parseUserId(jwtToken)
    return await todoAccess.getAllTodos(userId)
}

export async function updateTodo(updateTodoReq: UpdateTodoRequest, todoId: string, jwtToken: string) {
    const userId = parseUserId(jwtToken)
    const key = {
        todoId: todoId,
        userId: userId
    }
    console.log('key ', key);
    return await todoAccess.updateTodo(updateTodoReq, todoId, userId)
}

export async function deleteTodo(todoId: string, jwtToken: string) {
    const userId = parseUserId(jwtToken)
    return await todoAccess.deleteTodo(todoId, userId)
}