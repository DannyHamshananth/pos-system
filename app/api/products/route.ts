import { prisma } from "@/lib/prisma"
import { NextResponse, NextRequest } from "next/server"

import { productOperations } from "@/lib/product"

export async function GET(request: Request) {
    const products = await prisma.product.findMany({
        include: {
            productCategory: true
        }
    });
    return NextResponse.json(products)
}

export async function POST(req: NextRequest,res:NextResponse) {
  const body = await req.json();
  const { name, description, unitPrice, productCategoryId } = body;

  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        unitPrice,
        productCategoryId
      },
    })

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}

// From original source
// export async function POST(request: Request) {
//     const body = await request.json()

//     if (body.queryType === productOperations.getProductNames) {
//         const response = await prisma.product.findMany({
//             select: {
//                 name: true,
//             },
//         })

//         return NextResponse.json(response)
//     }
// }