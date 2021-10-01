import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import * as createHttpError from 'http-errors'
import { BadRequest, NotFound } from 'http-errors'
import { TODOS_CREATED_AT_INDEX, TODOS_TABLE } from '../config/config'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoUpdate } from '../models/TodoUpdate'

const logger = createLogger('todo-access')
const client: DocumentClient = new AWS.DynamoDB.DocumentClient({
  service: new AWS.DynamoDB()
})

// ugly solution to this problem 🥲
// https://github.com/aws/aws-sdk-js/issues/1846
AWSXRay.captureAWSClient((client as any).service)

export const findTodosForUser = async (userId: string) => {
  if (!userId) {
    throw createHttpError(BadRequest, 'user id is required')
  }
  const todos = await client
    .query({
      TableName: TODOS_TABLE,
      IndexName: TODOS_CREATED_AT_INDEX,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    })
    .promise()
  return todos.Items as Array<TodoItem>
}

export const findTodosByIdAndUserId = async (
  todoId: string,
  userId: string
) => {
  if (!todoId) {
    throw createHttpError(BadRequest, 'todo id is required')
  }
  const todos = await findTodosForUser(userId)
  const todo = todos.filter((t) => t.todoId === todoId)
  if (todo.length != 1) {
    throw createHttpError(
      NotFound,
      `Todo with id ${todoId} not found for user ${userId}`
    )
  }
  return todo[0]
}

export const createTodoInDatabase = async (t: TodoItem) => {
  const res = await client
    .put({
      TableName: TODOS_TABLE,
      Item: t
    })
    .promise()

  logger.info(`creating todo: ${res}`)
  return t
}

export const updateTodoIdDatabase = async (
  todoId: string,
  userId: string,
  req: TodoUpdate
) => {
  return await client
    .update({
      TableName: TODOS_TABLE,
      Key: {
        userId,
        todoId
      },
      UpdateExpression: 'set done = :done, dueDate = :dueDate, #name = :name',
      ExpressionAttributeNames: {
        "#name": "name"
      },
      ExpressionAttributeValues: {
        ':done': req.done,
        ':dueDate': req.dueDate,
        ':name': req.name
      }
    })
    .promise()
}

export const setAttachmentUrl  = async (
  todoId: string,
  userId: string,
  attachmentUrl: string
) => {
  return await client
    .update({
      TableName: TODOS_TABLE,
      Key: {
        userId,
        todoId
      },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl,
      }
    })
    .promise()
}

export const deleteTodoByTodoId = async (userId: string, todoId: string) => {
  await client
    .delete({
      TableName: TODOS_TABLE,
      Key: {
        userId,
        todoId
      }
    })
    .promise()
}
