import AWS from 'aws-sdk'

const credentials = new AWS.Credentials(process.env.AWS_ACCESS_KEY_ID as string, process.env.AWS_ACCESS_KEY_SECRET as string)

AWS.config.update({
  region: process.env.AWS_REGION,
  credentials,
})

export const s3 = new AWS.S3({apiVersion: '2006-03-01'})