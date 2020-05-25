export interface Call {
  id: string
  teamId: number
  startedAt: string,
  duration: number,
  participants: {
    userId: number
  }[]
}