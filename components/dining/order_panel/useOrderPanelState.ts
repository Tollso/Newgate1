import { useState, useEffect } from 'react';
import { DiningOrderItem } from '../../../types';
import { PreAuthData } from '../PreAuthModal';
import { DiscountTarget, ActiveOrderModal } from './orderPanelTypes';

interface UseOrderPanelStateProps {
  orderItems: DiningOrderItem[];
  preAuthInfo?: PreAuthData | null;
  onUpdateOrderItems: (items: DiningOrderItem[]) => void;
  onPrintBill?: () => void;
}

export function useOrderPanelState({
  orderItems,
  preAuthInfo,
  onUpdateOrderItems,
  onPrintBill,
}: UseOrderPanelStateProps) {
  const [itemToMove, setItemToMove] = useState<string | null>(null);
  const [guestToMove, setGuestToMove] = useState<number | null>(null);
  const [discountTarget, setDiscountTarget] = useState<DiscountTarget>(null);
  const [activeGuestActions, setActiveGuestActions] = useState<number | null>(null);
  const [showOrderOptions, setShowOrderOptions] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [localPreAuthInfo, setLocalPreAuthInfo] = useState<PreAuthData | null>(preAuthInfo || null);
  const [activeModal, setActiveModal] = useState<ActiveOrderModal>(null);

  useEffect(() => {
    if (preAuthInfo !== undefined) {
      setLocalPreAuthInfo(preAuthInfo);
    }
  }, [preAuthInfo]);

  const activeItems = orderItems.filter(i => !i.isVoided);
  const hasUnfiredItems = activeItems.some(i => !i.fired);
  const isAllFired = activeItems.length > 0 && !hasUnfiredItems;

  const showNotice = (msg: string) => {
    setNoticeMessage(msg);
    setTimeout(() => {
      setNoticeMessage(null);
    }, 2500);
  };

  const handlePrintBill = () => {
    if (onPrintBill) {
      onPrintBill();
    } else {
      setActiveModal('PRINT_BILL');
    }
  };

  const handleVoidItem = (cartId: string) => {
    onUpdateOrderItems(orderItems.map(i => i.cartId === cartId ? { ...i, isVoided: true } : i));
  };

  const handleDiscountItem = (cartId: string) => {
    setDiscountTarget({ type: 'ITEM', cartId });
  };

  const handleVoidGuest = (seatNum: number) => {
    onUpdateOrderItems(orderItems.map(i => i.seatNumber === seatNum ? { ...i, isVoided: true } : i));
    setActiveGuestActions(null);
    showNotice(`Removed items for Guest ${seatNum === 0 ? 'Shared' : seatNum}`);
  };

  const handleDiscountGuest = (seatNum: number) => {
    setDiscountTarget({ type: 'GUEST', seatNumber: seatNum });
    setActiveGuestActions(null);
  };

  const handleMoveGuest = (seatNum: number) => {
    setGuestToMove(seatNum);
    setActiveGuestActions(null);
  };

  return {
    itemToMove, setItemToMove,
    guestToMove, setGuestToMove,
    discountTarget, setDiscountTarget,
    activeGuestActions, setActiveGuestActions,
    showOrderOptions, setShowOrderOptions,
    noticeMessage, showNotice,
    localPreAuthInfo, setLocalPreAuthInfo,
    activeModal, setActiveModal,
    isAllFired,
    handlePrintBill,
    handleVoidItem,
    handleDiscountItem,
    handleVoidGuest,
    handleDiscountGuest,
    handleMoveGuest,
  };
}
