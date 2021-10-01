import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
// import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
// import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate'


const logger = createLogger("todo-access")
const XAWS = AWSXRay.captureAWS(AWS)

function createDynamoDBClient() {
    logger.info("creating logger")
    const ddb = new XAWS.DynamoDB()
    return ddb
}

const ddb = createDynamoDBClient()


export const TodosAccess = () => {

  ddb.query()
}
