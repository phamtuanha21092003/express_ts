-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_id_key" ON "Account"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");
