"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import styles from "../tools.module.css";
import notepadStyles from "./notepad.module.css";

interface InventoryNote {
  id: string;
  itemName: string;
  totalCount: number;
  sellCount: number;
  keepCount: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

type SortField = "itemName" | "totalCount" | "sellCount" | "keepCount" | "createdAt";
type SortDir = "asc" | "desc";

export default function NotepadPage() {
  const { user, loading: authLoading } = useAuth();
  const [notes, setNotes] = useState<InventoryNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ itemName: "", totalCount: 0, sellCount: 0, keepCount: 0, notes: "" });

  const [newItem, setNewItem] = useState({ itemName: "", totalCount: 0, sellCount: 0, keepCount: 0, notes: "" });
  const [showAdd, setShowAdd] = useState(false);

  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const fetchNotes = useCallback(async () => {
    const res = await apiFetch<InventoryNote[]>("/api/inventory-notes");
    if (res.success && res.data) {
      setNotes(res.data);
    } else {
      setError(res.error || "Failed to load notes");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) fetchNotes();
    else setLoading(false);
  }, [user, fetchNotes]);

  const handleAdd = async () => {
    if (!newItem.itemName.trim()) return;
    const res = await apiFetch<InventoryNote>("/api/inventory-notes", {
      method: "POST",
      body: JSON.stringify(newItem),
    });
    if (res.success && res.data) {
      setNotes((prev) => [res.data!, ...prev]);
      setNewItem({ itemName: "", totalCount: 0, sellCount: 0, keepCount: 0, notes: "" });
      setShowAdd(false);
    } else {
      setError(res.error || "Failed to add note");
    }
  };

  const handleUpdate = async (id: string) => {
    const res = await apiFetch<InventoryNote>(`/api/inventory-notes/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        itemName: editForm.itemName,
        totalCount: editForm.totalCount,
        sellCount: editForm.sellCount,
        keepCount: editForm.keepCount,
        notes: editForm.notes || null,
      }),
    });
    if (res.success && res.data) {
      setNotes((prev) => prev.map((n) => (n.id === id ? res.data! : n)));
      setEditingId(null);
    } else {
      setError(res.error || "Failed to update note");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await apiFetch(`/api/inventory-notes/${id}`, { method: "DELETE" });
    if (res.success) {
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } else {
      setError(res.error || "Failed to delete note");
    }
  };

  const startEdit = (note: InventoryNote) => {
    setEditingId(note.id);
    setEditForm({
      itemName: note.itemName,
      totalCount: note.totalCount,
      sellCount: note.sellCount,
      keepCount: note.keepCount,
      notes: note.notes || "",
    });
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir(field === "itemName" ? "asc" : "desc");
    }
  };

  const sorted = [...notes].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortField === "itemName") return dir * a.itemName.localeCompare(b.itemName);
    if (sortField === "createdAt") return dir * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return dir * ((a[sortField] as number) - (b[sortField] as number));
  });

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) +
      " " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  };

  if (authLoading) return <div className={styles.page}><p>Loading...</p></div>;

  if (!user) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Inventory Notepad</h1>
        <p className={styles.subtitle}>Sign in to track your items.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Inventory Notepad</h1>
      <p className={styles.subtitle}>
        Track your items — what you have, what to sell, and what to keep.
      </p>

      {error && (
        <div className={notepadStyles.errorBanner}>
          {error}
          <button onClick={() => setError(null)} className={notepadStyles.dismissBtn}>dismiss</button>
        </div>
      )}

      <div className={styles.panel}>
        <div className={notepadStyles.toolbar}>
          <h2 className={styles.panelTitle}>Your Items ({notes.length})</h2>
          <button
            className={notepadStyles.addButton}
            onClick={() => setShowAdd((v) => !v)}
          >
            {showAdd ? "Cancel" : "+ Add Item"}
          </button>
        </div>

        {showAdd && (
          <div className={notepadStyles.addRow}>
            <label className={styles.field}>
              <span>Item Name</span>
              <input
                className={styles.input}
                placeholder="e.g. Quantanium"
                value={newItem.itemName}
                onChange={(e) => setNewItem((p) => ({ ...p, itemName: e.target.value }))}
                autoFocus
              />
            </label>
            <label className={styles.field}>
              <span>Total</span>
              <input
                className={`${styles.input} ${notepadStyles.numInput}`}
                type="number"
                min={0}
                value={newItem.totalCount}
                onChange={(e) => setNewItem((p) => ({ ...p, totalCount: Number(e.target.value) }))}
              />
            </label>
            <label className={styles.field}>
              <span>To Sell</span>
              <input
                className={`${styles.input} ${notepadStyles.numInput}`}
                type="number"
                min={0}
                value={newItem.sellCount}
                onChange={(e) => setNewItem((p) => ({ ...p, sellCount: Number(e.target.value) }))}
              />
            </label>
            <label className={styles.field}>
              <span>To Keep</span>
              <input
                className={`${styles.input} ${notepadStyles.numInput}`}
                type="number"
                min={0}
                value={newItem.keepCount}
                onChange={(e) => setNewItem((p) => ({ ...p, keepCount: Number(e.target.value) }))}
              />
            </label>
            <label className={styles.field}>
              <span>Additional Notes</span>
              <input
                className={styles.input}
                placeholder="Optional details"
                value={newItem.notes}
                onChange={(e) => setNewItem((p) => ({ ...p, notes: e.target.value }))}
              />
            </label>
            <button className={notepadStyles.saveBtn} onClick={handleAdd}>
              Save
            </button>
          </div>
        )}

        {loading ? (
          <p className={styles.emptyMessage}>Loading your notes...</p>
        ) : notes.length === 0 && !showAdd ? (
          <p className={styles.emptyMessage}>
            No items yet. Click &quot;+ Add Item&quot; to get started.
          </p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={notepadStyles.sortable} onClick={() => toggleSort("itemName")}>
                    Item Name {sortField === "itemName" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                  </th>
                  <th className={notepadStyles.sortable} onClick={() => toggleSort("totalCount")}>
                    Total {sortField === "totalCount" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                  </th>
                  <th className={notepadStyles.sortable} onClick={() => toggleSort("sellCount")}>
                    To Sell {sortField === "sellCount" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                  </th>
                  <th className={notepadStyles.sortable} onClick={() => toggleSort("keepCount")}>
                    To Keep {sortField === "keepCount" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                  </th>
                  <th>Notes</th>
                  <th className={notepadStyles.sortable} onClick={() => toggleSort("createdAt")}>
                    Date {sortField === "createdAt" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((note) =>
                  editingId === note.id ? (
                    <tr key={note.id}>
                      <td>
                        <input
                          className={`${styles.input} ${notepadStyles.cellInput}`}
                          value={editForm.itemName}
                          onChange={(e) => setEditForm((p) => ({ ...p, itemName: e.target.value }))}
                        />
                      </td>
                      <td>
                        <input
                          className={`${styles.input} ${notepadStyles.cellNum}`}
                          type="number"
                          min={0}
                          value={editForm.totalCount}
                          onChange={(e) => setEditForm((p) => ({ ...p, totalCount: Number(e.target.value) }))}
                        />
                      </td>
                      <td>
                        <input
                          className={`${styles.input} ${notepadStyles.cellNum}`}
                          type="number"
                          min={0}
                          value={editForm.sellCount}
                          onChange={(e) => setEditForm((p) => ({ ...p, sellCount: Number(e.target.value) }))}
                        />
                      </td>
                      <td>
                        <input
                          className={`${styles.input} ${notepadStyles.cellNum}`}
                          type="number"
                          min={0}
                          value={editForm.keepCount}
                          onChange={(e) => setEditForm((p) => ({ ...p, keepCount: Number(e.target.value) }))}
                        />
                      </td>
                      <td>
                        <input
                          className={`${styles.input} ${notepadStyles.cellInput}`}
                          value={editForm.notes}
                          onChange={(e) => setEditForm((p) => ({ ...p, notes: e.target.value }))}
                        />
                      </td>
                      <td className={notepadStyles.dateCell}>{formatDate(note.createdAt)}</td>
                      <td className={notepadStyles.actions}>
                        <button className={notepadStyles.saveBtn} onClick={() => handleUpdate(note.id)}>
                          Save
                        </button>
                        <button className={notepadStyles.cancelBtn} onClick={() => setEditingId(null)}>
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={note.id}>
                      <td><strong>{note.itemName}</strong></td>
                      <td>{note.totalCount}</td>
                      <td>{note.sellCount}</td>
                      <td>{note.keepCount}</td>
                      <td className={styles.descCell}>{note.notes}</td>
                      <td className={notepadStyles.dateCell}>{formatDate(note.createdAt)}</td>
                      <td className={notepadStyles.actions}>
                        <button className={notepadStyles.editBtn} onClick={() => startEdit(note)}>
                          Edit
                        </button>
                        <button className={notepadStyles.deleteBtn} onClick={() => handleDelete(note.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
