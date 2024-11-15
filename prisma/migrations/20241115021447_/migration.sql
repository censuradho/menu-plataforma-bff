/*
  Warnings:

  - Added the required column `storeId` to the `menuGroups` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_menuGroups" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "storeId" INTEGER NOT NULL,
    "hourFrom" TEXT,
    "hourTo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "menuGroups_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_menuGroups" ("createdAt", "hourFrom", "hourTo", "id", "label", "updatedAt", "visible") SELECT "createdAt", "hourFrom", "hourTo", "id", "label", "updatedAt", "visible" FROM "menuGroups";
DROP TABLE "menuGroups";
ALTER TABLE "new_menuGroups" RENAME TO "menuGroups";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
