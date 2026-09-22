const fs = require('fs');
let c = fs.readFileSync('components/inventory/Discounts.tsx', 'utf8');

c = c.replace(/<ActiveDiscountsTab[^>]*\/>/, '<ActiveDiscountsTab searchTerm={searchTerm} setSearchTerm={setSearchTerm} activeDiscounts={activeDiscounts} handleOpenEdit={handleOpenEdit} handleDuplicate={handleDuplicate} handleDeleteDiscount={handleDeleteDiscount} />');
c = c.replace(/<DefaultDiscountsTab[^>]*\/>/, '<DefaultDiscountsTab defaultDiscounts={defaultDiscounts} handleOpenCreate={handleOpenCreate} handleOpenEdit={handleOpenEdit} handleDeleteDiscount={handleDeleteDiscount} />');

fs.writeFileSync('components/inventory/Discounts.tsx', c);
