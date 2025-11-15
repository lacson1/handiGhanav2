import { Request, Response } from 'express'
import { EarningsDataPoint, MonthlyTrend, CategoryBreakdown } from '../types/controller.types'

// Mock earnings data generator
const generateEarningsData = (providerId: string, period: string): EarningsDataPoint[] => {
  const now = new Date()
  const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '3m' ? 90 : 365
  
  const data: EarningsDataPoint[] = []
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    // Mock earnings calculation (in production, query from database)
    const earnings = Math.floor(Math.random() * 500) + 200
    const jobs = Math.floor(Math.random() * 5) + 1
    
    data.push({
      date: date.toISOString().split('T')[0],
      dayKey: date.toLocaleDateString('en-GH', { month: 'short', day: 'numeric' }),
      earnings,
      jobs,
      payout: earnings * 0.85, // 85% after 15% commission
      transactions: Math.floor(Math.random() * 3) + 1
    })
  }
  
  return data
}

const generateMonthlyTrends = (providerId: string, months: number = 12): MonthlyTrend[] => {
  const monthsData: MonthlyTrend[] = []
  const now = new Date()
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthKey = date.toLocaleDateString('en-GH', { month: 'short' })
    
    monthsData.push({
      month: monthKey,
      monthNumber: date.getMonth() + 1,
      year: date.getFullYear(),
      earnings: Math.floor(Math.random() * 5000) + 3000,
      jobs: Math.floor(Math.random() * 30) + 10,
      avgPerJob: Math.floor(Math.random() * 200) + 150,
      payout: Math.floor(Math.random() * 4250) + 2550
    })
  }
  
  return monthsData
}

const generateCategoryBreakdown = (providerId: string): CategoryBreakdown[] => {
  // Mock category breakdown (in production, aggregate by service category)
  return [
    { category: 'Electrical', earnings: 4500, jobs: 15, percentage: 35, color: '#FACC15' },
    { category: 'Plumbing', earnings: 3200, jobs: 12, percentage: 25, color: '#3B82F6' },
    { category: 'Cleaning', earnings: 2800, jobs: 20, percentage: 22, color: '#10B981' },
    { category: 'Handyman', earnings: 2100, jobs: 8, percentage: 18, color: '#F59E0B' }
  ]
}

export const getEarningsAnalytics = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { period = '30d' } = req.query

    if (!id) {
      return res.status(400).json({ message: 'Provider ID is required' })
    }

    const validPeriods = ['7d', '30d', '3m', '1y']
    if (!validPeriods.includes(period as string)) {
      return res.status(400).json({ message: `Period must be one of: ${validPeriods.join(', ')}` })
    }

    const earningsData = generateEarningsData(id, period as string)
    const totalEarnings = earningsData.reduce((sum, d) => sum + d.earnings, 0)
    const totalJobs = earningsData.reduce((sum, d) => sum + d.jobs, 0)
    const totalPayout = earningsData.reduce((sum, d) => sum + d.payout, 0)
    const avgPerJob = totalJobs > 0 ? totalEarnings / totalJobs : 0

    // Calculate growth (mock - in production, compare with previous period)
    const previousPeriodEarnings = totalEarnings * 0.875 // Mock 12.5% growth
    const growth = ((totalEarnings - previousPeriodEarnings) / previousPeriodEarnings) * 100

    res.json({
      period: period as string,
      summary: {
        totalEarnings,
        totalJobs,
        totalPayout,
        avgPerJob: Math.round(avgPerJob),
        growth: Math.round(growth * 10) / 10,
        pendingPayout: totalPayout * 0.2 // Mock 20% pending
      },
      chartData: earningsData,
      trends: {
        earnings: earningsData.map(d => ({ date: d.dayKey, value: d.earnings })),
        jobs: earningsData.map(d => ({ date: d.dayKey, value: d.jobs })),
        payout: earningsData.map(d => ({ date: d.dayKey, value: d.payout }))
      }
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch earnings analytics'
    console.error('Get earnings analytics error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

export const getEarningsTrends = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { months = '12' } = req.query

    if (!id) {
      return res.status(400).json({ message: 'Provider ID is required' })
    }

    const monthsNum = parseInt(months as string, 10)
    if (isNaN(monthsNum) || monthsNum < 1 || monthsNum > 24) {
      return res.status(400).json({ message: 'Months must be between 1 and 24' })
    }

    const monthlyData = generateMonthlyTrends(id, monthsNum)
    const totalEarnings = monthlyData.reduce((sum, m) => sum + m.earnings, 0)
    const totalJobs = monthlyData.reduce((sum, m) => sum + m.jobs, 0)

    res.json({
      months: monthsNum,
      summary: {
        totalEarnings,
        totalJobs,
        avgMonthlyEarnings: Math.round(totalEarnings / monthsNum),
        avgMonthlyJobs: Math.round(totalJobs / monthsNum)
      },
      monthlyData,
      trends: {
        earnings: monthlyData.map(m => ({ month: m.month, value: m.earnings })),
        jobs: monthlyData.map(m => ({ month: m.month, value: m.jobs })),
        avgPerJob: monthlyData.map(m => ({ month: m.month, value: m.avgPerJob }))
      }
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch earnings trends'
    res.status(500).json({ message: errorMessage })
  }
}

export const getEarningsByCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { period = '30d' } = req.query

    if (!id) {
      return res.status(400).json({ message: 'Provider ID is required' })
    }

    const categoryData = generateCategoryBreakdown(id)
    const totalEarnings = categoryData.reduce((sum, c) => sum + c.earnings, 0)

    res.json({
      period: period as string,
      totalEarnings,
      categories: categoryData.map(c => ({
        ...c,
        percentage: Math.round((c.earnings / totalEarnings) * 100)
      }))
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch category breakdown'
    res.status(500).json({ message: errorMessage })
  }
}

export const exportEarningsReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { format = 'json', period = '30d' } = req.query

    if (!id) {
      return res.status(400).json({ message: 'Provider ID is required' })
    }

    const earningsData = generateEarningsData(id, period as string)
    const monthlyData = generateMonthlyTrends(id, 12)
    const categoryData = generateCategoryBreakdown(id)

    if (format === 'csv') {
      // Generate CSV format
      const csvHeader = 'Date,Earnings,Jobs,Payout\n'
      const csvRows = earningsData.map(d => 
        `${d.date},${d.earnings},${d.jobs},${d.payout}`
      ).join('\n')
      
      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', `attachment; filename="earnings-${period}-${Date.now()}.csv"`)
      res.send(csvHeader + csvRows)
    } else {
      // Return JSON format
      res.json({
        period: period as string,
        generatedAt: new Date().toISOString(),
        earnings: earningsData,
        monthlyTrends: monthlyData,
        categoryBreakdown: categoryData
      })
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to export earnings report'
    res.status(500).json({ message: errorMessage })
  }
}

