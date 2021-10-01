import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getTodosForUser as getTodosForUser } from '../../helpers/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('get-todos')
// DONE: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    logger.info(`received request to get user todos: ${JSON.stringify(event)}`)
    const userId = getUserId(event)
    const todos = await getTodosForUser(userId)
    return {
      statusCode: 200,
      body: JSON.stringify({
        items: todos
      })
    }
  }
)
handler.use(
  cors({
    credentials: true
  })
)
