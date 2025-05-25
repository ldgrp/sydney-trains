import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCarCountFromTripId(tripId: string) {
  const parts = tripId.split('.')
  const carCount = parts[parts.length - 2]
  return parseInt(carCount)
}