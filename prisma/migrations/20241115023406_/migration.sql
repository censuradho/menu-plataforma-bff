/*
  Warnings:

  - Added the required column `label` to the `menus` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_menus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL,
    "groupId" INTEGER NOT NULL,
    CONSTRAINT "menus_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "menuGroups" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_menus" ("groupId", "id") SELECT "groupId", "id" FROM "menus";
DROP TABLE "menus";
ALTER TABLE "new_menus" RENAME TO "menus";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
