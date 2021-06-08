import fetch from 'node-fetch'
import { Response } from './types'

interface BreedsResponse extends Response {
  body: string
}

interface ErrorResponse extends Response {
  message: string
}

interface SubBreed {
  [key: string]: string
}

interface Breeds {
  message: SubBreed
  status: string
}

async function getBreedNames(payload: Breeds): Promise<string> {
  const breeds = []
  const json = JSON.parse(payload.toString())
  const keys = Object.keys(json.message)
  for (let i = 0; i < keys.length; i += 1) {
    const breed = keys[i]
    const subBreeds = json.message[breed]
    if (subBreeds.length > 0) {
      for (let j = 0; j < subBreeds.length; j += 1) {
        const subBreed = subBreeds[j]
        breeds.push(subBreed)
      }
    } else {
      breeds.push(breed)
    }
  }
  return JSON.stringify(breeds)
}

export async function handler(timeout = 5000): Promise<BreedsResponse | ErrorResponse> {
  try {
    const res = await fetch('https://dog.ceo/api/breeds/list/all', { timeout })
    const payload: Breeds = await res.json()
    return {
      statusCode: 200,
      body: await getBreedNames(payload),
    }
  } catch (err: any) {
    return {
      statusCode: 500,
      message: err,
    }
  }
}
