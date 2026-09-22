const fs = require('fs');
let content = fs.readFileSync('components/pos/KioskApp.tsx', 'utf8');

const regex = /      <KioskModifierModal\n        selectedItem=\{selectedItem\}\n        setSelectedItem=\{setSelectedItem\}\n        modifierGroups=\{modifierGroups\}\n        selectedModifiers=\{selectedModifiers\}\n        toggleModifier=\{toggleModifier\}\n        handleConfirmItem=\{handleConfirmItem\}\n        theme=\{theme\}\n      \/>\n    <\/div>\n<\/div>\n  \);\n\};\n\nexport default KioskApp;/g;

content = content.replace(regex, `      <KioskModifierModal
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        modifierGroups={modifierGroups}
        selectedModifiers={selectedModifiers}
        toggleModifier={toggleModifier}
        handleConfirmItem={handleConfirmItem}
        theme={theme}
      />
    </div>
  );
};

export default KioskApp;`);

fs.writeFileSync('components/pos/KioskApp.tsx', content);
