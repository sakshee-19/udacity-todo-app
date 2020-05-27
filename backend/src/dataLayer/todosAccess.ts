import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'


export class TodoAccess {
  
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly s3Bucket = process.env.IMAGES_S3_BUCKET) {
  }

  generateUrl(todoId: string) {
      console.log(" bucket name ", this.s3Bucket)
      const url = uploadUrl(this.s3Bucket, todoId)
      return url
  }

   async createTodo(todo: TodoItem): Promise<TodoItem> {
     todo.attachmentUrl = `https://${this.s3Bucket}.s3.amazonaws.com/${todo.todoId}`     
     console.log('createTodo Access', todo.attachmentUrl)
     todo.done = true 
      const newItem = {
          ...todo
      }
    
    await this.docClient.put({
      TableName: this.todosTable,
      Item: newItem
    }).promise()

    return todo
  }


  async getAllTodos(userId: string): Promise<TodoItem[]> {
    console.log('Getting all todos')

    const results = await this.docClient.query({
      TableName: this.todosTable,
      KeyConditionExpression: 'userId= :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()

    const items = results.Items
    return items as TodoItem[]
  }

  async deleteTodo(todoId: string, userId: string) {
    console.log("ids ",todoId, userId)
    const key = {
      userId: userId,
      createdAt: "2020-05-27T13:56:31.198Z",
      todoId: todoId
    }
    const data = await this.docClient.delete({
      TableName: this.todosTable,
      Key: key
    }).promise()
    return data
  }

  async updateTodo(updateTodoReq: UpdateTodoRequest, todoId: string, userId: string) {
    await this.docClient.update({
      TableName: this.todosTable,
      Key: { userId, todoId },
      UpdateExpression: "set name = :todoName, dueDate = :dueDate, done = :done",
      ExpressionAttributeValues: {
        ":dueDate": updateTodoReq.dueDate,
        ":todoName": updateTodoReq.name,
        ":done": updateTodoReq.done
      },
      ReturnValues: "UPDATED_NEW"
    }).promise()  
 }
}


function createDynamoDBClient() {
    return new AWS.DynamoDB.DocumentClient()
}

function uploadUrl(bucketName:string, todoId:string): string {
    const s3 = new AWS.S3({
        signatureVersion: 'v4'
      })

    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: todoId,
        Expires: 600
    })
}

