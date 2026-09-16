export interface DemoExample {
  id: string;
  title: string;
  titleHi: string;
  category: string;
  expectedRisk: 'HIGH' | 'CRITICAL' | 'LOW' | 'MEDIUM';
  description: string;
  text: string;
}

export const DEMO_EXAMPLES: DemoExample[] = [
  {
    id: 'demo-banking',
    title: 'Bank Account Block Threat (Phishing)',
    titleHi: 'बैंक खाता ब्लॉक होने का फर्जी डर',
    category: 'Banking / KYC',
    expectedRisk: 'HIGH',
    description: 'Scammer creates urgent panic about an account freeze and provides a fake phishing link.',
    text: 'URGENT! Your SBI bank account will be blocked today within 2 hours. Complete your KYC immediately at http://sbi-kyc-update.xyz/verify or your card will be permanently deactivated.'
  },
  {
    id: 'demo-courier',
    title: 'India Post Courier Fee Scam',
    titleHi: 'कूरियर पार्सल शुल्क की ठगी',
    category: 'Courier / Delivery',
    expectedRisk: 'HIGH',
    description: 'Demands small payment (₹25) to steal card details and OTP credentials.',
    text: 'India Post: Your parcel #IN98124 is detained at the local delivery center. Pay pending ₹25 customs fee here: http://indiapost-parcel.top/pay before 6 PM to prevent shipment return.'
  },
  {
    id: 'demo-prize',
    title: 'Lottery / KBC Fake Prize',
    titleHi: 'फर्जी लॉटरी / इनाम का झांसा',
    category: 'Prize / Lottery',
    expectedRisk: 'HIGH',
    description: 'Entices victim with massive fake winnings to solicit advance processing fee.',
    text: 'Congratulations! Your mobile number has won ₹50,000 in the 2026 KBC Mega WhatsApp Lucky Draw. Send WhatsApp message to claim your reward immediately: http://kbc-reward-claim.site/win'
  },
  {
    id: 'demo-safe-bank',
    title: 'Legitimate Bank Statement Alert',
    titleHi: 'वैध बैंक खाता विवरण सूचना',
    category: 'Banking / KYC',
    expectedRisk: 'LOW',
    description: 'Authentic notification from bank advising use of official app with fraud disclaimer.',
    text: 'Dear Customer, your monthly account statement for account ending XX4892 is now available inside the official mobile banking application. Bank never asks for your OTP, PIN or CVV.'
  },
  {
    id: 'demo-ambiguous',
    title: 'Informational KYC Reminder (Ambiguous/Contextual)',
    titleHi: 'सामान्य केवाईसी सूचना (सुरक्षित/सावधानी)',
    category: 'Banking / KYC',
    expectedRisk: 'LOW',
    description: 'Legitimate banks send periodic reminders. Without phishing links or urgent threats, this is evaluated safely.',
    text: 'Dear Customer, please update your KYC details periodically through the official mobile banking application or by visiting your nearest branch. Never share sensitive credentials.'
  },
  {
    id: 'demo-electricity',
    title: 'Electricity Bill Disconnection Scam',
    titleHi: 'बिजली बिल कटने की फर्जी धमकी',
    category: 'Utility / Electricity',
    expectedRisk: 'HIGH',
    description: 'Classic evening electricity scam claiming power cut tonight to force quick payment.',
    text: 'Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM by electricity office because your previous month bill was not updated. Immediately contact power officer on 98112XXXXX.'
  }
];
