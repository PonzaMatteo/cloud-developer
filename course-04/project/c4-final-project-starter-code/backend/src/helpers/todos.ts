import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import { v4 } from 'uuid'

const logger = createLogger('todo-service')

// TODO: Implement businessLogic
export const createTodo = (userId, req: CreateTodoRequest) => {
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
  //TODO: connect to db
  return newTodo
}

export const updateTodo = (
  todoId: string,
  userId: string,
  req: UpdateTodoRequest
) => {
  logger.info(`update todo: ${req}`)
  const newTodo: TodoItem = {
    userId,
    todoId: todoId,
    createdAt: new Date().toISOString(),
    name: req.name,
    dueDate: req.dueDate,
    done: req.done,
    attachmentUrl: null
  }
  //TODO: connect to db
  return newTodo
}

export const getTodosForUser = (userId: String) => {
  logger.info(`getting todoes for user ${userId}`)
  return {
    items: [
      {
        todoId: '123',
        createdAt: '2019-07-27T20:01:45.424Z',
        name: 'Buy milk',
        dueDate: '2019-07-29T20:01:45.424Z',
        done: false,
        attachmentUrl: 'http://example.com/image.png'
      },
      {
        todoId: '456',
        createdAt: '2019-07-27T20:01:45.424Z',
        name: 'Send a letter',
        dueDate: '2019-07-29T20:01:45.424Z',
        done: true,
        attachmentUrl: 'http://example.com/image.png'
      }
    ]
  }
}

export const deleteTodo = (todoId: String, userId: string) => {
  logger.info(`delete todo ${todoId} for user ${userId}`)
}

export const createAttachmentPresignedUrl = async (todoId: string, userId: string): Promise<String> => {
    logger.info(`creating attachment url for todo ${todoId} and user ${userId}`)
    return Promise.resolve("test-test")
}