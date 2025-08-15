"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sale } from "@/lib/sale";
import { format, set } from "date-fns";

import { Button } from "@/components/ui/button";

export default function StatsPage() {
  const [sales,setSales] = useState<Sale[]>([]);

  useEffect(() => {
    (async () => {
      const response = await fetch('api/sales/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "day_start": format(set(new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }),"yyyy-MM-dd'T'HH:mm:ss.sss'Z'"), 
          "time_now": format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.sss'Z'")
        }),
        cache: 'no-store',
      });
      const data = await response.json();
      // const cleanedSales = data.map((sale: any) => ({
      //   ...sale, // copy all original properties
      //   saleLine: sale.saleLine?.map((line: any) => ({
      //     // create new cleaned line object here
      //     name: line.product.name,
      //     unitPrice: line.product.unitPrice,
      //     quantity: line.quantity
      //   }))
      // }));
      setSales(data);
    })();
  }, []);

  return (
    <div className="px-10 py-4 sm:ml-10 space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold">📊 Today Statistics</h1>

      {/* Stat Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Net Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{Sale.getTotal(sales,"total")}Rs.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Gross Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{Sale.getTotal(sales,"subTotal")}Rs.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Offer Deduction</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{Sale.getTotal(sales,"discount")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Number of Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{sales.length}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



// From original souce
// import Image from 'next/image'

// export default function Home() {
//   return (
//     <div className="">
//       <h1> Hello </h1>
//     </div>
//   )
// }

// app/stats/page.tsx