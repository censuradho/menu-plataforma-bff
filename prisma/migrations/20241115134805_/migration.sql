-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_menus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL,
    "groupId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "menus_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "menuGroups" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_menus" ("groupId", "id", "label") SELECT "groupId", "id", "label" FROM "menus";
DROP TABLE "menus";
ALTER TABLE "new_menus" RENAME TO "menus";
CREATE TABLE "new_productCustomPrice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "productCustomPrice_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_productCustomPrice" ("active", "code", "id", "productId", "value") SELECT "active", "code", "id", "productId", "value" FROM "productCustomPrice";
DROP TABLE "productCustomPrice";
ALTER TABLE "new_productCustomPrice" RENAME TO "productCustomPrice";
CREATE TABLE "new_products" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "image" TEXT,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "limitAge" BOOLEAN NOT NULL DEFAULT false,
    "menuId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "products_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "menus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_products" ("id", "image", "label", "limitAge", "menuId", "value", "visible") SELECT "id", "image", "label", "limitAge", "menuId", "value", "visible" FROM "products";
DROP TABLE "products";
ALTER TABLE "new_products" RENAME TO "products";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
