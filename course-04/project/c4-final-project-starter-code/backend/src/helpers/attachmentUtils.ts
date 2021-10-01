import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { ATTACHMENT_S3_BUCKET } from '../config/config'

export const getPresingedUrl = async (todoId: string) => {
  const client = getClient()
  return await client.getSignedUrlPromise('putObject', {
    Bucket: ATTACHMENT_S3_BUCKET,
    Key: formatKey(todoId),
    Expires: 3600
  }, )
}

let client: AWS.S3 = undefined
const getClient = () => {
  if (client) return client
  client = new AWS.S3({
    signatureVersion: 'v4'
  })
  AWSXRay.captureAWSClient(client)
  return client
}

function formatKey(todoId: string) {
    //in a real setup this will not be hardcoded
    return `img/${todoId}.png`
}

export const formatAttachmentName = (todoId: string) => {
    return `https://${ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/${formatKey(todoId)}`
  }
