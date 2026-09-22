import React from 'react';
import { DiningOrderItem } from '../../types';
import { TableGuestGroup } from './TableGuestGroup';

interface TableGuestSectionProps {
  orderItems: DiningOrderItem[];
  guests: { id: number; name?: string }[];
  activeSeat: number;
  setActiveSeat: (seat: number) => void;
  activeGuestActions: number | null;
  setActiveGuestActions: (guest: number | null) => void;
  onVoidGuest: (seatNum: number) => void;
  onDiscountGuest: (seatNum: number) => void;
  onMoveGuest: (seatNum: number) => void;
  onVoidItem: (cartId: string) => void;
  onDiscountItem: (cartId: string) => void;
  onMoveItem: (cartId: string | null) => void;
  orderSubtotal: number;
  orderTotal: number;
  onMoveTable: () => void;
  onPayGuest: (seatNum: number) => void;
}

export const TableGuestSection: React.FC<TableGuestSectionProps> = ({
  orderItems,
  guests,
  activeSeat,
  setActiveSeat,
  activeGuestActions,
  setActiveGuestActions,
  onVoidGuest,
  onDiscountGuest,
  onMoveGuest,
  onVoidItem,
  onDiscountItem,
  onMoveItem,
  orderSubtotal,
  orderTotal,
  onMoveTable,
  onPayGuest
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-3 lg:p-4 bg-slate-900">
      <TableGuestGroup
        seatNum={0}
        name="Shared Items"
        items={orderItems.filter(i => i.seatNumber === 0)}
        activeSeat={activeSeat}
        setActiveSeat={setActiveSeat}
        activeGuestActions={activeGuestActions}
        setActiveGuestActions={setActiveGuestActions}
        onVoidGuest={onVoidGuest}
        onDiscountGuest={onDiscountGuest}
        onMoveGuest={onMoveGuest}
        onVoidItem={onVoidItem}
        onDiscountItem={onDiscountItem}
        onMoveItem={onMoveItem}
        guests={guests}
        orderItems={orderItems}
        orderSubtotal={orderSubtotal}
        orderTotal={orderTotal}
        onMoveTable={onMoveTable}
        onPayGuest={onPayGuest}
      />
      {guests.map(g => (
        <TableGuestGroup
          key={g.id}
          seatNum={g.id}
          name={g.name || `Guest ${g.id}`}
          items={orderItems.filter(i => i.seatNumber === g.id)}
          activeSeat={activeSeat}
          setActiveSeat={setActiveSeat}
          activeGuestActions={activeGuestActions}
          setActiveGuestActions={setActiveGuestActions}
          onVoidGuest={onVoidGuest}
          onDiscountGuest={onDiscountGuest}
          onMoveGuest={onMoveGuest}
          onVoidItem={onVoidItem}
          onDiscountItem={onDiscountItem}
          onMoveItem={onMoveItem}
          guests={guests}
          orderItems={orderItems}
          orderSubtotal={orderSubtotal}
          orderTotal={orderTotal}
          onMoveTable={onMoveTable}
          onPayGuest={onPayGuest}
        />
      ))}
    </div>
  );
};
