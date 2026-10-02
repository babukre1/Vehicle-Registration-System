CREATE TABLE "registration_attachments" (
    "id" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "objectKey" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "registration_attachments_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "registration_attachments_objectKey_key" ON "registration_attachments"("objectKey");
CREATE INDEX "registration_attachments_registrationId_idx" ON "registration_attachments"("registrationId");
ALTER TABLE "registration_attachments" ADD CONSTRAINT "registration_attachments_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "vehicle_registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
