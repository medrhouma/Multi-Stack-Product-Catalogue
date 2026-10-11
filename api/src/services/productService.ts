import { prisma } from "../lib/prisma.js";
import type { z } from "zod";
import type { listQuery, productBody, productPatch } from "../schemas/product.js";

type ListQuery = z.infer<typeof listQuery>;
type ProductBody = z.infer<typeof productBody>;
type ProductPatch = z.infer<typeof productPatch>;

const withCategory = { category: true } as const;

// Prisma returns Decimal objects (serialized as strings in JSON): convert to number
const toDto = <T extends { price: { toNumber(): number } }>(p: T) => ({
  ...p,
  price: p.price.toNumber(),
});

export async function list({ limit, skip, q, category }: ListQuery) {
  const where = {
    ...(q && { title: { contains: q, mode: "insensitive" as const } }),
    ...(category && { category: { name: category } }),
  };
  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, take: limit, skip, orderBy: { id: "asc" }, include: withCategory }),
    prisma.product.count({ where }),
  ]);
  return { products: products.map(toDto), total, limit, skip };
}

export const getById = async (id: number) => {
  const p = await prisma.product.findUnique({ where: { id }, include: withCategory });
  return p && toDto(p);
};

export const create = async ({ category, ...data }: ProductBody) =>
  toDto(
    await prisma.product.create({
      data: {
        ...data,
        category: { connectOrCreate: { where: { name: category }, create: { name: category } } },
      },
      include: withCategory,
    }),
  );

export const update = async (id: number, { category, ...data }: ProductPatch) =>
  toDto(
    await prisma.product.update({
      where: { id },
      data: {
        ...data,
        ...(category && {
          category: { connectOrCreate: { where: { name: category }, create: { name: category } } },
        }),
      },
      include: withCategory,
    }),
  );

export const remove = (id: number) => prisma.product.delete({ where: { id } });