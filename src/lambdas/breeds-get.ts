import fetch, { Response } from 'node-fetch'
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
    const res = new Promise<Response>((resolve) => {
      resolve(fetch('https://dog.ceo/api/breeds/list/all'))
    })

    const timeout = new Promise<Response>(() => {
      setTimeout(() => {
        throw new Error('Request Timeout Limit')
      }, timeoutMs)
    })

    return Promise.race([res, timeout])
      .then(async (value) => {
        if (value.status !== 200) {
          return {
            statusCode: value.status,
            message: value.statusText,
          }
        }

        const payload: Breeds = await value.json()
        return {
          statusCode: 200,
          body: await getBreedNames(payload.message),
        }
      })
      .catch((reason) => {
        return {
          statusCode: 408,
          message: reason.toString(),
        }
      })
  } catch (err: any) {
    return {
      statusCode: 500,
      message: err.toString(),
    }
  }
}
