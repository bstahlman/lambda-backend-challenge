import fetch from 'node-fetch'
import { handler } from './breeds-get'

const mockedFetch: jest.Mock = fetch as any
jest.mock('node-fetch')

describe('breeds-get handler', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('returns 200 status code and flat array of breeds if the request is valid', async () => {
    mockedFetch.mockReturnValueOnce({
      ok: true,
      json: () => {
        return {
          message: {
            sheepdog: ['english', 'shetland'],
            shiba: [],
          },
          status: 'success',
        }
      },
    })
    const response = await handler()
    const expectedResponse = {
      statusCode: 200,
      body: ['english sheepdog', 'shetland sheepdog', 'shiba'],
    }
    expect(response).toMatchObject(expectedResponse)
  })

  it('returns 500 status code if the request is invalid', async () => {
    mockedFetch.mockReturnValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: () => {
        return null
      },
    })
    const response = await handler()
    const expectedResponse = {
      statusCode: 500,
      message: 'Internal Server Error',
    }
    expect(response).toMatchObject(expectedResponse)
  })

  it('returns 408 status code if the request times out', async () => {
    jest.useFakeTimers()
    jest.advanceTimersByTime(500000)
    mockedFetch.mockReturnValueOnce({
      ok: false,
      status: 408,
      statusText: 'Request Timeout',
      json: () => {
        return null
      },
    })
    const response = await handler()
    const expectedResponse = {
      statusCode: 408,
      message: 'Request Timeout',
    }
    expect(response).toMatchObject(expectedResponse)
  })
})
