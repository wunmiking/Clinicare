import TableBody from "@/components/TableBody";
import { useAuth } from "@/store";
import {
  formatCurrency,
  roomsStatusColors,
  roomsTableColumns,
} from "@/utils/constants";
import { useCallback } from "react";
import EditRoom from "./EditRoom";

export default function Table({ rooms }) {
  const { user } = useAuth();

  const tableColumns = roomsTableColumns.filter((column) => {
    if (column.uid === "action") {
      return user?.role === "admin";
    }
    return true;
  });

  const renderCell = useCallback((room, columnKey) => {
    const cellValue = room[columnKey];
    switch (columnKey) {
      case "roomNumber":
        return (
          <div className="flex items-center gap-2">
            <h1 className="font-bold">Room {room?.roomNumber} - </h1>
            <h1 className="font-bold">{room?.roomDescription}</h1>
          </div>
        );
      case "roomType":
        return <div className="capitalize">{room?.roomType}</div>;
      case "roomCapacity":
        return <div className="capitalize">{room?.roomCapacity} ({room?.occupants?.length})</div>;
      case "roomPrice":
        return (
          <div className="capitalize">{formatCurrency(room?.roomPrice)}</div>
        );
      case "roomStatus":
        return (
          <div
            className={`capitalize badge badge-sm ${
              roomsStatusColors[room?.roomStatus]
            }`}
          >
            {room?.roomStatus}
          </div>
        );
      case "isFilled":
        return (
          <div
            className={`capitalize badge badge-sm ${
              room?.numberOfPatients >= room?.roomCapacity
                ? "bg-green-200 text-green-700"
                : "bg-red-200 text-red-700"
            }`}
          >
            {room?.numberOfPatients >= room?.roomCapacity
              ? "Filled"
              : "Not Filled"}
          </div>
        );
      case "action":
        return (
          <div>
            <EditRoom room={room} />
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <>
      <TableBody
        tableColumns={tableColumns}
        tableData={rooms}
        renderCell={renderCell}
      />
    </>
  );
}
