import * as data from '../../data'
import { Call, Team } from '../../types'
import { get } from './index'


describe('Teams', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Get', () => {
    const calls: Call[] = [
      {
        id: 3,
        teamId: 3,
        participants: [{userId: 1}],
        startedAt: '2019-02-28T07:48:44-10:00',
        duration: 1568644
      },
      {
        id: 2,
        teamId: 2,
        participants: [{userId: 1}],
        startedAt: '2019-03-26T07:48:44-10:00',
        duration: 1568644
      },
      {
        id: 1,
        teamId: 1,
        participants: [{userId: 1}, {userId: 2}],
        startedAt: '2019-03-27T09:26:50-10:00',
        duration: 1568644
      },
    ]

    const teams: Team[] = [
      {
        id: 1,
        name: '1',
        isActive: true,
        logo: 'http://placehold.it/32x32',
        tags: ['cupidatat', 'magna'],
        members: [{userId: 1}]
      },
      {
        id: 2,
        name: '2',
        isActive: true,
        logo: 'http://placehold.it/32x32',
        tags: ['cupidatat', 'magna'],
        members: [{userId: 1}]
      },
      {
        id: 3,
        name: '2',
        isActive: true,
        logo: 'http://placehold.it/32x32',
        tags: ['cupidatat', 'magna'],
        members: [{userId: 1}]
      }
    ]

    it('should return teams with default parameters', async () => {
      const getCallsSpy = jest.spyOn(data, 'getCalls').mockResolvedValue(calls)
      const getTeamSpy = jest.spyOn(data, 'getTeams').mockResolvedValue(teams)
      const expectedTeam = teams[0]

      const result = await get()

      expect(result).toEqual([expectedTeam])
      expect(getCallsSpy).toBeCalled()
      expect(getTeamSpy).toBeCalled()
    })

    it('should return teams with limit 2', async () => {
      const getCallsSpy = jest.spyOn(data, 'getCalls').mockResolvedValue(calls)
      const getTeamSpy = jest.spyOn(data, 'getTeams').mockResolvedValue(teams)
      const expectedTeams = [teams[0], teams[1]]

      const result = await get({limit: 2})

      expect(result).toEqual(expectedTeams)
      expect(getCallsSpy).toBeCalled()
      expect(getTeamSpy).toBeCalled()
    })

  })
})