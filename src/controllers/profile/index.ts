import express from 'express'
import { profileService } from '@services/profile'

export const profileController = express.Router()

profileController.put('/upload', profileService.uploadImage)
