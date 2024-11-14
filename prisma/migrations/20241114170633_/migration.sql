-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL DEFAULT 'Unknow',
    "lastName" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "operationModes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "stores" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "cuisineType" TEXT NOT NULL,
    "establishmentTime" TEXT NOT NULL,
    "revenueEstimate" TEXT NOT NULL,
    "numberOfEmployees" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "menuGroups" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "menus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "groupId" TEXT NOT NULL,
    CONSTRAINT "menus_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "menuGroups" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "image" TEXT,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "limitAge" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "productCustomPrice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "code" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_OperationModeToStore" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_OperationModeToStore_A_fkey" FOREIGN KEY ("A") REFERENCES "operationModes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_OperationModeToStore_B_fkey" FOREIGN KEY ("B") REFERENCES "stores" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_OperationModeToStore_AB_unique" ON "_OperationModeToStore"("A", "B");

-- CreateIndex
CREATE INDEX "_OperationModeToStore_B_index" ON "_OperationModeToStore"("B");
