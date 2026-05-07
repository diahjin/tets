-- Initial PostgreSQL schema for Bley Bley Arena
CREATE TYPE "BleyType" AS ENUM ('ATAQUE', 'DEFENSA', 'RESISTENCIA', 'EQUILIBRIO');
CREATE TYPE "PieceCategory" AS ENUM ('ENERGY_LAYER', 'FORGE_DISC', 'PERFORMANCE_TIP', 'CHIP_CORE', 'BLADE', 'RATCHET', 'BIT', 'OTHER');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "username" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "avatarUrl" TEXT,
  "bio" TEXT,
  "darkMode" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PasswordResetToken" (
  "id" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "usedAt" TIMESTAMP(3),
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Bley" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "imageUrl" TEXT,
  "type" "BleyType" NOT NULL,
  "layer" TEXT,
  "disc" TEXT,
  "driver" TEXT,
  "chipCore" TEXT,
  "blade" TEXT,
  "ratchet" TEXT,
  "bit" TEXT,
  "notes" TEXT,
  "tags" TEXT NOT NULL DEFAULT '[]',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "userId" TEXT NOT NULL,
  CONSTRAINT "Bley_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Piece" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "category" "PieceCategory" NOT NULL,
  "type" "BleyType",
  "weight" DOUBLE PRECISION,
  "material" TEXT,
  "advantages" TEXT,
  "disadvantages" TEXT,
  "compatibility" TEXT,
  "description" TEXT,
  "imageUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Piece_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Combat" (
  "id" TEXT NOT NULL,
  "bleyId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "result" TEXT NOT NULL,
  "rival" TEXT,
  "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Combat_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Bley" ADD CONSTRAINT "Bley_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Combat" ADD CONSTRAINT "Combat_bleyId_fkey" FOREIGN KEY ("bleyId") REFERENCES "Bley"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Combat" ADD CONSTRAINT "Combat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
