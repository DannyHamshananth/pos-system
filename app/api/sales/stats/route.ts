import { prisma } from "@/lib/prisma"
import { NextResponse, NextRequest } from "next/server"
import { formatISO, parseISO } from "date-fns";

export async function POST(request: NextRequest, response:NextResponse) {
    const { day_start, time_now } = await request.json();

    const sales = await prisma.sale.findMany({
        where:{
            saleDate: {
                gte: day_start,
                lte: time_now
            }
        }
    });

    return NextResponse.json(sales);
}


// prisma count with where clause
// const countToday = await prisma.sale.count({
//     where: {
//         saleDate: {
//             gte: day_start,
//             lte: time_now
//         }
//     }
// });

// prisma sum
// const sum = await prisma.sale.aggregate({
//     where:{
//         saleDate: {
//             gte: day_start,
//             lte: time_now
//         }
//     },
//     _sum: {total:true}
// });