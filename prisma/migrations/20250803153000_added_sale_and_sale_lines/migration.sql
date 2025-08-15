-- CreateTable
CREATE TABLE "public"."sales" (
    "id" SERIAL NOT NULL,
    "invoicenum" INTEGER NOT NULL,
    "subTotal" INTEGER NOT NULL,
    "saleDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL,

    CONSTRAINT "sales_pkey" PRIMARY KEY ("id")
);