const fs = require('fs');
let c = fs.readFileSync('components/pos/KioskApp.tsx', 'utf8');

c = c.replace(/import \{ KioskOrderCompleteView \} from '\.\/KioskOrderCompleteView';/, "import { KioskOrderCompleteView } from './KioskOrderCompleteView';\nimport { KioskCategories } from './KioskCategories';");

const regexTop = /          \{\(config\.categoryLayout === 'top' \|\| !config\.categoryLayout\) && \([\s\S]*?            <\/div>\n          \)\}/g;
c = c.replace(regexTop, `          {(config.categoryLayout === 'top' || !config.categoryLayout) && (
            <KioskCategories categories={categories} activeCategory={activeCategory} setActiveCategory={setActiveCategory} layout="top" />
          )}`);

const regexSide = /          \{config\.categoryLayout === 'sidebar' && \([\s\S]*?            <\/div>\n          \)\}/g;
c = c.replace(regexSide, `          {config.categoryLayout === 'sidebar' && (
            <KioskCategories categories={categories} activeCategory={activeCategory} setActiveCategory={setActiveCategory} layout="sidebar" />
          )}`);

fs.writeFileSync('components/pos/KioskApp.tsx', c);
