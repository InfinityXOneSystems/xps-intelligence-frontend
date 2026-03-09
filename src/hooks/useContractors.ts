import { useMemo, useState } from 'react'
import type { Contractor, ContractorFilters, ContractorLeadStatus } from '@/types/contractor'
import { DEFAULT_FILTERS } from '@/types/contractor'

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_CONTRACTORS: Contractor[] = [
  {
    id: 'c-001',
    name: 'Pacific Flooring Solutions',
    industry: ['Flooring', 'General Contractor'],
    license_number: 'CA-FL-2019-4821',
    business_type: 'LLC',
    years_in_business: 12,
    phone: '(323) 555-0142',
    email: 'contact@pacificflooring.com',
    website: 'https://pacificflooring.com',
    office_address: '1240 W Pico Blvd, Los Angeles, CA 90064',
    service_areas: ['Los Angeles', 'Santa Monica', 'Culver City', 'West Hollywood'],
    hours_of_operation: 'Mon–Fri 8am–6pm, Sat 9am–2pm',
    rating: { google: 4.8, yelp: 4.6, bbb: 4.9, trustpilot: 4.7, average: 4.75 },
    review_count: 328,
    estimated_revenue: '$2.4M',
    employee_count: 24,
    credit_rating: 'A',
    price_range: '$$$',
    lead_status: 'qualified',
    last_contacted: '2026-03-01',
    contact_history: [
      { id: 'ch-1', date: '2026-03-01', type: 'call', subject: 'Initial intro call', notes: 'Very interested in partnership. Follow up next week.', duration: 18, outcome: 'positive' },
      { id: 'ch-2', date: '2026-02-20', type: 'email', subject: 'Introduction email', notes: 'Sent intro + pricing deck', outcome: 'opened' },
    ],
    notes: 'Strong referral from Mike at BuildRight. High volume flooring installs. Decision maker is owner Jason Park.',
    tags: ['hot-lead', 'flooring', 'LA'],
    lead_score: 87,
    services_offered: ['Hardwood Flooring', 'Tile Installation', 'LVP/LVT', 'Carpet', 'Subfloor Repair'],
    certifications: ['NWFA Certified', 'NTCA Member'],
    warranties: ['5-Year Labor', '10-Year Manufacturer'],
    service_radius: 35,
    special_services: ['Commercial Flooring', 'Historic Restoration', 'Epoxy Coating'],
    social_profiles: { facebook: 'fb.com/pacificflooring', linkedin: 'linkedin.com/company/pacificflooring' },
    website_quality_score: 82,
    social_followers_total: 4200,
    scraped_at: '2026-03-05',
    data_source: 'google_maps',
    confidence_score: 94,
    is_duplicate: false,
    created_at: '2026-03-05',
    updated_at: '2026-03-01',
  },
  {
    id: 'c-002',
    name: 'Summit Roofing & Exteriors',
    industry: ['Roofing', 'Siding', 'Gutters'],
    license_number: 'TX-RF-2015-7734',
    business_type: 'S-Corp',
    years_in_business: 18,
    phone: '(512) 555-0298',
    email: 'info@summitroofing.tx',
    website: 'https://summitroofing.tx',
    office_address: '3890 Burnet Rd, Austin, TX 78756',
    service_areas: ['Austin', 'Round Rock', 'Cedar Park', 'Pflugerville', 'Georgetown'],
    hours_of_operation: 'Mon–Sat 7am–7pm',
    rating: { google: 4.9, yelp: 4.7, bbb: 5.0, trustpilot: 4.8, average: 4.85 },
    review_count: 612,
    estimated_revenue: '$5.8M',
    employee_count: 52,
    credit_rating: 'A+',
    price_range: '$$',
    lead_status: 'proposal',
    last_contacted: '2026-03-07',
    contact_history: [
      { id: 'ch-3', date: '2026-03-07', type: 'meeting', subject: 'Proposal meeting', notes: 'Presented full integration proposal. Awaiting decision.', duration: 45, outcome: 'pending' },
      { id: 'ch-4', date: '2026-03-02', type: 'call', subject: 'Qualification call', notes: 'Confirmed budget, timeline, and authority.', duration: 32, outcome: 'positive' },
      { id: 'ch-5', date: '2026-02-25', type: 'email', subject: 'Follow-up email', notes: 'Sent case study deck', outcome: 'replied' },
    ],
    notes: 'Largest roofing company in Austin metro. Owner Bill Harmon very interested. High urgency before storm season.',
    tags: ['hot-lead', 'roofing', 'texas', 'enterprise'],
    lead_score: 95,
    services_offered: ['Roof Replacement', 'Storm Damage Repair', 'Flat Roofs', 'Metal Roofing', 'Gutter Installation'],
    certifications: ['GAF Master Elite', 'Owens Corning Preferred', 'CertainTeed SELECT'],
    warranties: ['Lifetime Shingle Warranty', '25-Year Labor'],
    service_radius: 60,
    special_services: ['Insurance Claims Assistance', 'Emergency Tarping', 'Solar Ready Installs'],
    social_profiles: { facebook: 'fb.com/summitroofing', instagram: 'instagram.com/summitroofing', linkedin: 'linkedin.com/company/summitroofing' },
    website_quality_score: 91,
    social_followers_total: 12800,
    scraped_at: '2026-03-06',
    data_source: 'yelp',
    confidence_score: 98,
    is_duplicate: false,
    created_at: '2026-03-06',
    updated_at: '2026-03-07',
  },
  {
    id: 'c-003',
    name: 'Comfort Zone HVAC',
    industry: ['HVAC', 'Plumbing'],
    license_number: 'FL-HV-2020-2293',
    business_type: 'Sole Proprietor',
    years_in_business: 7,
    phone: '(305) 555-0471',
    email: 'hello@comfortzonehvac.com',
    website: 'https://comfortzonehvac.com',
    office_address: '771 SW 8th St, Miami, FL 33130',
    service_areas: ['Miami', 'Miami Beach', 'Coral Gables', 'Hialeah', 'Doral'],
    hours_of_operation: 'Mon–Sun 8am–8pm',
    rating: { google: 4.6, yelp: 4.5, bbb: 4.4, trustpilot: 4.3, average: 4.45 },
    review_count: 189,
    estimated_revenue: '$890K',
    employee_count: 9,
    credit_rating: 'B+',
    price_range: '$$',
    lead_status: 'contacted',
    last_contacted: '2026-02-28',
    contact_history: [
      { id: 'ch-6', date: '2026-02-28', type: 'email', subject: 'Intro email sent', notes: 'No reply yet.', outcome: 'pending' },
    ],
    notes: 'Growing fast in Miami market. Owner Carlos Mendez handles all sales.',
    tags: ['hvac', 'miami', 'growing'],
    lead_score: 62,
    services_offered: ['AC Installation', 'AC Repair', 'Duct Cleaning', 'Mini-Split Systems', 'Plumbing Repair'],
    certifications: ['EPA 608 Certified', 'NATE Certified'],
    warranties: ['1-Year Parts & Labor'],
    service_radius: 25,
    special_services: ['24/7 Emergency Service', 'Smart Thermostat Installation', 'Air Quality Testing'],
    social_profiles: { facebook: 'fb.com/comfortzonehvac', instagram: 'instagram.com/comfortzonehvac' },
    website_quality_score: 65,
    social_followers_total: 1850,
    scraped_at: '2026-03-01',
    data_source: 'google_maps',
    confidence_score: 87,
    is_duplicate: false,
    created_at: '2026-03-01',
    updated_at: '2026-02-28',
  },
  {
    id: 'c-004',
    name: 'Granite State Electrical',
    industry: ['Electrical'],
    license_number: 'NH-EL-2010-0087',
    business_type: 'LLC',
    years_in_business: 22,
    phone: '(603) 555-0833',
    email: 'office@granitestate-elec.com',
    website: 'https://granitestate-elec.com',
    office_address: '45 Industrial Park Dr, Manchester, NH 03103',
    service_areas: ['Manchester', 'Nashua', 'Concord', 'Bedford', 'Hooksett'],
    hours_of_operation: 'Mon–Fri 7am–5pm',
    rating: { google: 4.7, yelp: 4.5, bbb: 4.8, trustpilot: 0, average: 4.67 },
    review_count: 234,
    estimated_revenue: '$3.1M',
    employee_count: 31,
    credit_rating: 'A',
    price_range: '$$$',
    lead_status: 'new',
    last_contacted: null,
    contact_history: [],
    notes: '',
    tags: ['electrical', 'new-england', 'commercial'],
    lead_score: 74,
    services_offered: ['Commercial Wiring', 'Residential Electrical', 'Panel Upgrades', 'EV Charger Installation', 'Generator Installation'],
    certifications: ['Master Electrician NH', 'NECA Member'],
    warranties: ['2-Year Workmanship'],
    service_radius: 50,
    special_services: ['Industrial Electrical', 'Data Center Wiring', 'Solar Integration'],
    social_profiles: { linkedin: 'linkedin.com/company/granitestate-elec' },
    website_quality_score: 70,
    social_followers_total: 890,
    scraped_at: '2026-03-04',
    data_source: 'bbb',
    confidence_score: 91,
    is_duplicate: false,
    created_at: '2026-03-04',
    updated_at: '2026-03-04',
  },
  {
    id: 'c-005',
    name: 'Keystone Painting Co.',
    industry: ['Painting', 'Drywall'],
    license_number: 'PA-PT-2017-6612',
    business_type: 'LLC',
    years_in_business: 9,
    phone: '(215) 555-0764',
    email: 'estimate@keystonepainting.com',
    website: 'https://keystonepainting.com',
    office_address: '890 N Broad St, Philadelphia, PA 19130',
    service_areas: ['Philadelphia', 'Camden', 'Cherry Hill', 'Bucks County'],
    hours_of_operation: 'Mon–Fri 7:30am–5:30pm',
    rating: { google: 4.5, yelp: 4.4, bbb: 4.6, trustpilot: 4.2, average: 4.43 },
    review_count: 147,
    estimated_revenue: '$1.2M',
    employee_count: 14,
    credit_rating: 'B+',
    price_range: '$$',
    lead_status: 'new',
    last_contacted: null,
    contact_history: [],
    notes: '',
    tags: ['painting', 'philly', 'residential'],
    lead_score: 55,
    services_offered: ['Interior Painting', 'Exterior Painting', 'Cabinet Refinishing', 'Drywall Repair', 'Pressure Washing'],
    certifications: ['EPA Lead-Safe Certified', 'PDCA Member'],
    warranties: ['2-Year Finish Warranty'],
    service_radius: 30,
    special_services: ['Faux Finishes', 'Epoxy Floors', 'Deck Staining'],
    social_profiles: { facebook: 'fb.com/keystonepainting', instagram: 'instagram.com/keystonepainting' },
    website_quality_score: 58,
    social_followers_total: 2100,
    scraped_at: '2026-03-03',
    data_source: 'yelp',
    confidence_score: 82,
    is_duplicate: false,
    created_at: '2026-03-03',
    updated_at: '2026-03-03',
  },
  {
    id: 'c-006',
    name: 'Desert Sun Landscaping',
    industry: ['Landscaping', 'Irrigation'],
    license_number: 'AZ-LS-2014-3351',
    business_type: 'LLC',
    years_in_business: 15,
    phone: '(480) 555-0912',
    email: 'jobs@desertsunlandscape.com',
    website: 'https://desertsunlandscape.com',
    office_address: '2240 E McDowell Rd, Phoenix, AZ 85006',
    service_areas: ['Phoenix', 'Scottsdale', 'Tempe', 'Mesa', 'Chandler', 'Gilbert'],
    hours_of_operation: 'Mon–Sat 6am–4pm',
    rating: { google: 4.7, yelp: 4.8, bbb: 4.7, trustpilot: 0, average: 4.73 },
    review_count: 403,
    estimated_revenue: '$3.5M',
    employee_count: 38,
    credit_rating: 'A',
    price_range: '$$$',
    lead_status: 'interested',
    last_contacted: '2026-03-05',
    contact_history: [
      { id: 'ch-7', date: '2026-03-05', type: 'call', subject: 'Intro call', notes: 'Owner Maria Torres very interested. Said they were looking for a CRM solution.', duration: 22, outcome: 'positive' },
    ],
    notes: 'One of the largest landscaping companies in Phoenix. High volume residential and commercial accounts.',
    tags: ['landscaping', 'arizona', 'high-value'],
    lead_score: 79,
    services_offered: ['Desert Landscaping', 'Sod Installation', 'Drip Irrigation', 'Pool Landscaping', 'Tree Service'],
    certifications: ['AZ Landscape Contractors Assoc', 'Irrigation Assoc Certified'],
    warranties: ['1-Year Plant Warranty', '2-Year Irrigation'],
    service_radius: 45,
    special_services: ['Xeriscaping', 'HOA Management', 'Commercial Maintenance Contracts'],
    social_profiles: { facebook: 'fb.com/desertsunlandscape', instagram: 'instagram.com/desertsunlandscape', linkedin: 'linkedin.com/company/desertsunlandscape' },
    website_quality_score: 76,
    social_followers_total: 8900,
    scraped_at: '2026-03-02',
    data_source: 'google_maps',
    confidence_score: 93,
    is_duplicate: false,
    created_at: '2026-03-02',
    updated_at: '2026-03-05',
  },
  {
    id: 'c-007',
    name: 'Atlas Plumbing Services',
    industry: ['Plumbing'],
    license_number: 'WA-PL-2012-9981',
    business_type: 'S-Corp',
    years_in_business: 19,
    phone: '(206) 555-0377',
    email: 'service@atlasplumbing.com',
    website: 'https://atlasplumbing.com',
    office_address: '1450 15th Ave W, Seattle, WA 98119',
    service_areas: ['Seattle', 'Bellevue', 'Redmond', 'Kirkland', 'Renton'],
    hours_of_operation: 'Mon–Sun 7am–9pm',
    rating: { google: 4.8, yelp: 4.7, bbb: 4.9, trustpilot: 4.6, average: 4.75 },
    review_count: 576,
    estimated_revenue: '$4.2M',
    employee_count: 41,
    credit_rating: 'A',
    price_range: '$$$',
    lead_status: 'new',
    last_contacted: null,
    contact_history: [],
    notes: '',
    tags: ['plumbing', 'seattle', 'high-rating'],
    lead_score: 81,
    services_offered: ['Emergency Plumbing', 'Pipe Repair', 'Water Heater Install', 'Drain Cleaning', 'Repiping'],
    certifications: ['WA Master Plumber', 'PHCC Member'],
    warranties: ['2-Year Labor', '5-Year Equipment'],
    service_radius: 40,
    special_services: ['Trenchless Sewer Repair', 'Hydro Jetting', 'Water Filtration Systems'],
    social_profiles: { facebook: 'fb.com/atlasplumbing', instagram: 'instagram.com/atlasplumbing' },
    website_quality_score: 79,
    social_followers_total: 3400,
    scraped_at: '2026-03-05',
    data_source: 'google_maps',
    confidence_score: 96,
    is_duplicate: false,
    created_at: '2026-03-05',
    updated_at: '2026-03-05',
  },
  {
    id: 'c-008',
    name: 'Metro Concrete & Masonry',
    industry: ['Concrete', 'Masonry', 'Hardscaping'],
    license_number: 'IL-CM-2011-4455',
    business_type: 'LLC',
    years_in_business: 21,
    phone: '(773) 555-0628',
    email: 'bid@metroconcrete.com',
    website: 'https://metroconcrete.com',
    office_address: '2600 S Halsted St, Chicago, IL 60608',
    service_areas: ['Chicago', 'Evanston', 'Oak Park', 'Cicero', 'Berwyn'],
    hours_of_operation: 'Mon–Fri 6am–6pm',
    rating: { google: 4.5, yelp: 4.3, bbb: 4.6, trustpilot: 0, average: 4.47 },
    review_count: 218,
    estimated_revenue: '$6.1M',
    employee_count: 58,
    credit_rating: 'A-',
    price_range: '$$$',
    lead_status: 'won',
    last_contacted: '2026-02-15',
    contact_history: [
      { id: 'ch-8', date: '2026-02-15', type: 'meeting', subject: 'Contract signed', notes: 'Signed 12-month enterprise contract. $48K ARR.', outcome: 'won' },
    ],
    notes: 'Already a customer. Upsell opportunity for premium analytics plan.',
    tags: ['customer', 'chicago', 'commercial', 'upsell'],
    lead_score: 91,
    services_offered: ['Commercial Concrete', 'Foundation Repair', 'Stamped Concrete', 'Retaining Walls', 'Brick Repair'],
    certifications: ['ACI Certified Flatwork Finisher', 'MCAA Member'],
    warranties: ['5-Year Structural Warranty'],
    service_radius: 55,
    special_services: ['Decorative Concrete', 'Parking Lot Paving', 'Industrial Flooring'],
    social_profiles: { linkedin: 'linkedin.com/company/metroconcrete', facebook: 'fb.com/metroconcrete' },
    website_quality_score: 68,
    social_followers_total: 2300,
    scraped_at: '2026-02-10',
    data_source: 'bbb',
    confidence_score: 97,
    is_duplicate: false,
    created_at: '2026-02-10',
    updated_at: '2026-02-15',
  },
  {
    id: 'c-009',
    name: 'Sunbelt Window & Door',
    industry: ['Windows', 'Doors', 'Glass'],
    license_number: 'GA-WD-2018-8823',
    business_type: 'LLC',
    years_in_business: 8,
    phone: '(404) 555-0241',
    email: 'sales@sunbeltwindow.com',
    website: 'https://sunbeltwindow.com',
    office_address: '540 Peachtree Industrial Blvd, Norcross, GA 30071',
    service_areas: ['Atlanta', 'Alpharetta', 'Marietta', 'Decatur', 'Sandy Springs'],
    hours_of_operation: 'Mon–Fri 8am–5pm, Sat 9am–1pm',
    rating: { google: 4.6, yelp: 4.4, bbb: 4.7, trustpilot: 4.5, average: 4.55 },
    review_count: 312,
    estimated_revenue: '$2.1M',
    employee_count: 22,
    credit_rating: 'B+',
    price_range: '$$',
    lead_status: 'lost',
    last_contacted: '2026-01-20',
    contact_history: [
      { id: 'ch-9', date: '2026-01-20', type: 'call', subject: 'Lost – went with competitor', notes: 'Chose HomeAdvisor integration instead. Follow up in 6 months.', outcome: 'lost' },
    ],
    notes: 'Lost deal. Re-engage Q3 2026.',
    tags: ['windows', 'atlanta', 'follow-up-q3'],
    lead_score: 48,
    services_offered: ['Window Replacement', 'Door Installation', 'Sliding Glass Doors', 'Skylights', 'Storm Windows'],
    certifications: ['AAMA Certified', 'Energy Star Partner'],
    warranties: ['Lifetime Glass Warranty', '10-Year Frame'],
    service_radius: 50,
    special_services: ['Historic Window Restoration', 'Impact Glass (Hurricane)', 'Commercial Storefronts'],
    social_profiles: { facebook: 'fb.com/sunbeltwindow', instagram: 'instagram.com/sunbeltwindow' },
    website_quality_score: 72,
    social_followers_total: 3100,
    scraped_at: '2026-01-15',
    data_source: 'yelp',
    confidence_score: 89,
    is_duplicate: false,
    created_at: '2026-01-15',
    updated_at: '2026-01-20',
  },
  {
    id: 'c-010',
    name: 'BlueStar Remodeling Group',
    industry: ['General Contractor', 'Kitchen & Bath', 'Remodeling'],
    license_number: 'CO-GC-2009-1177',
    business_type: 'LLC',
    years_in_business: 20,
    phone: '(720) 555-0389',
    email: 'projects@bluestarremodeling.com',
    website: 'https://bluestarremodeling.com',
    office_address: '8760 Pecos St, Denver, CO 80221',
    service_areas: ['Denver', 'Aurora', 'Lakewood', 'Thornton', 'Westminster', 'Arvada'],
    hours_of_operation: 'Mon–Fri 7am–6pm',
    rating: { google: 4.9, yelp: 4.8, bbb: 5.0, trustpilot: 4.9, average: 4.9 },
    review_count: 841,
    estimated_revenue: '$8.3M',
    employee_count: 72,
    credit_rating: 'A+',
    price_range: '$$$$',
    lead_status: 'negotiating',
    last_contacted: '2026-03-08',
    contact_history: [
      { id: 'ch-10', date: '2026-03-08', type: 'call', subject: 'Price negotiation', notes: 'Wants 20% discount for 2-year commitment. Escalated to manager.', duration: 38, outcome: 'pending' },
      { id: 'ch-11', date: '2026-03-03', type: 'meeting', subject: 'Demo + proposal', notes: 'Very positive demo. Strong interest in bulk SMS feature.', duration: 60, outcome: 'positive' },
      { id: 'ch-12', date: '2026-02-28', type: 'email', subject: 'Case studies + ROI', notes: 'Sent 3 case studies from similar GCs.', outcome: 'replied' },
    ],
    notes: 'Largest full-service GC in Denver metro. Will be major flagship account.',
    tags: ['hot-lead', 'enterprise', 'denver', 'remodeling', 'flagship'],
    lead_score: 97,
    services_offered: ['Full Home Remodels', 'Kitchen Remodeling', 'Bathroom Remodeling', 'Additions', 'ADU Construction'],
    certifications: ['NKBA Certified Designer', 'NAHB Remodeler', 'EPA Lead-Safe'],
    warranties: ['5-Year Labor', '1-Year Project Completion'],
    service_radius: 60,
    special_services: ['Luxury Remodels', 'Historic Preservation', 'Aging-in-Place Design'],
    social_profiles: { facebook: 'fb.com/bluestarremodeling', instagram: 'instagram.com/bluestarremodeling', linkedin: 'linkedin.com/company/bluestarremodeling', twitter: 'twitter.com/bluestarremods' },
    website_quality_score: 95,
    social_followers_total: 22400,
    scraped_at: '2026-02-25',
    data_source: 'google_maps',
    confidence_score: 99,
    is_duplicate: false,
    created_at: '2026-02-25',
    updated_at: '2026-03-08',
  },
  {
    id: 'c-011',
    name: 'ClearView Glass & Mirror',
    industry: ['Glass', 'Windows', 'Shower Enclosures'],
    license_number: 'NV-GL-2016-5590',
    business_type: 'Sole Proprietor',
    years_in_business: 10,
    phone: '(702) 555-0182',
    email: 'quote@clearviewglass.com',
    website: 'https://clearviewglass.com',
    office_address: '4320 S Eastern Ave, Las Vegas, NV 89119',
    service_areas: ['Las Vegas', 'Henderson', 'North Las Vegas', 'Summerlin'],
    hours_of_operation: 'Mon–Fri 8am–5pm',
    rating: { google: 4.4, yelp: 4.3, bbb: 4.5, trustpilot: 0, average: 4.4 },
    review_count: 98,
    estimated_revenue: '$680K',
    employee_count: 7,
    credit_rating: 'B',
    price_range: '$$',
    lead_status: 'new',
    last_contacted: null,
    contact_history: [],
    notes: '',
    tags: ['glass', 'vegas', 'small-biz'],
    lead_score: 41,
    services_offered: ['Custom Glass', 'Shower Doors', 'Mirror Installation', 'Glass Table Tops', 'Window Repair'],
    certifications: ['NGA Member'],
    warranties: ['1-Year Labor'],
    service_radius: 20,
    special_services: ['Custom Frameless Showers', 'Wine Cellar Glass', 'Commercial Glass'],
    social_profiles: { instagram: 'instagram.com/clearviewglass' },
    website_quality_score: 49,
    social_followers_total: 540,
    scraped_at: '2026-03-07',
    data_source: 'yelp',
    confidence_score: 72,
    is_duplicate: false,
    created_at: '2026-03-07',
    updated_at: '2026-03-07',
  },
  {
    id: 'c-012',
    name: 'Pioneer Insulation LLC',
    industry: ['Insulation', 'Energy Efficiency'],
    license_number: 'OR-IN-2013-7720',
    business_type: 'LLC',
    years_in_business: 14,
    phone: '(503) 555-0544',
    email: 'info@pioneerinsulation.com',
    website: 'https://pioneerinsulation.com',
    office_address: '1290 SE Powell Blvd, Portland, OR 97202',
    service_areas: ['Portland', 'Beaverton', 'Hillsboro', 'Lake Oswego', 'Vancouver WA'],
    hours_of_operation: 'Mon–Fri 7:30am–4:30pm',
    rating: { google: 4.7, yelp: 4.6, bbb: 4.8, trustpilot: 4.5, average: 4.65 },
    review_count: 267,
    estimated_revenue: '$2.8M',
    employee_count: 28,
    credit_rating: 'A',
    price_range: '$$$',
    lead_status: 'contacted',
    last_contacted: '2026-03-06',
    contact_history: [
      { id: 'ch-13', date: '2026-03-06', type: 'call', subject: 'Intro call', notes: 'Spoke with owner Dave Chen. Interested but wants to see case studies from insulation contractors.', duration: 15, outcome: 'neutral' },
    ],
    notes: 'Niche but strong. Lots of green building work. Looking for referral network.',
    tags: ['insulation', 'portland', 'green-building'],
    lead_score: 66,
    services_offered: ['Spray Foam', 'Blown-In Insulation', 'Batt Insulation', 'Vapor Barriers', 'Crawl Space Encapsulation'],
    certifications: ['BPI Certified Building Analyst', 'EPA Green Contractor'],
    warranties: ['Lifetime Spray Foam Warranty'],
    service_radius: 55,
    special_services: ['Energy Audits', 'Passive House Insulation', 'Commercial Insulation'],
    social_profiles: { linkedin: 'linkedin.com/company/pioneerinsulation', facebook: 'fb.com/pioneerinsulation' },
    website_quality_score: 71,
    social_followers_total: 1600,
    scraped_at: '2026-03-04',
    data_source: 'bbb',
    confidence_score: 90,
    is_duplicate: false,
    created_at: '2026-03-04',
    updated_at: '2026-03-06',
  },
]

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useContractors() {
  return MOCK_CONTRACTORS
}

