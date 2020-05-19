export interface Team {
  id: number
  name: string
  isActive: boolean
  logo: string
  tags: string[]
  members: {
    userId: number
  }[]
}