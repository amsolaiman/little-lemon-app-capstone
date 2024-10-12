import * as SQLite from "expo-sqlite";
//
import { IMenuType } from "./types/menuType";

const db = SQLite.openDatabaseAsync("little_lemon");

export async function createTable(): Promise<void> {
  return await (
    await db
  ).execAsync(
    `CREATE TABLE IF NOT EXISTS menu (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        price TEXT,
        image TEXT,
        category TEXT
      );`
  );
}

export async function getMenuItems(): Promise<IMenuType[]> {
  return await (await db).getAllAsync("SELECT * FROM menu");
}

export async function insertMenuItems(menuItems: IMenuType[]): Promise<void> {
  await Promise.all(
    menuItems.map(async (item) =>
      (
        await db
      ).runAsync(
        `INSERT INTO menu (id, name, description, price, image, category) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.name,
          item.description,
          item.price,
          item.image,
          item.category,
        ]
      )
    )
  );
}

export async function filterByQueryAndCategories(
  query: string | null,
  categories: string[]
): Promise<IMenuType[]> {
  let sql = "SELECT * FROM menu";

  const params = [];

  if (categories.length > 0) {
    sql += " WHERE category IN (" + categories.map((_) => `?`).join(", ") + ")";

    params.push(...categories);
  }

  if (query) {
    sql += categories.length > 0 ? " AND" : " WHERE";
    sql += " name LIKE ?";

    params.push(`%${query}%`);
  }

  return await (await db).getAllAsync(sql, params);
}
