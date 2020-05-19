export interface Call {
  id: number
  teamId: number
  startedAt: string,
  duration: number,
  participants: {
    userId: number
  }[]
}