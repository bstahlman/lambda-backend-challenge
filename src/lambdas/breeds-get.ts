import fetch from 'node-fetch'
import { Response } from './types'

interface BreedsResponse extends Response {
  body: string[]
}

interface ErrorResponse extends Response {
  message: string
}

interface SubBreed {
  [key: string]: string[]
}

interface Breeds {
  message: SubBreed
  status: string
}

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
    const timeout = setTimeout(() => {
      throw new Error('Request Timeout Limit')
    }, timeoutMs)

    const res = await fetch('https://dog.ceo/api/breeds/list/all')
    clearTimeout(timeout)

    if (!res.ok) {
      return {
        statusCode: res.status,
        message: res.statusText,
      }
    }
    const payload: Breeds = await res.json()
    return {
      statusCode: 200,
      body: await getBreedNames(payload.message),
    }
  } catch (err: any) {
    return {
      statusCode: 500,
      message: err.toString(),
    }
  }
}
