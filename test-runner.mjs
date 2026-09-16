import { runTestSuite } from './src/data/detectionTestSuite.ts';

const report = runTestSuite();
console.log(`\n========================================`);
console.log(`🛡️  SCAMSHIELD DETECTION TEST SUITE`);
console.log(`========================================`);
console.log(`Total Cases: ${report.total}`);
console.log(`Passed:      ${report.passedCount}`);
console.log(`Accuracy:    ${report.accuracy}%\n`);

report.results.forEach(r => {
  const icon = r.passed ? '✅' : '❌';
  console.log(`${icon} [${r.category}] ${r.title}`);
  console.log(`   Expected: ${r.expected} | Actual: ${r.actual} (${r.score}/100)`);
});
console.log(`========================================\n`);

if (report.passedCount < report.total) {
  process.exit(1);
} else {
  process.exit(0);
}
