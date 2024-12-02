-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_passwordRecovery" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "expireAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_passwordRecovery" ("code", "createdAt", "expireAt", "id", "userId") SELECT "code", "createdAt", "expireAt", "id", "userId" FROM "passwordRecovery";
DROP TABLE "passwordRecovery";
ALTER TABLE "new_passwordRecovery" RENAME TO "passwordRecovery";
CREATE UNIQUE INDEX "passwordRecovery_userId_key" ON "passwordRecovery"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
