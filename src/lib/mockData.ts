import type { Lead } from '@/types/lead'

const companies = [
  { name: 'Elite Roofing Solutions', category: 'Roofing', city: 'Phoenix', state: 'AZ' },
  { name: 'Superior Home Builders', category: 'Construction', city: 'Austin', state: 'TX' },
  { name: 'Premium HVAC Services', category: 'HVAC', city: 'Dallas', state: 'TX' },
  { name: 'ProContractors Inc', category: 'General Contracting', city: 'Denver', state: 'CO' },
  { name: 'Apex Electrical', category: 'Electrical', city: 'Seattle', state: 'WA' },
  { name: 'Prestige Plumbing', category: 'Plumbing', city: 'Portland', state: 'OR' },
  { name: 'Summit Construction Group', category: 'Construction', city: 'Las Vegas', state: 'NV' },
  { name: 'Heritage Remodeling', category: 'Remodeling', city: 'Atlanta', state: 'GA' },
  { name: 'Precision Painters', category: 'Painting', city: 'Miami', state: 'FL' },
  { name: 'Cornerstone Builders', category: 'Construction', city: 'Nashville', state: 'TN' },
]

export function generateDemoLeads(): Lead[] {
  return companies.map((company, index) => ({
    id: `demo-${index + 1}`,
    company: company.name,
    city: company.city,
    state: company.state,
    phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    email: `contact@${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
    website: `https://www.${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
    rating: ['A+', 'A', 'B+', 'B', 'C'][Math.floor(Math.random() * 5)] as Lead['rating'],
    opportunityScore: Math.floor(Math.random() * 40) + 60,
    status: ['new', 'contacted', 'qualified', 'proposal'][Math.floor(Math.random() * 4)] as Lead['status'],
    priority: ['green', 'yellow', 'red'][Math.floor(Math.random() * 3)] as Lead['priority'],
    isNew: Math.random() > 0.7,
    category: company.category,
    revenue: Math.floor(Math.random() * 5000000) + 500000,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
  }))
}

export const mockLeads: Lead[] = generateDemoLeads()
