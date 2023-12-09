import { Redis } from 'ioredis'
import { REDIS_PORT, REDIS_PASSWORD, REDIS_HOST } from '@configs'

export const redis = new Redis({
    port: +REDIS_PORT,
    host: REDIS_HOST,
    password: REDIS_PASSWORD,
})

redis.on('connect', function () {
    console.log('connect successfully')
})