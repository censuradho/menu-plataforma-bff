-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_stores" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "cuisineType" TEXT NOT NULL,
    "establishmentTime" TEXT NOT NULL,
    "revenueEstimate" TEXT NOT NULL,
    "numberOfEmployees" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "stores_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_stores" ("cuisineType", "document", "documentType", "establishmentTime", "id", "name", "numberOfEmployees", "ownerId", "revenueEstimate") SELECT "cuisineType", "document", "documentType", "establishmentTime", "id", "name", "numberOfEmployees", "ownerId", "revenueEstimate" FROM "stores";
DROP TABLE "stores";
ALTER TABLE "new_stores" RENAME TO "stores";
CREATE UNIQUE INDEX "stores_ownerId_key" ON "stores"("ownerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
