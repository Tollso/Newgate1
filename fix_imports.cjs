const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const moves = {
  'categories': 'inventory',
  'modifiers': 'inventory',
  'items': 'inventory',
  'removeditems': 'inventory',
  'discounts': 'inventory',
  'printers': 'hardware',
  'customers': 'crm',
  'documents': 'admin',
  'employees': 'staff',
  'transactions': 'finances',
  'floorplan': 'dining',
  'tableservice': 'dining'
};

const findFiles = (dir, ext) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(findFiles(file, ext));
    } else {
      if (file.endsWith(ext)) results.push(file);
    }
  });
  return results;
};

const files = findFiles('components', '.tsx').concat(findFiles('components', '.ts'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  Object.keys(moves).forEach(oldDir => {
    const newDir = moves[oldDir];
    
    const pattern1 = new RegExp(`'\\.\\./${oldDir}/`, 'g');
    if (content.match(pattern1)) {
        const currentDirName = path.basename(path.dirname(file));
        if (currentDirName === newDir) {
            content = content.replace(pattern1, `'./`);
        } else {
            content = content.replace(pattern1, `'../${newDir}/`);
        }
        changed = true;
    }

    const pattern2 = new RegExp(`'\\.\\./\\.\\./components/${oldDir}/`, 'g');
    if (content.match(pattern2)) {
        content = content.replace(pattern2, `'../../components/${newDir}/`);
        changed = true;
    }
    
    const pattern3 = new RegExp(`'\\./${oldDir}/`, 'g');
    if (content.match(pattern3)) {
        const currentDirName = path.basename(path.dirname(file));
        if (currentDirName === 'components') {
            content = content.replace(pattern3, `'./${newDir}/`);
            changed = true;
        }
    }
  });

  if (changed) {
    fs.writeFileSync(file, content);
  }
});

console.log("Import fix pass completed.");
