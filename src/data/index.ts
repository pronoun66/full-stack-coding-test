import { s3 } from '../config'
import { Call, Team, User } from '../types'

const CALLS_OBJECT_KEY = 'data/backend/calls.json'
const TEAMS_OBJECT_KEY = 'data/backend/teams.json'
const USERS_OBJECT_KEY = 'data/backend/users.json'

export const getCalls = async (): Promise<Call[]> => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: CALLS_OBJECT_KEY
  }

  const s3Object = await s3.getObject(params).promise()
  const data = JSON.parse(s3Object.Body.toString('utf-8'))

  return data.map((call: any) => ({
    id: call.call_id,
    teamId: call.team_id,
    participants: call.participants.map((participant: any) => ({
      userId: participant.user_id
    })),
    startedAt: call.started_at,
    duration: call.duration
  }))
}

export const getTeams = async (): Promise<Team[]> => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: TEAMS_OBJECT_KEY
  }

  const s3Object = await s3.getObject(params).promise()
  const data = JSON.parse(s3Object.Body.toString('utf-8'))

  return data.map((team: any) => ({
    id: team.team_id,
    name: team.name,
    isActive: team.isActive,
    logo: team.logo,
    tags: team.tags,
    members: team.members.map((member: any) => ({
      userId: member.user_id
    }))
  }))
}

export const getUsers = async (): Promise<User[]> => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: USERS_OBJECT_KEY
  }

  const s3Object = await s3.getObject(params).promise()
  const data = JSON.parse(s3Object.Body.toString('utf-8'))

  return data.map((user: any) => ({
    id: user.user_id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email
  }))
}