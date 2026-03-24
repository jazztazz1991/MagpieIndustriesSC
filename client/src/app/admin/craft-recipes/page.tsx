"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import styles from "../recipes.module.css";

interface Ingredient { item: string; quantity: number; }
interface CraftRecipe {
  id: string; name: string; description: string | null; category: string;
  outputItem: string; outputQty: number; difficulty: string | null;
  notes: string | null; ingredients: { id: string; item: string; quantity: number }[];
  createdAt: string; updatedAt: string;
}

const CATEGORIES = ["weapons", "armor", "components", "consumables", "misc"];
const DIFFICULTIES = ["easy", "medium", "hard", "expert"];

export default function CraftRecipesPage() {
  const { user, loading: authLoading } = useAuth();
  const [recipes, setRecipes] = useState<CraftRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("misc");
  const [outputItem, setOutputItem] = useState("");
  const [outputQty, setOutputQty] = useState(1);
  const [difficulty, setDifficulty] = useState("");
  const [notes, setNotes] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.isAdmin) { setLoading(false); return; }
    fetchRecipes();
  }, [authLoading, user]);

  async function fetchRecipes() {
    setLoading(true);
    const qs = filter ? `?category=${filter}` : "";
    const res = await apiFetch<CraftRecipe[]>(`/api/craft-recipes${qs}`);
    if (res.success && res.data) setRecipes(res.data);
    setLoading(false);
  }

  function resetForm() {
    setName(""); setDescription(""); setCategory("misc"); setOutputItem("");
    setOutputQty(1); setDifficulty(""); setNotes(""); setIngredients([]);
    setEditId(null); setShowForm(false); setError(null);
  }

  function startEdit(r: CraftRecipe) {
    setEditId(r.id); setName(r.name); setDescription(r.description || "");
    setCategory(r.category); setOutputItem(r.outputItem); setOutputQty(r.outputQty);
    setDifficulty(r.difficulty || ""); setNotes(r.notes || "");
    setIngredients(r.ingredients.map((i) => ({ item: i.item, quantity: i.quantity })));
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true); setError(null);
    const body = {
      name, category, outputItem, outputQty, ingredients,
      ...(description ? { description } : {}),
      ...(difficulty ? { difficulty } : {}),
      ...(notes ? { notes } : {}),
    };

    const res = editId
      ? await apiFetch(`/api/craft-recipes/${editId}`, { method: "PATCH", body: JSON.stringify(body) })
      : await apiFetch("/api/craft-recipes", { method: "POST", body: JSON.stringify(body) });

    if (res.success) { resetForm(); fetchRecipes(); }
    else { setError(res.error || "Failed to save"); }
    setSubmitting(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this recipe?")) return;
    await apiFetch(`/api/craft-recipes/${id}`, { method: "DELETE" });
    fetchRecipes();
  }

  function getDiffClass(d: string | null) {
    if (!d) return styles.difficultyBadge;
    const map: Record<string, string> = { easy: styles.diffEasy, medium: styles.diffMedium, hard: styles.diffHard, expert: styles.diffExpert };
    return `${styles.difficultyBadge} ${map[d] || ""}`;
  }

  if (authLoading || loading) return <div className={styles.loading}>Loading...</div>;
  if (!user?.isAdmin) return <div className={styles.denied}>Admin access required.</div>;

  return (
    <div className={styles.recipesPage}>
      <Link href="/admin" className={styles.backLink}>Back to Admin</Link>
      <div className={styles.header}>
        <h1 className={styles.title}>Craft Recipes</h1>
        <button className={styles.newBtn} onClick={() => { resetForm(); setShowForm(!showForm); }}>
          {showForm ? "Cancel" : "New Recipe"}
        </button>
      </div>

      {showForm && (
        <form className={styles.createForm} onSubmit={handleSubmit}>
          <div className={styles.formTitle}>{editId ? "Edit Recipe" : "New Craft Recipe"}</div>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Output Item</label>
              <input value={outputItem} onChange={(e) => setOutputItem(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label>Output Qty</label>
              <input type="number" min={1} value={outputQty} onChange={(e) => setOutputQty(Number(e.target.value))} />
            </div>
            <div className={styles.formGroup}>
              <label>Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="">None</option>
                {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className={`${styles.formGroup} ${styles.formGridFull}`}>
              <label>Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className={`${styles.formGroup} ${styles.formGridFull}`}>
              <label>Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>

          <div className={styles.listSection}>
            <div className={styles.listSectionTitle}>Ingredients</div>
            {ingredients.map((ing, i) => (
              <div key={i} className={styles.listRow}>
                <input placeholder="Item name" value={ing.item} onChange={(e) => { const arr = [...ingredients]; arr[i].item = e.target.value; setIngredients(arr); }} />
                <input type="number" min={1} value={ing.quantity} onChange={(e) => { const arr = [...ingredients]; arr[i].quantity = Number(e.target.value); setIngredients(arr); }} />
                <button type="button" className={styles.removeBtn} onClick={() => setIngredients(ingredients.filter((_, j) => j !== i))}>x</button>
              </div>
            ))}
            <button type="button" className={styles.addBtn} onClick={() => setIngredients([...ingredients, { item: "", quantity: 1 }])}>+ Add Ingredient</button>
          </div>

          <div className={styles.formActions}>
            <button className={styles.submitBtn} type="submit" disabled={submitting}>{submitting ? "Saving..." : editId ? "Update" : "Create"}</button>
            <button className={styles.cancelBtn} type="button" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      )}

      <div className={styles.filterBar}>
        <select className={styles.selectSmall} value={filter} onChange={(e) => { setFilter(e.target.value); }}>
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button className={styles.newBtn} style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem" }} onClick={() => fetchRecipes()}>Filter</button>
      </div>

      <div className={styles.recipeList}>
        {recipes.length === 0 && <div className={styles.emptyState}>No craft recipes yet.</div>}
        {recipes.map((r) => (
          <div key={r.id} className={styles.recipeCard}>
            <div className={styles.recipeHeader}>
              <span className={styles.recipeName}>{r.name}</span>
              <span>
                <span className={styles.categoryBadge}>{r.category}</span>
                {r.difficulty && <span className={getDiffClass(r.difficulty)}>{r.difficulty}</span>}
              </span>
            </div>
            <div className={styles.recipeMeta}>
              Produces: {r.outputQty}x {r.outputItem}
            </div>
            {r.description && <div className={styles.recipeDesc}>{r.description}</div>}
            {r.ingredients.length > 0 && (
              <ul className={styles.ingredientList}>
                {r.ingredients.map((ing) => <li key={ing.id}>{ing.quantity}x {ing.item}</li>)}
              </ul>
            )}
            <div className={styles.cardActions}>
              <button className={styles.editBtn} onClick={() => startEdit(r)}>Edit</button>
              <button className={styles.deleteBtn} onClick={() => handleDelete(r.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
