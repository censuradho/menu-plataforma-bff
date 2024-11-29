-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_products" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "value" TEXT NOT NULL,
    "image" TEXT,
    "assetId" INTEGER,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "limitAge" BOOLEAN NOT NULL DEFAULT false,
    "menuId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "products_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "menus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_products" ("assetId", "createdAt", "description", "id", "image", "label", "limitAge", "menuId", "updatedAt", "value", "visible") SELECT "assetId", "createdAt", "description", "id", "image", "label", "limitAge", "menuId", "updatedAt", "value", "visible" FROM "products";
DROP TABLE "products";
ALTER TABLE "new_products" RENAME TO "products";
CREATE UNIQUE INDEX "products_assetId_key" ON "products"("assetId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
