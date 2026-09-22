import React, { useState, useEffect } from 'react';
import { RetailService } from '../../services/retailService';
import { ScannerService } from '../../services/scannerService';
import { CustomerDisplayService } from '../../services/customerDisplayService';
import { OrderService } from '../../services/orderService';
import { PaymentService } from '../../services/paymentService';
import { RetailProduct, ProductVariant } from '../../types/retail';
import { RetailCartItem, RetailPOSProps } from './retail/RetailTypes';
import { RetailPOSHeader } from './retail/RetailPOSHeader';
import { RetailCatalogGrid } from './retail/RetailCatalogGrid';
import { RetailCartPanel } from './retail/RetailCartPanel';
import { RetailVariantModal } from './retail/RetailVariantModal';
import { RetailAgeVerificationModal } from './retail/RetailAgeVerificationModal';
import { RetailCheckoutModal } from './retail/RetailCheckoutModal';
import { ReceiptPromptModal } from '../receipt/ReceiptPromptModal';
import { ReceiptOrderContext, ReceiptDeliveryOption } from '../receipt/receiptTypes';

export const RetailPOS: React.FC<RetailPOSProps> = ({ currentUser, onExit, onOpenReturns }) => {
  const [products, setProducts] = useState<RetailProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<RetailCartItem[]>([]);
  const [variantModalProduct, setVariantModalProduct] = useState<RetailProduct | null>(null);
  const [ageCheckItem, setAgeCheckItem] = useState<RetailProduct | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptContext, setReceiptContext] = useState<ReceiptOrderContext | null>(null);

  useEffect(() => {
    RetailService.listProducts().then(setProducts);
    const unsub = ScannerService.subscribe(handleBarcodeScanned);
    return () => { unsub(); CustomerDisplayService.resetToIdle(); };
  }, []);

  const handleBarcodeScanned = (barcode: string) => {
    const product = products.find(p => p.primaryBarcode === barcode || p.variants.some(v => v.barcode === barcode));
    if (product) handleProductClick(product);
  };

  const handleProductClick = (product: RetailProduct) => {
    if (product.requiresAgeVerification) { setAgeCheckItem(product); return; }
    if (product.variants.length > 0) { setVariantModalProduct(product); return; }
    addItemToCart(product);
  };

  const addItemToCart = (product: RetailProduct, variant?: ProductVariant) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id && i.variantId === variant?.id);
      if (existing) {
        return prev.map(i => i.id === existing.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        id: `cart-${Date.now()}-${Math.random()}`,
        productId: product.id,
        variantId: variant?.id,
        name: product.name,
        variantLabel: variant ? [variant.color, variant.size, variant.style].filter(Boolean).join(' / ') || variant.sku : undefined,
        sku: variant?.sku || product.primarySku,
        price: variant?.price || product.basePrice,
        quantity: 1,
      }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  };

  const removeItem = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  const subtotal = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;

  const handleCheckout = async (paymentMethod: 'CARD' | 'CASH') => {
    try {
      const order = await OrderService.createOrder({
        merchantId: 'M001', employeeId: currentUser.id, orderType: 'RETAIL', customerName: 'Retail Guest',
        items: cart.map(i => ({ name: `${i.name} ${i.variantLabel || ''}`.trim(), quantity: i.quantity, unitPrice: i.price, modifiers: [] })),
      });
      await PaymentService.processPayment({
        orderId: order.id, amount: total, method: paymentMethod,
        employeeId: currentUser.id, employeeName: currentUser.name,
      });
      CustomerDisplayService.updateDisplay({ screenMode: 'THANK_YOU' });
      setPaymentSuccess(true);
      setTimeout(() => {
        setIsCheckingOut(false);
        setPaymentSuccess(false);
        setReceiptContext({
          orderId: order.id,
          orderNumber: order.id.slice(-4),
          total,
          subtotal,
          tax,
          paymentMethod: paymentMethod === 'CARD' ? 'Credit Card' : 'Cash',
          appName: 'Register',
          items: cart.map(i => ({ name: i.name, qty: i.quantity, price: i.price }))
        });
        setShowReceiptModal(true);
      }, 700);
    } catch {
      alert('Checkout failed');
    }
  };

  const handleReceiptComplete = (_option: ReceiptDeliveryOption) => {
    setShowReceiptModal(false);
    setCart([]);
    CustomerDisplayService.resetToIdle();
  };

  const categories = ['ALL', ...Array.from(new Set(products.map(p => p.category)))];
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.primarySku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.primaryBarcode.includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
      <RetailPOSHeader onExit={onExit} onOpenReturns={onOpenReturns} currentUser={currentUser} />
      <div className="flex-1 flex overflow-hidden">
        <RetailCatalogGrid
          searchQuery={searchQuery} setSearchQuery={setSearchQuery} categories={categories}
          selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
          filteredProducts={filteredProducts} onProductClick={handleProductClick}
        />
        <RetailCartPanel
          cart={cart} subtotal={subtotal} tax={tax} total={total}
          onClearCart={() => setCart([])} onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem} onStartCheckout={() => setIsCheckingOut(true)}
        />
      </div>
      <RetailVariantModal product={variantModalProduct} onClose={() => setVariantModalProduct(null)} onSelectVariant={addItemToCart} />
      <RetailAgeVerificationModal item={ageCheckItem} onCancel={() => setAgeCheckItem(null)} onConfirm={(item) => { setAgeCheckItem(null); addItemToCart(item); }} />
      <RetailCheckoutModal isOpen={isCheckingOut} onClose={() => setIsCheckingOut(false)} total={total} paymentSuccess={paymentSuccess} onCheckout={handleCheckout} />
      {showReceiptModal && receiptContext && (
        <ReceiptPromptModal isOpen={showReceiptModal} orderContext={receiptContext} onComplete={handleReceiptComplete} onClose={() => handleReceiptComplete('NONE')} />
      )}
    </div>
  );
};

export default RetailPOS;
