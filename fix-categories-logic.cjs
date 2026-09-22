const fs = require('fs');
let code = fs.readFileSync('components/Categories.tsx', 'utf8');

// Remove the explicit itemsCount updates since we calculate it dynamically
code = code.replace(/if \(setCategories\) \{\s*setCategories\(prev => prev\.map\(cat => cat\.id === selectedCategory\.id \? \{ \.\.\.cat, itemsCount: cat\.itemsCount \+ 1 \} : cat\)\);\s*\}/g, "");
code = code.replace(/if \(setCategories\) \{\s*setCategories\(prev => prev\.map\(cat => cat\.id === selectedCategory\.id \? \{ \.\.\.cat, itemsCount: Math\.max\(0, cat\.itemsCount - 1\) \} : cat\)\);\s*\}/g, "");

fs.writeFileSync('components/Categories.tsx', code);
