import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import { v4 } from 'uuid'
import {
  createTodoInDatabase,
  deleteTodoByTodoId,
  findTodosByIdAndUserId,
  findTodosForUser,
  setAttachmentUrl,
  updateTodoIdDatabase
} from './todosAcess'
import * as createHttpError from 'http-errors'
import { NotFound } from 'http-errors'
import { formatAttachmentName, getPresingedUrl } from './attachmentUtils'

const logger = createLogger('todo-service')

// TODO: Implement businessLogic
export const createTodo = async (userId: string, req: CreateTodoRequest) => {
  logger.info(`create new todo: ${req} for user ${userId}`)
  const newTodo: TodoItem = {
    userId: userId,
    todoId: v4(),
    createdAt: new Date().toISOString(),
    name: req.name,
    dueDate: req.dueDate,
    done: false,
    attachmentUrl: null
  }

  return await createTodoInDatabase(newTodo)
}

export const updateTodo = async (
  todoId: string,
  userId: string,
  req: UpdateTodoRequest
) => {
  logger.info(`update todo: ${req}`)
  const todo = await findTodosByIdAndUserId(todoId, userId)
  if (!todo) {
    throw createHttpError(NotFound, 'Todo not found')
  }

  updateTodoIdDatabase(todoId, userId, {
    name: req.name || todo.name,
    dueDate: req.dueDate || todo.dueDate,
    done: req.done || todo.done
  })

  return await findTodosByIdAndUserId(todoId, userId)
}

export const getTodosForUser = async (userId: string) => {
  logger.info(`getting todoes for user ${userId}`)
  const todos = await findTodosForUser(userId)
  logger.info(`found the following todos: ${JSON.stringify(todos)}`)
  return todos
}

export const deleteTodo = async (todoId: string, userId: string) => {
  const todo = await findTodosByIdAndUserId(todoId, userId)
  logger.info(`delete todo ${todoId} for user ${userId}: ${todo}`)
  return await deleteTodoByTodoId(userId, todoId)
}

export const createAttachmentPresignedUrl = async (
  todoId: string,
  userId: string
): Promise<String> => {
  logger.info(`creating attachment url for todo ${todoId} and user ${userId}`)
  await findTodosByIdAndUserId(todoId, userId)
  const url = await getPresingedUrl(todoId)
  // this is not 100% reliable: should double check that the file has actually been uploaded
  await setAttachmentUrl(todoId, userId, formatAttachmentName(todoId))
  return url
}
