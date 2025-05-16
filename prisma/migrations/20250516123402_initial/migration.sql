-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "posterPath" TEXT NOT NULL,
    "mediaType" TEXT NOT NULL,
    "overview" TEXT NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdToRecoverPassword" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresIn" TEXT NOT NULL,

    CONSTRAINT "IdToRecoverPassword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MediaToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "IdToRecoverPassword_userId_key" ON "IdToRecoverPassword"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_MediaToUser_AB_unique" ON "_MediaToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_MediaToUser_B_index" ON "_MediaToUser"("B");

-- AddForeignKey
ALTER TABLE "IdToRecoverPassword" ADD CONSTRAINT "IdToRecoverPassword_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaToUser" ADD CONSTRAINT "_MediaToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaToUser" ADD CONSTRAINT "_MediaToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
