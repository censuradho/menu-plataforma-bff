-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_emailValidationTokens" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "expireAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_emailValidationTokens" ("code", "createdAt", "expireAt", "id", "userId") SELECT "code", "createdAt", "expireAt", "id", "userId" FROM "emailValidationTokens";
DROP TABLE "emailValidationTokens";
ALTER TABLE "new_emailValidationTokens" RENAME TO "emailValidationTokens";
CREATE UNIQUE INDEX "emailValidationTokens_userId_key" ON "emailValidationTokens"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
