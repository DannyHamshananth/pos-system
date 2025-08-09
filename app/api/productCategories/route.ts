import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const categories = await prisma.productCategory.findMany({
        orderBy:{
            id:"asc"
        }
    });
    return NextResponse.json(categories);
}