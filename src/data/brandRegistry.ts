export interface BrandRegistryEntry {
  brand: string;
  category: 'Banking' | 'UPI' | 'Courier' | 'Government' | 'Utility' | 'Telecom';
  officialDomains: string[];
  lookalikeKeywords: string[];
}

/**
 * Configurable Local Registry for Brand & Institution Domain Verification.
 * Prevents hardcoding false claims and is designed for threat intelligence API plugins.
 */
export const OFFICIAL_BRAND_REGISTRY: BrandRegistryEntry[] = [
  {
    brand: 'State Bank of India (SBI)',
    category: 'Banking',
    officialDomains: ['onlinesbi.sbi', 'sbi.co.in', 'sbicard.com'],
    lookalikeKeywords: ['sbi', 'onlinesbi', 'sbikyc', 'sbiyono', 'sbi-card']
  },
  {
    brand: 'HDFC Bank',
    category: 'Banking',
    officialDomains: ['hdfcbank.com'],
    lookalikeKeywords: ['hdfc', 'hdfcbk', 'hdfcnetbanking', 'hdfc-kyc']
  },
  {
    brand: 'ICICI Bank',
    category: 'Banking',
    officialDomains: ['icicibank.com'],
    lookalikeKeywords: ['icici', 'icicibk', 'icici-verify']
  },
  {
    brand: 'Punjab National Bank (PNB)',
    category: 'Banking',
    officialDomains: ['pnbindia.in'],
    lookalikeKeywords: ['pnb', 'pnbindia', 'pnbnet']
  },
  {
    brand: 'India Post',
    category: 'Courier',
    officialDomains: ['indiapost.gov.in'],
    lookalikeKeywords: ['indiapost', 'india-post', 'post-delivery', 'indiapost-parcel']
  },
  {
    brand: 'Paytm Payments Bank',
    category: 'UPI',
    officialDomains: ['paytm.com'],
    lookalikeKeywords: ['paytm', 'paytm-kyc', 'paytm-cashback']
  },
  {
    brand: 'PhonePe',
    category: 'UPI',
    officialDomains: ['phonepe.com'],
    lookalikeKeywords: ['phonepe', 'phonepe-reward', 'phonepe-cash']
  },
  {
    brand: 'Income Tax Department (India)',
    category: 'Government',
    officialDomains: ['incometax.gov.in'],
    lookalikeKeywords: ['incometax', 'tax-refund', 'it-challan']
  },
  {
    brand: 'State Electricity Board',
    category: 'Utility',
    officialDomains: ['bijli.gov.in'],
    lookalikeKeywords: ['bijli', 'power-officer', 'electricity-bill', 'power-cut']
  }
];

export function verifyBrandDomain(domain: string): {
  isImpersonating: boolean;
  matchedBrand?: string;
  officialDomain?: string;
  warning?: string;
} {
  const cleanDomain = domain.toLowerCase();

  for (const entry of OFFICIAL_BRAND_REGISTRY) {
    const isOfficial = entry.officialDomains.some(
      off => cleanDomain === off || cleanDomain.endsWith('.' + off)
    );

    if (isOfficial) {
      return { isImpersonating: false };
    }

    const matchesKeyword = entry.lookalikeKeywords.some(keyword =>
      cleanDomain.includes(keyword)
    );

    if (matchesKeyword) {
      return {
        isImpersonating: true,
        matchedBrand: entry.brand,
        officialDomain: entry.officialDomains[0],
        warning: `Domain does not appear to match official domain (${entry.officialDomains[0]}). Potential brand impersonation detected.`
      };
    }
  }

  return { isImpersonating: false };
}
