const fs = require('fs');
let code = fs.readFileSync('components/KioskApp.tsx', 'utf8');

// Order Success Screen
code = code.replace(/bg-indigo-50/g, "${theme.bgLight}");
code = code.replace(/bg-indigo-100/g, "${theme.bgLight}"); // using bgLight
code = code.replace(/text-indigo-600/g, "${theme.text}");
code = code.replace(/text-indigo-400/g, "${theme.textLight}");
code = code.replace(/text-indigo-700/g, "${theme.text}");
code = code.replace(/bg-indigo-600/g, "${theme.bg}");
code = code.replace(/hover:bg-indigo-700/g, "${theme.bgHover}");
code = code.replace(/hover:border-indigo-500/g, "hover:${theme.border}");
code = code.replace(/hover:bg-indigo-50/g, "hover:${theme.bgLight}");
code = code.replace(/group-hover:bg-indigo-100/g, "group-hover:${theme.bgLight}");
code = code.replace(/group-hover:text-indigo-600/g, "group-hover:${theme.text}");
code = code.replace(/text-indigo-900/g, "${theme.text}");
code = code.replace(/hover:shadow-indigo-200/g, "hover:shadow-xl");
code = code.replace(/hover:bg-indigo-100/g, "hover:${theme.bgLight}");
code = code.replace(/hover:bg-indigo-600/g, "${theme.bgHover}");

// Ensure these classNames use backticks instead of quotes where we inject template literals
// I will use regex to find className="..." containing ${theme. and replace quotes with backticks.

code = code.replace(/className="([^"]*\$\{theme\.[^"]*)"/g, "className={`$1`}");

fs.writeFileSync('components/KioskApp.tsx', code);
