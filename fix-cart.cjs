const fs = require('fs');
let c = fs.readFileSync('components/pos/KioskApp.tsx', 'utf8');

const startIdx = c.indexOf('  const renderCartContent = () => (');
if (startIdx !== -1) {
  const endStr = '    )}\n  </>\n);';
  // wait, the actual ending of renderCartContent was:
  //         </button>
  //       </div>
  //     )}
  //   </>
  // );
  const endIdx = c.indexOf('  </>\n  );', startIdx); // wait, let's just find the start of the next statement which is `return (` or something?
}
