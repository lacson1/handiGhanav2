// Comprehensive list of major cities and regions in Ghana for autocomplete
export const ghanaRegions = [
  'Greater Accra',
  'Ashanti',
  'Western',
  'Eastern',
  'Central',
  'Northern',
  'Upper East',
  'Upper West',
  'Volta',
  'Bono',
  'Bono East',
  'Ahafo',
  'Savannah',
  'North East',
  'Oti',
  'Western North'
]

export const ghanaCities = [
  // Greater Accra Region
  { name: 'Accra', region: 'Greater Accra', popular: true },
  { name: 'Tema', region: 'Greater Accra', popular: true },
  { name: 'Madina', region: 'Greater Accra', popular: true },
  { name: 'Adenta', region: 'Greater Accra', popular: true },
  { name: 'Teshie', region: 'Greater Accra' },
  { name: 'Nungua', region: 'Greater Accra' },
  { name: 'Kasoa', region: 'Greater Accra', popular: true },
  { name: 'Dansoman', region: 'Greater Accra' },
  { name: 'East Legon', region: 'Greater Accra', popular: true },
  { name: 'Spintex', region: 'Greater Accra' },
  { name: 'Labadi', region: 'Greater Accra' },
  { name: 'Osu', region: 'Greater Accra' },
  { name: 'Kaneshie', region: 'Greater Accra' },
  { name: 'Lapaz', region: 'Greater Accra' },
  { name: 'Achimota', region: 'Greater Accra' },
  { name: 'Legon', region: 'Greater Accra' },
  { name: 'Haatso', region: 'Greater Accra' },
  { name: 'Dome', region: 'Greater Accra' },
  { name: 'Weija', region: 'Greater Accra' },
  { name: 'Ga West', region: 'Greater Accra' },
  
  // Ashanti Region
  { name: 'Kumasi', region: 'Ashanti', popular: true },
  { name: 'Obuasi', region: 'Ashanti', popular: true },
  { name: 'Ejisu', region: 'Ashanti' },
  { name: 'Konongo', region: 'Ashanti' },
  { name: 'Mampong', region: 'Ashanti' },
  { name: 'Bekwai', region: 'Ashanti' },
  { name: 'Asante Mampong', region: 'Ashanti' },
  { name: 'Kwabre', region: 'Ashanti' },
  
  // Western Region
  { name: 'Sekondi-Takoradi', region: 'Western', popular: true },
  { name: 'Tarkwa', region: 'Western' },
  { name: 'Prestea', region: 'Western' },
  { name: 'Axim', region: 'Western' },
  { name: 'Elubo', region: 'Western' },
  
  // Eastern Region
  { name: 'Koforidua', region: 'Eastern', popular: true },
  { name: 'Akosombo', region: 'Eastern' },
  { name: 'Akim Oda', region: 'Eastern' },
  { name: 'Nsawam', region: 'Eastern' },
  { name: 'Mpraeso', region: 'Eastern' },
  { name: 'Begoro', region: 'Eastern' },
  
  // Central Region
  { name: 'Cape Coast', region: 'Central', popular: true },
  { name: 'Winneba', region: 'Central' },
  { name: 'Elmina', region: 'Central' },
  { name: 'Saltpond', region: 'Central' },
  { name: 'Swedru', region: 'Central' },
  { name: 'Kasoa', region: 'Central' },
  
  // Northern Region
  { name: 'Tamale', region: 'Northern', popular: true },
  { name: 'Yendi', region: 'Northern' },
  { name: 'Savelugu', region: 'Northern' },
  { name: 'Tolon', region: 'Northern' },
  
  // Upper East Region
  { name: 'Bolgatanga', region: 'Upper East', popular: true },
  { name: 'Bawku', region: 'Upper East' },
  { name: 'Navrongo', region: 'Upper East' },
  
  // Upper West Region
  { name: 'Wa', region: 'Upper West', popular: true },
  { name: 'Lawra', region: 'Upper West' },
  
  // Volta Region
  { name: 'Ho', region: 'Volta', popular: true },
  { name: 'Hohoe', region: 'Volta' },
  { name: 'Keta', region: 'Volta' },
  { name: 'Aflao', region: 'Volta' },
  { name: 'Sogakope', region: 'Volta' },
  
  // Bono Region
  { name: 'Sunyani', region: 'Bono', popular: true },
  { name: 'Berekum', region: 'Bono' },
  { name: 'Dormaa Ahenkro', region: 'Bono' },
]

export const popularCities = ghanaCities.filter(city => city.popular)

// Common neighborhoods/areas in Accra for more specific location
export const accraNeighborhoods = [
  'Airport Residential',
  'Cantonments',
  'Labone',
  'Roman Ridge',
  'Abelemkpe',
  'North Ridge',
  'Ridge',
  'Dzorwulu',
  'Airport Hills',
  'Trasacco Valley',
  'Community 18',
  'Community 25',
  'Sakumono',
  'Teshie-Nungua Estates',
  'Dansoman Estates',
  'Santa Maria',
  'McCarthy Hill',
  'Awoshie',
  'Pokuase',
  'Amasaman'
]

export interface LocationSuggestion {
  name: string
  region?: string
  type: 'city' | 'region' | 'neighborhood'
  popular?: boolean
}

export function getLocationSuggestions(query: string): LocationSuggestion[] {
  const lowerQuery = query.toLowerCase().trim()
  
  if (!lowerQuery) {
    // Return popular cities when no query
    return popularCities.map(city => ({
      name: city.name,
      region: city.region,
      type: 'city' as const,
      popular: true
    }))
  }
  
  const suggestions: LocationSuggestion[] = []
  
  // Search cities
  ghanaCities.forEach(city => {
    if (city.name.toLowerCase().includes(lowerQuery) || 
        city.region.toLowerCase().includes(lowerQuery)) {
      suggestions.push({
        name: city.name,
        region: city.region,
        type: 'city',
        popular: city.popular
      })
    }
  })
  
  // Search neighborhoods
  accraNeighborhoods.forEach(neighborhood => {
    if (neighborhood.toLowerCase().includes(lowerQuery)) {
      suggestions.push({
        name: neighborhood,
        region: 'Greater Accra',
        type: 'neighborhood'
      })
    }
  })
  
  // Search regions
  ghanaRegions.forEach(region => {
    if (region.toLowerCase().includes(lowerQuery)) {
      suggestions.push({
        name: region,
        type: 'region'
      })
    }
  })
  
  // Sort: popular first, then alphabetically
  return suggestions
    .sort((a, b) => {
      if (a.popular && !b.popular) return -1
      if (!a.popular && b.popular) return 1
      return a.name.localeCompare(b.name)
    })
    .slice(0, 10) // Limit to 10 suggestions
}

