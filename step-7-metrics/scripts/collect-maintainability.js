const fs = require('node:fs'); const { execFileSync } = require('node:child_process');
const files = ['step-6-applications/backend/server.js','step-3-frontend-stacks/spa/index.html','step-3-frontend-stacks/hda/index.html'];
const rows = files.map(file => { const text=fs.readFileSync(file,'utf8'); const lines=text.split('\n').length; const branches=(text.match(/\b(if|for|while|catch|\?|&&|\|\|)\b/g)||[]).length; return {file,lines,approximateCyclomaticComplexity:branches+1}; });
let fallow='unavailable'; try { fallow=execFileSync('npx',['--yes','fallow','step-6-applications/backend/server.js'],{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim(); } catch (e) { fallow='fallow command failed: '+e.status; }
fs.mkdirSync('step-7-metrics/results',{recursive:true}); fs.writeFileSync('step-7-metrics/results/maintainability.json',JSON.stringify({generatedAt:new Date().toISOString(),rows,fallow},null,2)); console.log(JSON.stringify({rows,fallow},null,2));