export function useContractorFilters() {
  const [filters, setFilters] = useState<ContractorFilters>(DEFAULT_FILTERS)

  const updateFilter = <K extends keyof ContractorFilters>(
    key: K,
    value: ContractorFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => setFilters(DEFAULT_FILTERS)

  return { filters, updateFilter, resetFilters }
}

export function useFilteredContractors(
  contractors: Contractor[],
  filters: ContractorFilters
) {
  return useMemo(() => {
    return contractors.filter((c) => {
      // Search
      if (filters.search) {
        const q = filters.search.toLowerCase()
        const matchSearch =
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.office_address.toLowerCase().includes(q) ||
          c.industry.some((i) => i.toLowerCase().includes(q)) ||
          c.tags.some((t) => t.toLowerCase().includes(q)) ||
          c.services_offered.some((s) => s.toLowerCase().includes(q))
        if (!matchSearch) return false
      }

      // Industries
      if (filters.industries.length > 0) {
        const hasIndustry = c.industry.some((ind) => filters.industries.includes(ind))
        if (!hasIndustry) return false
      }

      // States (derived from office_address)
      if (filters.states.length > 0) {
        const hasState = filters.states.some((s) => c.office_address.includes(s))
        if (!hasState) return false
      }

      // Rating
      if (c.rating.average < filters.minRating || c.rating.average > filters.maxRating) {
        return false
      }

      // Price ranges
      if (filters.priceRanges.length > 0 && !filters.priceRanges.includes(c.price_range)) {
        return false
      }

      // Lead statuses
      if (filters.leadStatuses.length > 0 && !filters.leadStatuses.includes(c.lead_status)) {
        return false
      }

      // Lead score
      if (c.lead_score < filters.minLeadScore || c.lead_score > filters.maxLeadScore) {
        return false
      }

      // Data sources
      if (filters.dataSources.length > 0 && !filters.dataSources.includes(c.data_source)) {
        return false
      }

      // Tags
      if (filters.tags.length > 0) {
        const hasTags = filters.tags.some((t) => c.tags.includes(t))
        if (!hasTags) return false
      }

      // Verified only (email + phone present)
      if (filters.verifiedOnly && (!c.email || !c.phone)) {
        return false
      }

      return true
    })
  }, [contractors, filters])
}

export function useLeadStatusUpdate() {
  // In a real app this would call an API; with mock data we just show a toast
  const updateStatus = (id: string, status: ContractorLeadStatus) => {
    console.log(`Update contractor ${id} status to ${status}`)
  }
  return updateStatus
}

export const ALL_INDUSTRIES = [
  'General Contractor',
  'Flooring',
  'Roofing',
  'HVAC',
  'Plumbing',
  'Electrical',
  'Painting',
  'Landscaping',
  'Concrete',
  'Masonry',
  'Hardscaping',
  'Windows',
  'Doors',
  'Glass',
  'Shower Enclosures',
  'Kitchen & Bath',
  'Remodeling',
  'Insulation',
  'Drywall',
  'Siding',
  'Gutters',
  'Energy Efficiency',
  'Irrigation',
]

export const ALL_DATA_SOURCES = ['google_maps', 'yelp', 'bbb', 'angi', 'houzz', 'thumbtack']

export const ALL_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
]
