import React from 'react';
import { DiningTable, Employee, KitchenTicket } from '../../types';
import { TableFloorHeader } from './TableFloorHeader';
import { DiningFloorCanvas } from './DiningFloorCanvas';
import { TableStatusActionModal } from './TableStatusActionModal';

interface TableFloorViewProps {
  tables: DiningTable[];
  onExit: () => void;
  floorSections: string[];
  activeSection: string;
  setActiveSection: (sec: string) => void;
  onTableClick: (table: DiningTable) => void;
  kitchenTickets?: KitchenTicket[];
  actionTable: DiningTable | null;
  currentUser: Employee;
  onCloseActionModal: () => void;
  onSeatGuests: (guestCount: number, serverName: string, serverId: string) => void;
  onTableAction: (action: string) => void;
  onOpenSettings?: () => void;
  onOpenDesigner?: () => void;
}

export const TableFloorView: React.FC<TableFloorViewProps> = ({
  tables,
  onExit,
  floorSections,
  activeSection,
  setActiveSection,
  onTableClick,
  kitchenTickets = [],
  actionTable,
  currentUser,
  onCloseActionModal,
  onSeatGuests,
  onTableAction,
  onOpenSettings,
  onOpenDesigner
}) => {
  const kitchenStatusMap = kitchenTickets.reduce((acc, ticket) => {
    if (ticket.status !== 'Delivered') {
      const tableName = ticket.table.replace('Table ', '');
      acc[tableName] = { status: ticket.status as any, ticketId: ticket.id };
    }
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="h-full flex flex-col bg-slate-100 animate-fade-in relative">
      <TableFloorHeader
        onExit={onExit}
        floorSections={floorSections}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onOpenSettings={onOpenSettings}
        onOpenDesigner={onOpenDesigner}
      />

      <div className="flex-1 flex relative">
        <DiningFloorCanvas 
          tables={tables}
          activeSection={activeSection}
          isEditMode={false}
          onTableClick={onTableClick}
          kitchenStatusMap={kitchenStatusMap}
        />

        {actionTable && (
          <TableStatusActionModal
            actionTable={actionTable}
            currentUser={currentUser}
            onClose={onCloseActionModal}
            onSeatGuests={onSeatGuests}
            onTableAction={onTableAction}
          />
        )}
      </div>
    </div>
  );
};
