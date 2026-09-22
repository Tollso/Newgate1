const fs = require('fs');
const path = require('path');

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

  const replacePatterns = [
    { regex: /'\.\.\/documents\//g, to: "'./" },
    { regex: /'\.\.\/customers\//g, to: "'./" },
    { regex: /'\.\.\/floorplan\//g, to: "'./" },
    { regex: /'\.\.\/tableservice\//g, to: "'./" },
    { regex: /'\.\.\/transactions\//g, to: "'./" },
    { regex: /'\.\.\/printers\//g, to: "'./" },
    { regex: /'\.\.\/categories\//g, to: "'./" },
    { regex: /'\.\.\/discounts\//g, to: "'./" },
    { regex: /'\.\.\/items\//g, to: "'./" },
    { regex: /'\.\.\/modifiers\//g, to: "'./" },
    { regex: /'\.\.\/removeditems\//g, to: "'./" },
    { regex: /'\.\.\/employees\//g, to: "'./" },
    { regex: /'\.\/employees\//g, to: "'./staff/" },
    { regex: /'\.\.\/staff\/staff\//g, to: "'../staff/" }
  ];

  replacePatterns.forEach(({regex, to}) => {
    if (content.match(regex)) {
      content = content.replace(regex, to);
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(file, content);
  }
});
