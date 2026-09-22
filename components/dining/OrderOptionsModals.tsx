import React from 'react';
import { DiningTable, DiningOrderItem } from '../../types';
import { PreAuthModal, PreAuthData } from './PreAuthModal';
import { PrintQrCodeModal } from './PrintQrCodeModal';
import { PrintBillModal } from './PrintBillModal';
import { PrintIndividualBillModal } from './PrintIndividualBillModal';
import { MoveOrderModal } from './MoveOrderModal';
import { CombineOrdersModal, TransferServerModal, DeleteOrderModal } from './TableActionModals';

interface OrderOptionsModalsProps {
  activeModal: 'PRE_AUTH' | 'QR_CODE' | 'PRINT_BILL' | 'PRINT_INDIVIDUAL' | 'MOVE_ORDER' | 'COMBINE_ORDERS' | 'TRANSFER_SERVER' | 'DELETE_ORDER' | null;
  onCloseModal: () => void;
  table: DiningTable;
  orderItems: DiningOrderItem[];
  guests: { id: number; name?: string }[];
  subtotal: number;
  tax: number;
  total: number;
  autoGratuityAmount?: number;
  serviceFeeAmount?: number;
  serviceFeeName?: string;
  allTables?: DiningTable[];
  onAddPreAuth: (data: PreAuthData) => void;
  onMoveOrder: (sourceTableId: string, targetTableId: string) => void;
  onCombineOrders: (targetTable: string) => void;
  onTransferServer: (serverName: string) => void;
  onDeleteOrder: () => void;
  showNotice: (msg: string) => void;
}

export const OrderOptionsModals: React.FC<OrderOptionsModalsProps> = ({
  activeModal,
  onCloseModal,
  table,
  orderItems,
  guests,
  subtotal,
  tax,
  total,
  autoGratuityAmount = 0,
  serviceFeeAmount = 0,
  serviceFeeName = 'Service Fee',
  allTables = [],
  onAddPreAuth,
  onMoveOrder,
  onCombineOrders,
  onTransferServer,
  onDeleteOrder,
  showNotice
}) => {
  if (!activeModal) return null;

  switch (activeModal) {
    case 'PRE_AUTH':
      return (
        <PreAuthModal
          tableName={table.name}
          onAddPreAuth={(data) => {
            onAddPreAuth(data);
            showNotice(`Pre-Auth $${data.amount.toFixed(2)} active (*${data.cardLast4})${data.isCardStored ? ' - Card Stored' : ''}`);
          }}
          onClose={onCloseModal}
        />
      );

    case 'QR_CODE':
      return (
        <PrintQrCodeModal
          tableName={table.name}
          orderId={table.orderId}
          onClose={onCloseModal}
          onPrinted={() => showNotice(`Printed Table ${table.name} QR Card`)}
        />
      );

    case 'PRINT_BILL':
      return (
        <PrintBillModal
          table={table}
          orderItems={orderItems}
          subtotal={subtotal}
          tax={tax}
          total={total}
          autoGratuityAmount={autoGratuityAmount}
          serviceFeeAmount={serviceFeeAmount}
          serviceFeeName={serviceFeeName}
          onClose={onCloseModal}
          onPrintCompleted={() => showNotice(`Bill printed for Table ${table.name}`)}
        />
      );

    case 'PRINT_INDIVIDUAL':
      return (
        <PrintIndividualBillModal
          table={table}
          guests={guests}
          orderItems={orderItems}
          onClose={onCloseModal}
          onPrinted={() => showNotice(`Individual guest bill printed`)}
        />
      );

    case 'MOVE_ORDER':
      return (
        <MoveOrderModal
          currentTable={table}
          allTables={allTables}
          onMoveOrder={(srcId, targetId) => {
            onMoveOrder(srcId, targetId);
            showNotice(`Moved Order from Table ${table.name} to Target Table`);
          }}
          onClose={onCloseModal}
        />
      );

    case 'COMBINE_ORDERS':
      return (
        <CombineOrdersModal
          currentTable={table.name}
          allTables={allTables}
          onCombine={(targetTable) => {
            onCombineOrders(targetTable);
            showNotice(`Combined Table ${table.name} into target table`);
          }}
          onClose={onCloseModal}
        />
      );

    case 'TRANSFER_SERVER':
      return (
        <TransferServerModal
          currentTable={table.name}
          onTransfer={(serverName) => {
            onTransferServer(serverName);
            showNotice(`Transferred Table ${table.name} to ${serverName}`);
          }}
          onClose={onCloseModal}
        />
      );

    case 'DELETE_ORDER':
      return (
        <DeleteOrderModal
          onConfirm={() => {
            onDeleteOrder();
            showNotice(`Order for Table ${table.name} deleted`);
          }}
          onClose={onCloseModal}
        />
      );

    default:
      return null;
  }
};
