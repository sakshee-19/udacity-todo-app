import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'


export class TodoAccess {
    
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly s3Bucket = process.env.IMAGES_BUCKET) {
  }

//   async getAllGroups(): Promise<Group[]> {
//     console.log('Getting all groups')

//     const result = await this.docClient.scan({
//       TableName: this.groupsTable
//     }).promise()

//     const items = result.Items
//     return items as Group[]
//   }

  async generateUrl(todoId: string) {
      const url = uploadUrl(todoId, this.s3Bucket)
      return {
        uploadUrl: url
      }
  }

   async createTodo(todo: TodoItem): Promise<TodoItem> {
     todo.attachmentUrl = `https://${this.s3Bucket}.s3.amazonaws.com/${todo.todoId}`
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

