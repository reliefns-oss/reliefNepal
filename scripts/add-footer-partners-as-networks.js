#!/usr/bin/env node

// Script to add footer useful links as networks/partners in the database
// Run with: node scripts/add-footer-partners-as-networks.js

require('dotenv').config({ path: '.env' });

const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT || 5432,
  database: process.env.PGDATABASE || 'reliefnepal',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'yogesh@552',
});

const partners = [
  {
    name: 'All Hands and Hearts (AHAH)',
    slug: 'all-hands-and-hearts',
    relationship_type: 'resource_provider',
    short_description: 'International disaster relief organization providing immediate and long-term support to communities affected by natural disasters.',
    description: 'All Hands and Hearts (AHAH) is a global nonprofit that effectively and efficiently addresses the immediate and long-term needs of communities impacted by natural disasters. They work alongside communities to rebuild safer, more resilient schools, homes, and infrastructure.',
    location: 'Global',
    website_url: 'https://www.allhandsandhearts.org/',
    logo_url: null,
    logo_public_id: null,
    display_order: 1,
    publication_status: 'published',
  },
  {
    name: 'NATAN',
    slug: 'natan',
    relationship_type: 'resource_provider',
    short_description: 'Israeli humanitarian organization providing medical and disaster relief worldwide.',
    description: 'NATAN is an Israeli humanitarian organization that provides medical aid, disaster relief, and capacity building in crisis zones around the world. They work with local partners to deliver emergency medical care and build resilient health systems.',
    location: 'Global',
    website_url: 'https://natanrelief.org',
    logo_url: null,
    logo_public_id: null,
    display_order: 2,
    publication_status: 'published',
  },
  {
    name: 'National Jesuit Social Institute (NJSI)',
    slug: 'national-jesuit-social-institute',
    relationship_type: 'local_district',
    short_description: 'Nepal-based Jesuit organization working for social justice and marginalized communities.',
    description: 'The National Jesuit Social Institute (NJSI) is the social apostolate of the Nepal Jesuit Society. They work for the empowerment of marginalized communities, promotion of social justice, and sustainable development in Nepal through education, livelihood, and advocacy programs.',
    location: 'Nepal',
    website_url: 'http://www.njsi.org.np/',
    logo_url: null,
    logo_public_id: null,
    display_order: 3,
    publication_status: 'published',
  },
  {
    name: 'Concern Worldwide (CWW)',
    slug: 'concern-worldwide',
    relationship_type: 'resource_provider',
    short_description: 'International humanitarian organization fighting extreme poverty.',
    description: 'Concern Worldwide is an international humanitarian organization dedicated to tackling poverty and suffering in the world\'s poorest countries. They work on emergency response, health, nutrition, education, and livelihoods programs.',
    location: 'Global',
    website_url: 'https://www.concern.net/',
    logo_url: null,
    logo_public_id: null,
    display_order: 4,
    publication_status: 'published',
  },
  {
    name: 'World Vision International Nepal (WVIN)',
    slug: 'world-vision-international-nepal',
    relationship_type: 'resource_provider',
    short_description: 'Global Christian humanitarian organization working with children, families, and communities.',
    description: 'World Vision International Nepal is part of a global partnership working with children, families, and communities to overcome poverty and injustice. They focus on child protection, education, health, nutrition, and livelihood programs in Nepal.',
    location: 'Nepal',
    website_url: 'http://www.wvi.org/nepal',
    logo_url: null,
    logo_public_id: null,
    display_order: 5,
    publication_status: 'published',
  },
  {
    name: 'Association of INGO Nepal (AIN)',
    slug: 'association-of-ingo-nepal',
    relationship_type: 'resource_provider',
    short_description: 'Network of international NGOs working in Nepal.',
    description: 'The Association of International NGOs in Nepal (AIN) is a network of international non-governmental organizations working in Nepal. They coordinate and advocate for effective development and humanitarian assistance in Nepal.',
    location: 'Nepal',
    website_url: 'http://www.ain.org.np/',
    logo_url: null,
    logo_public_id: null,
    display_order: 6,
    publication_status: 'published',
  },
  {
    name: 'Government of Nepal',
    slug: 'government-of-nepal',
    relationship_type: 'local_district',
    short_description: 'Official government portal of Nepal.',
    description: 'The Government of Nepal is the federal government of the Federal Democratic Republic of Nepal. The official government portal provides access to government services, policies, and information for citizens and organizations.',
    location: 'Nepal',
    website_url: 'http://www.nepal.gov.np/',
    logo_url: null,
    logo_public_id: null,
    display_order: 7,
    publication_status: 'published',
  },
];

async function addPartners() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    for (const partner of partners) {
      // Check if partner already exists
      const existing = await client.query(
        'SELECT id FROM network_partners WHERE slug = $1',
        [partner.slug]
      );

      if (existing.rows.length > 0) {
        console.log(`Partner "${partner.name}" already exists, skipping...`);
        continue;
      }

      // Insert new partner
      const result = await client.query(
        `INSERT INTO network_partners (
          name, slug, relationship_type, short_description, description,
          location, website_url, logo_url, logo_public_id, display_order, publication_status,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
        RETURNING id`,
        [
          partner.name,
          partner.slug,
          partner.relationship_type,
          partner.short_description,
          partner.description,
          partner.location,
          partner.website_url,
          partner.logo_url,
          partner.logo_public_id,
          partner.display_order,
          partner.publication_status,
        ]
      );

      console.log(`Added partner: ${partner.name} (ID: ${result.rows[0].id})`);
    }

    await client.query('COMMIT');
    console.log('All partners added successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding partners:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

addPartners();