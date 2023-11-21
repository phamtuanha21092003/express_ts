import { Redis } from 'ioredis'
import { REDIS_PORT } from '@configs'

export const redis = new Redis(REDIS_PORT)
