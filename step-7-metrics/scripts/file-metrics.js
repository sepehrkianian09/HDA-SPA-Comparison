const fs = require('node:fs');

function sourceMetrics(file, displayName = file) {
  const source = fs.readFileSync(file, 'utf8');
  const allLines = source.split('\n');
  const contentLines = allLines.map(line => line.trim()).filter(Boolean);
  const counts = new Map();
  contentLines.forEach(line => counts.set(line, (counts.get(line) || 0) + 1));
  const duplicatedLines = [...counts.values()].filter(count => count > 1).reduce((total, count) => total + count, 0);
  const decisions = (source.match(/\b(if|for|while|catch|case)\b/g) || []).length;
  const operators = (source.match(/\?|&&|\|\|/g) || []).length;
  return {
    file: displayName,
    lines: allLines.length,
    moduleSizeBytes: Buffer.byteLength(source),
    duplication: { duplicatedLines, percentage: contentLines.length ? Number((duplicatedLines / contentLines.length * 100).toFixed(2)) : 0 },
    approximateCyclomaticComplexity: decisions + operators + 1
  };
}
module.exports = { sourceMetrics };
