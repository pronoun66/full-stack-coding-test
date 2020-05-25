import * as data from '../../data'
import { Call, User } from '../../types'
import { getGroupByCall, initialCallOptions } from './index'
import { FilterField, FilterOperator, FilterTimeUnit, SortOrder, SortType } from '../../const'


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

  describe('Sort field', () => {
    const calls: Call[] = [
      {
        id: '1',
        teamId: 1,
        participants: [{userId: 1}, {userId: 2}],
        startedAt: '2019-02-01T08:56:43-10:00',
        duration: 11000
      },
      {
        id: '2',
        teamId: 2,
        participants: [{userId: 2}],
        startedAt: '2019-02-01T08:56:43-10:00',
        duration: 1200000
      }
    ]

    it('By count', async () => {
      const getCallsSpy = jest.spyOn(data, 'getCalls').mockResolvedValue(calls)
      const getUsersSpy = jest.spyOn(data, 'getUsers').mockResolvedValue(users)
      const expectedUsers = [users[1], users[0]]

      const result = await getGroupByCall(initialCallOptions)

      expect(result).toEqual(expectedUsers)
      expect(getCallsSpy).toBeCalled()
      expect(getUsersSpy).toBeCalled()
    })

    it('By Likelihood', async () => {
      const getCallsSpy = jest.spyOn(data, 'getCalls').mockResolvedValue(calls)
      const getUsersSpy = jest.spyOn(data, 'getUsers').mockResolvedValue(users)

      const result = await getGroupByCall({
        ...initialCallOptions,
        filter: {
          field: FilterField.DURATION,
          value: '2m',
          operator: FilterOperator.LTE

        },
        sort: {
          type: SortType.LIKELIHOOD,
          order: SortOrder.DESC,
        },
      })

      expect(result).toEqual(users)
      expect(getCallsSpy).toBeCalled()
      expect(getUsersSpy).toBeCalled()
    })

    it('with asc order', async () => {
      const getCallsSpy = jest.spyOn(data, 'getCalls').mockResolvedValue(calls)
      const getUsersSpy = jest.spyOn(data, 'getUsers').mockResolvedValue(users)

      const result = await getGroupByCall({
        ...initialCallOptions,
        sort: {type: SortType.COUNT, order: SortOrder.ASC},
      })

      expect(result).toEqual(users)
      expect(getCallsSpy).toBeCalled()
      expect(getUsersSpy).toBeCalled()
    })

    it('with desc order', async () => {
      const getCallsSpy = jest.spyOn(data, 'getCalls').mockResolvedValue(calls)
      const getUsersSpy = jest.spyOn(data, 'getUsers').mockResolvedValue(users)
      const expectedUser = [users[1], users[0]]

      const result = await getGroupByCall({
        ...initialCallOptions,
        sort: {type: SortType.COUNT, order: SortOrder.DESC},
      })

      expect(result).toEqual(expectedUser)
      expect(getCallsSpy).toBeCalled()
      expect(getUsersSpy).toBeCalled()
    })


  })

  describe('Filter', () => {
    const calls: Call[] = [
      {
        id: '1',
        teamId: 1,
        participants: [{userId: 1}],
        startedAt: '2019-02-01T08:56:43-10:00',
        duration: 11000
      },
      {
        id: '2',
        teamId: 2,
        participants: [{userId: 2}],
        startedAt: '2019-02-01T08:56:43-10:00',
        duration: 60001
      },
    ]

    it('Type: DURATION', async () => {
      const getCallsSpy = jest.spyOn(data, 'getCalls').mockResolvedValue(calls)
      const getUsersSpy = jest.spyOn(data, 'getUsers').mockResolvedValue(users)
      const expectedUser = users[0]

      const result = await getGroupByCall({
        ...initialCallOptions,
        filter: {
          field: FilterField.DURATION,
          value: '1m',
          operator: FilterOperator.LT
        },
        limit: 1
      })

      expect(result).toEqual([expectedUser])
      expect(getCallsSpy).toBeCalled()
      expect(getUsersSpy).toBeCalled()
    })
  })

  describe('Limit', () => {
    const calls: Call[] = [
      {
        id: '1',
        teamId: 1,
        participants: [{userId: 1}, {userId: 2}],
        startedAt: '2019-02-01T08:56:43-10:00',
        duration: 11000
      },
      {
        id: '2',
        teamId: 2,
        participants: [{userId: 1}],
        startedAt: '2019-02-01T08:56:43-10:00',
        duration: 1200000
      }
    ]

    it('should return users with limit', async () => {
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
  })
})