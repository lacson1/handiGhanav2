import { useQuery } from '@tanstack/react-query'
import { statsApi } from '../lib/api'

export function usePlatformStats() {
  return useQuery({
    queryKey: ['platformStats'],
    queryFn: () => statsApi.getPlatformStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes - stats don't change frequently
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

export function useRecentReviews(limit: number = 3) {
  return useQuery({
    queryKey: ['recentReviews', limit],
    queryFn: () => statsApi.getRecentReviews(limit),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  })
}

export function useTrendingSearches(limit: number = 5, days: number = 30) {
  return useQuery({
    queryKey: ['trendingSearches', limit, days],
    queryFn: () => statsApi.getTrendingSearches(limit, days),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000,
  })
}

