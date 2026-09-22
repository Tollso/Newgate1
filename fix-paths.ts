import { Project } from "ts-morph";

const projectFiles = new Project({
    tsConfigFilePath: "./tsconfig.json", 
});

const files = projectFiles.getSourceFiles("components/components/**/*.tsx");
for (const file of files) {
    const oldPath = file.getFilePath();
    const newPath = oldPath.replace('/components/components/', '/components/');
    console.log(`Moving ${oldPath} to ${newPath}`);
    file.move(newPath);
}

const posFiles = projectFiles.getSourceFiles("components/pos/**/*.ts").concat(projectFiles.getSourceFiles("components/pos/**/*.tsx"));
for (const file of posFiles) {
  // It seems some were moved fine, let's just make sure there are no components/components
}

projectFiles.saveSync();
