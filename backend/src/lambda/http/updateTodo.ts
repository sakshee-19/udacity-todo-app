import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
import { updateTodo } from '../../businessLogic/todos'

const logger = createLogger('update todo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('processing event', {event: event})
  try {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

    const authorization = event.headers.Authorization
    const jwtToken = authorization.split(' ')[1]

    const item = await updateTodo(updatedTodo, todoId, jwtToken)

    return{
      statusCode: 200,
      headers: {
        'Access-control-allow-Origins':'*'
      },
      body: JSON.stringify(item)
    }

  
  } catch(e){
    logger.info('provide auth token ', e.message)
  return undefined
  }

}
