import * as uuid from 'uuid'
import { TodoItem } from '../models/TodoItem';
import { parseUserId } from '../auth/utils';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { TodoAccess } from '../dataLayer/todosAccess'

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