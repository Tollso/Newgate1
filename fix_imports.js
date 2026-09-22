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

  // Let's replace simple imports like '../items/...' to '../inventory/...'
  // But wait, if we are inside 'components/inventory/Items.tsx', it used to do '../items/ItemModal'.
  // It's easier to just use sed-like replacements if we know the paths.

  // 1. imports from outside components looking into the moved folders:
  // e.g. import ... from '../items/ItemModal'
  Object.keys(moves).forEach(oldDir => {
    const newDir = moves[oldDir];
    
    // Pattern 1: '../oldDir/file' -> '../newDir/file'
    // Applies if we are at depth 2 importing depth 2.
    const pattern1 = new RegExp(`'\\.\\./${oldDir}/`, 'g');
    if (content.match(pattern1)) {
        // However, if the current file is NOW in the same newDir (e.g. we moved from items to inventory, and now in inventory), 
        // '../items/' -> if newDir is the current dir, it should be './'
        const currentDirName = path.basename(path.dirname(file));
        if (currentDirName === newDir) {
            content = content.replace(pattern1, `'./`);
        } else {
            content = content.replace(pattern1, `'../${newDir}/`);
        }
        changed = true;
    }

    // Pattern 2: '../../components/oldDir/file'
    const pattern2 = new RegExp(`'\\.\\./\\.\\./components/${oldDir}/`, 'g');
    if (content.match(pattern2)) {
        content = content.replace(pattern2, `'../../components/${newDir}/`);
        changed = true;
    }
    
    // Pattern 3: './oldDir/file' from components level (rare but possible)
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
