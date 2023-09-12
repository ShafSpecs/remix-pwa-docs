import {type DataFunctionArgs} from '@remix-run/node'
import { getPostMetaData } from '~/utils/server/github.server'

export async function loader({request}: DataFunctionArgs) {
  try {
    await Promise.all([
      getPostMetaData()
    ])

    console.log(request.url, 'healthcheck ✅')
    
    return new Response('OK')
  } catch (error: unknown) {
    console.error(request.url, 'healthcheck ❌', {error})
    return new Response('ERROR', {status: 500})
  }
}