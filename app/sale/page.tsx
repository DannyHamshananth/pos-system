"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, Download, Plus } from "lucide-react";

import { getProducts } from "@/lib/product";

import { ProductList, columns } from "@/app/product/columns";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/dataTable";

export default function Sale() {
    const [refresh, setRefresh] = useState(true);
    const [data, setData] = useState<ProductList[]>([]);

    useEffect(() => {
        if (!refresh) {
            return;
        }

        setData([]);
        (async () => {
            const data = await getProducts();
            setData(data);
            setRefresh(false);
        })();
    }, [refresh]);

    return (
        // <div className="py-6 px-10 mx-auto w-full max-w-[600px] flex-none">
        //     <div className="flex flex-col">
        //         <div className="mr-auto flex">
        //             <h1 className="mr-auto font-bold text-2xl flex items-center">
        //                 Sales
        //             </h1>
        //             <div className="ml-5 my-auto h-4 w-4 items-center flex">
        //                 <Button variant="ghost" className={"rounded-full p-3 items-center " + (refresh ? "animate-spin": "")} onClick={() => setRefresh(true)}>
        //                     <RefreshCw className="w-4 h-4" />
        //                 </Button>
        //             </div>
        //         </div>
        //         <div className="ml-auto flex sm:justify-normal sm:p-2 gap-5">
        //             <Button variant="outline" className="my-auto">
        //                 <Plus className="w-4 h-4 mr-2" /> New product
        //             </Button>
        //             <Button className="my-auto">
        //                 <Download className="w-4 h-4 mr-2" /> Download
        //             </Button>
        //         </div>
        //     </div>
        //     <div className="mx-auto mt-10">
        //         {/* Content */}
        //     </div>
        // </div>
            <div className="w-full max-w-md mx-auto md:mx-20 px-4 py-4">
                Sales
            </div>
    )
}