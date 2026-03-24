import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

export const craftRecipesRouter = Router();

const ingredientSchema = z.object({
  item: z.string().min(1).max(200),
  quantity: z.number().int().min(1).default(1),
});

const createRecipeSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  category: z.string().min(1).max(100),
  outputItem: z.string().min(1).max(200),
  outputQty: z.number().int().min(1).default(1),
  difficulty: z.string().max(50).optional(),
  notes: z.string().max(5000).optional(),
  ingredients: z.array(ingredientSchema).default([]),
});

const updateRecipeSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  category: z.string().min(1).max(100).optional(),
  outputItem: z.string().min(1).max(200).optional(),
  outputQty: z.number().int().min(1).optional(),
  difficulty: z.string().max(50).optional(),
  notes: z.string().max(5000).optional(),
  ingredients: z.array(ingredientSchema).optional(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toRecipeDTO(r: any) {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    category: r.category,
    outputItem: r.outputItem,
    outputQty: r.outputQty,
    difficulty: r.difficulty,
    notes: r.notes,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ingredients: (r.ingredients || []).map((i: any) => ({ id: i.id, item: i.item, quantity: i.quantity })),
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

// GET /api/craft-recipes
craftRecipesRouter.get("/", requireAuth, async (req, res) => {
  try {
    const category = typeof req.query.category === "string" ? req.query.category : undefined;
    const where = category ? { category } : {};

    const recipes = await prisma.craftRecipe.findMany({
      where,
      include: { ingredients: { select: { id: true, item: true, quantity: true } } },
      orderBy: { name: "asc" },
    });

    res.json({ success: true, data: recipes.map(toRecipeDTO) });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /api/craft-recipes/:id
craftRecipesRouter.get("/:id", requireAuth, async (req, res) => {
  try {
    const recipeId = req.params.id as string;
    const recipe = await prisma.craftRecipe.findUnique({
      where: { id: recipeId },
      include: { ingredients: { select: { id: true, item: true, quantity: true } } },
    });

    if (!recipe) {
      res.status(404).json({ success: false, error: "Recipe not found" });
      return;
    }

    res.json({ success: true, data: toRecipeDTO(recipe) });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/craft-recipes — admin only
craftRecipesRouter.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const parsed = createRecipeSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    const { ingredients, ...data } = parsed.data;
    const recipe = await prisma.craftRecipe.create({
      data: { ...data, ingredients: { create: ingredients } },
      include: { ingredients: { select: { id: true, item: true, quantity: true } } },
    });

    res.status(201).json({ success: true, data: toRecipeDTO(recipe) });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// PATCH /api/craft-recipes/:id — admin only
craftRecipesRouter.patch("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const recipeId = req.params.id as string;
    const parsed = updateRecipeSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.issues[0].message });
      return;
    }

    const { ingredients, ...data } = parsed.data;

    if (ingredients) {
      await prisma.craftIngredient.deleteMany({ where: { recipeId } });
    }

    const recipe = await prisma.craftRecipe.update({
      where: { id: recipeId },
      data: { ...data, ...(ingredients ? { ingredients: { create: ingredients } } : {}) },
      include: { ingredients: { select: { id: true, item: true, quantity: true } } },
    });

    res.json({ success: true, data: toRecipeDTO(recipe) });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// DELETE /api/craft-recipes/:id — admin only
craftRecipesRouter.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const recipeId = req.params.id as string;
    await prisma.craftRecipe.delete({ where: { id: recipeId } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
