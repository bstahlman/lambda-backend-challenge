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
      json: () => {
        return null
      },
    })
    const response = await handler()
    const expectedResponse = {
      statusCode: 500,
      message: "TypeError: Cannot read property 'message' of null",
    }
    expect(response).toMatchObject(expectedResponse)
  })

  it('returns 408 status code if the request times out', async () => {
    mockedFetch.mockReturnValueOnce({
      json: () => {
        return null
      },
    })
    const response = await handler()
    const expectedResponse = {
      statusCode: 408,
      body: 'Request Timeout',
    }
    expect(response).toMatchObject(expectedResponse)
  })
})
