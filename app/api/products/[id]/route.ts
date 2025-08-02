import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// PUT /api/products/:id
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const { name, description, unitPrice, productCategoryId } = await req.json();

  try {
    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        unitPrice,
        productCategoryId
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Product not found or update failed' }, { status: 400 })
  }
}