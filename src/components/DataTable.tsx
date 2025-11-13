import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DataTableProps<T> {
  title: string;
  columns: { key: string; label: string }[];
  data: T[];
  onAdd: () => void;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  getRowKey: (item: T) => string | number;
  searchTerm?: string;
}

export function DataTable<T extends Record<string, any>>({
  title,
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  getRowKey,
  searchTerm = "",
}: DataTableProps<T>) {
  const [deleteConfirm, setDeleteConfirm] = useState<T | null>(null);

  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;
    return Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDelete = () => {
    if (deleteConfirm) {
      onDelete(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="content-card">
      <h2>
        {title}
        <Button className="btn btn-primary" onClick={onAdd}>
          + Add New
        </Button>
      </h2>

      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={getRowKey(item)}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {item[col.key] !== null && item[col.key] !== undefined
                      ? String(item[col.key])
                      : "-"}
                  </td>
                ))}
                <td style={{ textAlign: "right" }}>
                  <button
                    className="btn-icon"
                    onClick={() => onEdit(item)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-icon delete"
                    onClick={() => setDeleteConfirm(item)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this item?</p>
          <div className="modal-footer">
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}