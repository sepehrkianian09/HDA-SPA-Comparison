const fs = require('node:fs');
function sourceMetrics(file, displayName = file) { const source = fs.readFileSync(file, 'utf8'); const lines = source.split('\n').length; const decisions = (source.match(/\b(if|for|while|catch)\b/g) || []).length; const operators = (source.match(/\?|&&|\|\|/g) || []).length; return { file: displayName, lines, approximateCyclomaticComplexity: decisions + operators + 1 }; }
module.exports = { sourceMetrics };
