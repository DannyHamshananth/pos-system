"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, Download, Plus } from "lucide-react";

import { getProducts } from "@/lib/product";

import { ProductList, columns } from "@/app/product/columns";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/dataTable";

import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Transaction() {
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
        <div className="py-6 px-10 sm:px-20">
            <div className="flex flex-col sm:space-y-4">
                <div className="mr-auto flex">
                    <h1 className="mr-auto font-bold text-2xl flex items-center">
                        Products
                    </h1>
                    <div className="ml-5 my-auto h-4 w-4 items-center flex">
                        <Button variant="ghost" className={"rounded-full p-3 items-center " + (refresh ? "animate-spin": "")} onClick={() => setRefresh(true)}>
                            <RefreshCw className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <div className="ml-auto mt-10 flex sm:justify-normal sm:p-2 gap-5">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline">New Product</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <h4 className="leading-none font-medium">Add new product</h4>
                                    <p className="text-muted-foreground text-sm">
                                        Add a new product with exising/new category.
                                    </p>
                                </div>
                                <div className="grid gap-2">
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="width">Name</Label>
                                        <Input
                                            id="name"
                                            className="col-span-2 h-8"
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="description">Description</Label>
                                        <Input
                                            id="description"
                                            className="col-span-2 h-8"
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="unitPrice">Unit Price</Label>
                                        <Input
                                            id="unitPrice"
                                            className="col-span-2 h-8"
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="maxHeight">Category</Label>
                                        <Input
                                            id="maxHeight"
                                            className="col-span-2 h-8"
                                        />
                                    </div>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <Button className="my-auto">
                        <Download className="w-4 h-4 mr-2" /> Download
                    </Button>
                </div>
            </div>
            <div className="mx-auto mt-10">
                <DataTable columns={columns} data={data} />
            </div>
        </div>
    )
}