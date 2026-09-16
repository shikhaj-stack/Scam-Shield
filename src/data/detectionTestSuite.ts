import { analyzeMessageLocally } from '../engine/riskEngine';
import { RiskLevel } from '../types';

export interface TestCase {
  id: string;
  category: 'SUSPICIOUS' | 'LEGITIMATE';
  title: string;
  input: string;
  expectedRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  rationale: string;
}

export const DETECTION_TEST_SUITE: TestCase[] = [
  // 10 SUSPICIOUS / SCAM TEST CASES
  {
    id: 's-1',
    category: 'SUSPICIOUS',
    title: 'Urgent Bank Block Notice (Phishing)',
    input: 'URGENT! Your SBI account will be blocked today within 2 hours. Complete KYC immediately at http://sbi-kyc-update.xyz/verify',
    expectedRisk: 'HIGH',
    rationale: 'Combines urgent threat ("blocked today within 2 hours") with unverified lookalike phishing link.'
  },
  {
    id: 's-2',
    category: 'SUSPICIOUS',
    title: 'India Post Delivery Fee Demand',
    input: 'India Post: Your parcel #IN98124 is detained. Pay pending ₹25 customs fee here: http://indiapost-parcel.top/pay before 6 PM.',
    expectedRisk: 'HIGH',
    rationale: 'Courier customs fee lure with suspicious .top TLD.'
  },
  {
    id: 's-3',
    category: 'SUSPICIOUS',
    title: 'KBC Lottery Cash Prize Lure',
    input: 'Congratulations! Your mobile won ₹50,000 in KBC WhatsApp Lucky Draw. Claim your prize now: http://kbc-reward-claim.site/win',
    expectedRisk: 'HIGH',
    rationale: 'Lottery reward hook with fake prize claim URL.'
  },
  {
    id: 's-4',
    category: 'SUSPICIOUS',
    title: 'Electricity Power Disconnection Scam',
    input: 'Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM by electricity office because bill unpaid. Call 98112XXXXX immediately.',
    expectedRisk: 'HIGH',
    rationale: 'Utility disconnection panic creating urgency.'
  },
  {
    id: 's-5',
    category: 'SUSPICIOUS',
    title: 'UPI Cashback PIN Harvesting',
    input: 'You have received ₹1,500 PhonePe cashback reward! Enter your UPI PIN at http://phonepe-cashback.link to credit amount to your bank.',
    expectedRisk: 'HIGH',
    rationale: 'UPI PIN request for receiving money (classic PIN scam).'
  },
  {
    id: 's-6',
    category: 'SUSPICIOUS',
    title: 'Work From Home / Daily Earnings Scam',
    input: 'Earn ₹3,000 to ₹5,000 daily from home by liking YouTube videos. Contact our Telegram task manager immediately for instant payout.',
    expectedRisk: 'HIGH',
    rationale: 'Part-time job task lure with daily payout claims.'
  },
  {
    id: 's-7',
    category: 'SUSPICIOUS',
    title: 'Remote APK / AnyDesk Hijack Request',
    input: 'Bank customer service: Your mobile banking requires update. Please download AnyDesk and APK file from http://quick-support-bank.site to prevent card freeze.',
    expectedRisk: 'CRITICAL',
    rationale: 'Malicious remote desktop APK request with account freeze threat.'
  },
  {
    id: 's-8',
    category: 'SUSPICIOUS',
    title: 'Police / Court Challan Legal Threat',
    input: 'Final Notice from Police Cyber Cell: Your arrest warrant has been issued for unpaid traffic court challan. Settle immediately at http://traffic-police-challan.pw',
    expectedRisk: 'HIGH',
    rationale: 'Law enforcement threat combined with low-reputation .pw domain.'
  },
  {
    id: 's-9',
    category: 'SUSPICIOUS',
    title: 'Family Impersonation ("Hi Mom")',
    input: 'Hi Mom, I lost my phone and this is my new temporary number. Please send ₹8,000 to my friend via UPI urgently, I will explain later.',
    expectedRisk: 'HIGH',
    rationale: 'Family impersonation urgent money request from unknown number.'
  },
  {
    id: 's-10',
    category: 'SUSPICIOUS',
    title: 'Card Expired CVV Request',
    input: 'Your debit card ending 4012 expires today. Reply with your 16-digit card number and CVV to renew your card instantly.',
    expectedRisk: 'HIGH',
    rationale: 'Direct credential and CVV request over message.'
  },

  // 10 LEGITIMATE / SAFE TEST CASES (FALSE-POSITIVE DEFENSE)
  {
    id: 'l-1',
    category: 'LEGITIMATE',
    title: 'Legitimate Monthly Bank Statement Notice',
    input: 'Dear Customer, your monthly e-statement for account ending 4892 is available in the official mobile banking application. Never share OTP or passwords.',
    expectedRisk: 'LOW',
    rationale: 'Mentions bank and OTP disclaimer, advises official app, no suspicious link.'
  },
  {
    id: 'l-2',
    category: 'LEGITIMATE',
    title: 'Legitimate Periodic KYC Reminder',
    input: 'Dear Customer, please update your KYC details periodically through the official bank application or visit your nearest branch.',
    expectedRisk: 'LOW',
    rationale: 'Mentions "KYC" without false urgency, directs user to official branch or app.'
  },
  {
    id: 'l-3',
    category: 'LEGITIMATE',
    title: 'Legitimate Debit Card Transaction Alert',
    input: 'Rs. 450.00 spent on your HDFC Bank card ending 1024 at Apollo Pharmacy on 16-Sep-26. Avail balance: Rs. 14,200.',
    expectedRisk: 'LOW',
    rationale: 'Standard informative transaction alert with balance update.'
  },
  {
    id: 'l-4',
    category: 'LEGITIMATE',
    title: 'Legitimate Bank Anti-Fraud Warning',
    input: 'SBI Security Advisory: Bank officials never call or SMS asking for OTP, UPI PIN, password or CVV. Stay alert against fraudsters.',
    expectedRisk: 'LOW',
    rationale: 'Standard bank anti-fraud awareness broadcast.'
  },
  {
    id: 'l-5',
    category: 'LEGITIMATE',
    title: 'Legitimate In-Person Branch Invitation',
    input: 'Visit your home branch between 10 AM to 4 PM to collect your new cheque book or apply for fixed deposit schemes.',
    expectedRisk: 'LOW',
    rationale: 'Directs to physical branch with no urgency.'
  },
  {
    id: 'l-6',
    category: 'LEGITIMATE',
    title: 'Legitimate Flight / Train Booking Confirmation',
    input: 'IRCTC: PNR #2847192831 confirmed. Coach B2, Seat 45 (Window). Departure 08:30 AM from New Delhi Railway Station.',
    expectedRisk: 'LOW',
    rationale: 'Informative travel confirmation without payment links.'
  },
  {
    id: 'l-7',
    category: 'LEGITIMATE',
    title: 'Legitimate Electricity Bill Receipt',
    input: 'Thank you for your payment of Rs. 1,240 towards your electricity consumer ID 901283. Your payment has been received successfully.',
    expectedRisk: 'LOW',
    rationale: 'Confirmation of payment receipt with zero disconnection threat.'
  },
  {
    id: 'l-8',
    category: 'LEGITIMATE',
    title: 'Legitimate Courier Out for Delivery',
    input: 'Blue Dart: Your order #BD99281 from Amazon is out for delivery with courier associate Manoj. Share delivery code 4812 upon arrival.',
    expectedRisk: 'LOW',
    rationale: 'Standard physical delivery PIN verification, no payment demand.'
  },
  {
    id: 'l-9',
    category: 'LEGITIMATE',
    title: 'Legitimate Two-Factor OTP Disclaimer Message',
    input: '184920 is your OTP for login at official bank portal. Valid for 5 mins. Do NOT share this OTP with anyone including bank staff.',
    expectedRisk: 'LOW',
    rationale: 'Standard legitimate OTP delivery containing strict anti-sharing disclaimer.'
  },
  {
    id: 'l-10',
    category: 'LEGITIMATE',
    title: 'Legitimate Bank Fixed Deposit Maturity Notice',
    input: 'Dear Customer, your Fixed Deposit FD9912 matures on 30-Sep-2026. Review auto-renewal options inside the official mobile app.',
    expectedRisk: 'LOW',
    rationale: 'Informational reminder directing solely to official mobile banking app.'
  }
];

export function runTestSuite() {
  let passedCount = 0;
  const results = DETECTION_TEST_SUITE.map(tc => {
    const res = analyzeMessageLocally(tc.input);
    const isSuspicious = tc.category === 'SUSPICIOUS';
    const passed = isSuspicious
      ? (res.riskLevel === 'HIGH' || res.riskLevel === 'CRITICAL')
      : (res.riskLevel === 'LOW' || res.riskLevel === 'MEDIUM');

    if (passed) passedCount++;

    return {
      id: tc.id,
      title: tc.title,
      category: tc.category,
      expected: tc.expectedRisk,
      actual: res.riskLevel,
      score: res.riskScore,
      passed,
      rationale: tc.rationale
    };
  });

  return {
    total: DETECTION_TEST_SUITE.length,
    passedCount,
    accuracy: Math.round((passedCount / DETECTION_TEST_SUITE.length) * 100),
    results
  };
}
