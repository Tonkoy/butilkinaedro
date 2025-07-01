// src/config-tenants.js
const TENANT_CONFIGS = {
  butilkinaedro: {
    name: 'Butilkinaedro - Бутилки, термоси и термо чаши на едро и дребно',
    description: 'Бутилки, термоси и термо чаши на едро и дребно',
    appName: 'Butilkinaedro - Бутилки, термоси и термо чаши на едро и дребно',
    domain: 'butilkinaedro.com',
    dbName: 'butilkinaedro',
    primaryColor: '#1976d2',
    logos: {
      single: '/logo/butilkinaedro_logo_single.svg',
      full: '/logo/butilkinaedro_logo_v3.svg',
      singleLogo: {
        width: 50,
        height: 50
      },
      fullLogo: {
        width: 250,
        height: 100
      }
    },
    favicon: '/favicon-butilkinaedro.ico',
    mailTemplates: 'butilkinaedro',
    theme: {
      fontFamily: 'Public Sans',
      borderRadius: 8
    }
  },
  ranicinaedro: {
    name: 'Ranicinaedro - Раници и чанти на едро и дребно',
    description: 'Раници и чанти на едро и дребно',
    appName: 'Ranicinaedro - Раници и чанти на едро и дребно',
    domain: 'ranicinaedro.com',
    dbName: 'ranicinaedro',
    primaryColor: '#00a76f',
    logos: {
      single: '/logo/ranicinaedro_logo_single.svg',
      full: '/logo/ranicinaedro_logo.svg',
      singleLogo: {
        width: 50,
        height: 50
      },
      fullLogo: {
        width: 180,
        height: 100
      }
    },
    favicon: '/favicon-ranicinaedro.ico',
    mailTemplates: 'ranicinaedro',
    theme: {
      fontFamily: 'Inter',
      borderRadius: 12
    }
  },
  // Add other 3 tenants here...
  textile: {
    name: 'Textile Solutions',
    description: 'Professional textile solutions',
    appName: 'Textile Solutions',
    domain: 'textile-solutions.com',
    dbName: 'textile',
    primaryColor: '#9c27b0',
    secondaryColor: '#f57c00',
    logos: {
      single: '/logo/textile_logo_single.svg',
      full: '/logo/textile_logo_full.svg'
    },
    favicon: '/favicon-textile.ico',
    mailTemplates: 'textile',
    theme: {
      fontFamily: 'Nunito Sans',
      borderRadius: 6
    }
  }
};

export function getCurrentTenant() {
  return process.env.NEXT_PUBLIC_FE_DOMAIN || 'butilkinaedro';
}

export function getTenantConfig(tenantId = null) {
  const tenant = tenantId || getCurrentTenant();
  return TENANT_CONFIGS[tenant] || TENANT_CONFIGS.butilkinaedro;
}

export default TENANT_CONFIGS;
