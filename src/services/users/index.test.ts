import * as data from '../../data'
import { Call, User } from '../../types'
import { get, getGroupByCall, initialCallOptions } from './index'
import { FilterTimeUnit, FilterType, GroupType, SortOrder, SortType } from '../../const'


describe('getGroupByCall', () => {
  const users: User[] = [
    {
      id: 1,
      firstName: 'Jerry',
      lastName: 'Mouse',
      email: 'jerrymouse@gmail.com'
    },
    {
      id: 2,
      firstName: 'Jerry2',
      lastName: 'Mouse',
      email: 'jerrymouse@gmail.com'
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('sort by count', () => {
    const calls: Call[] = [
      {
        id: 1,
        teamId: 1,
        participants: [{userId: 1}, {userId: 2}],
        startedAt: '2019-02-01T08:56:43-10:00',
        duration: 66000
      },
      {
        id: 2,
        teamId: 2,
        participants: [{userId: 1}],
        startedAt: '2019-02-01T08:56:43-10:00',
        duration: 11000
      }
    ]

    it('should return users with default parameters', async () => {
      const getCallsSpy = jest.spyOn(data, 'getCalls').mockResolvedValue(calls)
      const getUsersSpy = jest.spyOn(data, 'getUsers').mockResolvedValue(users)
      const expectedUser = users[0]

      const result = await getGroupByCall(initialCallOptions)

      expect(result).toEqual([expectedUser])
      expect(getCallsSpy).toBeCalled()
      expect(getUsersSpy).toBeCalled()
    })

    it('should return 2 users with limit 2', async () => {
      const getCallsSpy = jest.spyOn(data, 'getCalls').mockResolvedValue(calls)
      const getUsersSpy = jest.spyOn(data, 'getUsers').mockResolvedValue(users)

      const result = await getGroupByCall({
        ...initialCallOptions,
        limit: 2
      })

      expect(result).toEqual(users)
      expect(getCallsSpy).toBeCalled()
      expect(getUsersSpy).toBeCalled()
    })

    it('should return users with asc order', async () => {
      const getCallsSpy = jest.spyOn(data, 'getCalls').mockResolvedValue(calls)
      const getUsersSpy = jest.spyOn(data, 'getUsers').mockResolvedValue(users)
      const expectedUser = users[1]

      const result = await getGroupByCall({
        ...initialCallOptions,
        sort: {type: SortType.COUNT, order: SortOrder.ASC},
      })

      expect(result).toEqual([expectedUser])
      expect(getCallsSpy).toBeCalled()
      expect(getUsersSpy).toBeCalled()
    })

    it('should return users with filter', async () => {
      const getCallsSpy = jest.spyOn(data, 'getCalls').mockResolvedValue(calls)
      const getUsersSpy = jest.spyOn(data, 'getUsers').mockResolvedValue(users)
      const expectedUser = users[0]

      const result = await getGroupByCall({
        ...initialCallOptions,
        filter: {
          type: FilterType.DURATION,
          unit: FilterTimeUnit.MINUTE,
          amount: 1
        }
      })

      expect(result).toEqual([expectedUser])
      expect(getCallsSpy).toBeCalled()
      expect(getUsersSpy).toBeCalled()
    })

  })

  describe('sort by likelihood', () => {
    const calls: Call[] = [
      {
        id: 1,
        teamId: 1,
        participants: [{userId: 1}, {userId: 2}],
        startedAt: '2019-02-01T08:56:43-10:00',
        duration: 11000
      },
      {
        id: 2,
        teamId: 2,
        participants: [{userId: 2}],
        startedAt: '2019-02-01T08:56:43-10:00',
        duration: 1200000
      }
    ]

    it('should return users with default limit with filter', async () => {
      const getCallsSpy = jest.spyOn(data, 'getCalls').mockResolvedValue(calls)
      const getUsersSpy = jest.spyOn(data, 'getUsers').mockResolvedValue(users)
      const expectedUser = users[0]

      const result = await getGroupByCall({
        ...initialCallOptions,
        filter: {
          type: FilterType.DURATION,
          unit: FilterTimeUnit.MINUTE,
          amount: 2
        },
        sort: {
          type: SortType.LIKELIHOOD,
          order: SortOrder.DESC,
        },
      })

      expect(result).toEqual([expectedUser])
      expect(getCallsSpy).toBeCalled()
      expect(getUsersSpy).toBeCalled()
    })

    it('should return 2 users with limit 2 with filter', async () => {
      const getCallsSpy = jest.spyOn(data, 'getCalls').mockResolvedValue(calls)
      const getUsersSpy = jest.spyOn(data, 'getUsers').mockResolvedValue(users)

      const result = await getGroupByCall({
        filter: {
          type: FilterType.DURATION,
          unit: FilterTimeUnit.MINUTE,
          amount: 2
        },
        sort: {
          type: SortType.LIKELIHOOD,
          order: SortOrder.DESC,
        },
        limit: 2
      })

      expect(result).toEqual(users)
      expect(getCallsSpy).toBeCalled()
      expect(getUsersSpy).toBeCalled()
    })

  })
})