import fetch from 'node-fetch'
import { StatusResponse } from './types'

interface BreedsResponse extends StatusResponse {
  body: string[]
}

interface ErrorResponse extends StatusResponse {
  message: string
}

interface SubBreed {
  [key: string]: string[]
}

interface Breeds {
  message: SubBreed
  status: string
}

class RequestTimeoutLimitError extends Error {}

async function getBreedNames(message: SubBreed): Promise<string[]> {
  const breeds = []
  const keys = Object.keys(message)
  for (let i = 0; i < keys.length; i += 1) {
    const breed = keys[i]
    const subBreeds = message[breed]
    if (subBreeds.length > 0) {
      for (let j = 0; j < subBreeds.length; j += 1) {
        const subBreed = subBreeds[j]
        breeds.push(`${subBreed} ${breed}`)
      }
    } else {
      breeds.push(breed)
    }
  }
  return breeds
}

export async function handler(): Promise<BreedsResponse | ErrorResponse> {
  try {
    const timeoutMs = 30 * 1000
    const res = await fetch('https://dog.ceo/api/breeds/list/all')

    const timeout = setTimeout(() => {
      throw new RequestTimeoutLimitError('Request Timeout Limit')
    }, timeoutMs)

    if (res.status !== 200) {
      return {
        statusCode: res.status,
        message: 'API Call Failure',
      }
    }

    const payload: Breeds = await res.json()
    clearTimeout(timeout)

    return {
      statusCode: 200,
      body: await getBreedNames(payload.message),
    }
  } catch (err: any) {
    if (err instanceof RequestTimeoutLimitError) {
      const timeoutError = err
      return {
        statusCode: 408,
        message: timeoutError.message,
      }
    }
    return {
      statusCode: 500,
      message: 'API Server Error',
    }
  }
}
