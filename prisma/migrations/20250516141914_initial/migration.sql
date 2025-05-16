-- AlterTable
ALTER TABLE "_MediaToUser" ADD CONSTRAINT "_MediaToUser_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_MediaToUser_AB_unique";
