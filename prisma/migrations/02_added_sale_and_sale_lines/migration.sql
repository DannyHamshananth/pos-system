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

-- CreateTable
CREATE TABLE "public"."sale_lines" (
    "saleId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "sale_lines_pkey" PRIMARY KEY ("saleId","productId")
);

-- AddForeignKey
ALTER TABLE "public"."sale_lines" ADD CONSTRAINT "sale_lines_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "public"."sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sale_lines" ADD CONSTRAINT "sale_lines_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

