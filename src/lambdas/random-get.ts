import fetch from 'node-fetch'
import { StatusResponse } from './types'

interface RandomResponse extends StatusResponse {
  body: RandomDog
}

interface ErrorResponse extends StatusResponse {
  message: string
}

interface RandomDog {
  message: string
  status: string
}

export async function handler(): Promise<RandomResponse | ErrorResponse> {
  try {
    const res = await fetch('https://dog.ceo/api/breeds/image/random')
    const payload: RandomDog = await res.json()
    return {
      statusCode: 200,
      body: payload,
    }
  } catch (err: unknown) {
    return {
      statusCode: 500,
      message: 'Something went wrong',
    }
  }
}
