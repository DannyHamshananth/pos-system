import { prisma } from "@/lib/prisma"
import { NextResponse, NextRequest } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const start_time = searchParams.get('start_time')|| undefined;
  const end_time = searchParams.get('end_time')|| undefined;
  
  console.log(start_time);
  console.log(end_time);

  const sales = await prisma.sale.findMany({
    where: {
      saleDate: {
        gte: start_time,
        lte: end_time
      }
    },
    include: {
      saleLine: { select: { product: { select: { name: true, unitPrice: true} }, quantity: true } },
    }
  });
  return NextResponse.json(sales);
}

export async function POST(req: NextRequest,res:NextResponse) {
  const body = await req.json();
  const { invoicenum, saleLine, subTotal, discount, total, saleDate } = body;

  console.log(invoicenum, saleLine, subTotal, discount, total, saleDate);
  try {
    const newSale = await prisma.sale.create({
      data: {
        invoicenum,
        saleLine: {create:saleLine},
        subTotal,
        discount,
        total,
        saleDate
      },
    })

    return NextResponse.json(newSale, { status: 201 })
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }

}