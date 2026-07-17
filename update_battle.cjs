const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/Battle.tsx', 'utf8');

const formatTimeFunc = `
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '--';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m > 0) {
      return \`\${m}:\${s.toString().padStart(2, '0')}\`;
    }
    return s.toString();
  };
`;

content = content.replace('  const isTimerLow =', formatTimeFunc + '\n  const isTimerLow =');

content = content.replace("00:{String(timeLeft || 0).padStart(2, '0')}", "{formatTime(timeLeft)}");
content = content.replace("{timeLeft !== null ? timeLeft : '--'}", "{formatTime(timeLeft)}");

fs.writeFileSync('frontend/src/pages/Battle.tsx', content);
