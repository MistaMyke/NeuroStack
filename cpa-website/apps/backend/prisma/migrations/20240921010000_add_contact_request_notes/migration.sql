-- CreateTable
CREATE TABLE "ContactRequestNote" (
    "id" TEXT NOT NULL,
    "contactRequestId" TEXT NOT NULL,
    "staffEmail" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactRequestNote_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ContactRequestNote_contactRequestId_fkey" FOREIGN KEY ("contactRequestId") REFERENCES "ContactRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex (optional for sorting)
CREATE INDEX "ContactRequestNote_contactRequestId_idx" ON "ContactRequestNote"("contactRequestId");
