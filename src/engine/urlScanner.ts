import { UrlAnalysisDetails } from '../types';
import { verifyBrandDomain } from '../data/brandRegistry';

const SUSPICIOUS_TLDS = [
  '.xyz', '.top', '.site', '.work', '.click', '.tk', '.ml', '.ga', '.cf', 
  '.gq', '.pw', '.icu', '.link', '.cc', '.buzz', '.monster', '.live', '.online'
];

const KNOWN_SHORTENERS = [
  'bit.ly', 'tinyurl.com', 't.co', 'is.gd', 'buff.ly', 'ow.ly', 'cutt.ly', 'rb.gy'
];

export function analyzeUrlString(rawUrl: string): UrlAnalysisDetails {
  let cleaned = rawUrl.trim();
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = 'http://' + cleaned;
  }

  let domain = '';
  let protocol = 'http:';
  let isHttps = false;
  let subdomainCount = 0;
  const riskIndicators: string[] = [];

  try {
    const parsed = new URL(cleaned);
    domain = parsed.hostname.toLowerCase();
    protocol = parsed.protocol;
    isHttps = protocol === 'https:';
    const parts = domain.split('.');
    subdomainCount = Math.max(0, parts.length - 2);

    // Check query parameters for sensitive triggers
    const query = parsed.search.toLowerCase();
    if (query.includes('otp') || query.includes('token') || query.includes('pin') || query.includes('password') || query.includes('bank')) {
      riskIndicators.push('URL contains sensitive credential-seeking query parameters.');
    }

    // Check suspicious path words
    const path = parsed.pathname.toLowerCase();
    if (path.includes('kyc') || path.includes('login') || path.includes('verify') || path.includes('claim') || path.includes('apk')) {
      if (!isHttps) {
        riskIndicators.push('Action-forcing path (e.g. login/kyc) over insecure HTTP.');
      }
    }
  } catch (e) {
    domain = cleaned.split('/')[0].toLowerCase();
  }

  // 1. IP address in domain
  const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  const hasIpAddress = ipRegex.test(domain);
  if (hasIpAddress) {
    riskIndicators.push('URL uses a raw numerical IP address instead of a registered domain name.');
  }

  // 2. Suspicious TLD
  const hasSuspiciousTld = SUSPICIOUS_TLDS.some(tld => domain.endsWith(tld));
  if (hasSuspiciousTld) {
    riskIndicators.push(`Uses a suspicious or low-reputation top-level domain frequently used in phishing.`);
  }

  // 3. Shortener
  const isShortener = KNOWN_SHORTENERS.some(shortener => domain.includes(shortener));
  if (isShortener) {
    riskIndicators.push('Uses a URL shortener which hides the true destination address.');
  }

  // 4. Insecure HTTP
  if (!isHttps) {
    riskIndicators.push('Unencrypted connection (HTTP). Personal information can be intercepted.');
  }

  // 5. Excessive subdomains or hyphens
  if (subdomainCount >= 3) {
    riskIndicators.push(`Contains deeply nested subdomains (${subdomainCount} levels), common in cloaking.`);
  }
  const hyphenCount = (domain.match(/-/g) || []).length;
  if (hyphenCount >= 3) {
    riskIndicators.push('Domain contains excessive hyphens often used to disguise fake brand names.');
  }

  // 6. Brand Impersonation Registry Check
  const brandCheck = verifyBrandDomain(domain);
  let impersonatedBrand: string | undefined;
  if (brandCheck.isImpersonating && brandCheck.matchedBrand) {
    impersonatedBrand = brandCheck.matchedBrand;
    riskIndicators.push(brandCheck.warning || `Potential brand impersonation of ${brandCheck.matchedBrand}.`);
  }

  return {
    rawUrl,
    domain,
    protocol,
    isHttps,
    hasIpAddress,
    hasSuspiciousTld,
    isShortener,
    impersonatedBrand,
    subdomainCount,
    riskIndicators
  };
}
