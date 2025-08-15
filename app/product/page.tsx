"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, Download, Plus, Loader2Icon, CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { getProducts, productOperations} from "@/lib/product";

import { ProductList, columns } from "@/app/product/columns";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/dataTable";

import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export default function Transaction() {
    const [open, setOpen] = React.useState(false); // State for category popover
    const [refresh, setRefresh] = useState(true);
    const [data, setData] = useState<ProductList[]>([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState<string>("");
    const [unitPrice, setUnitPrice] = useState<number>(0);
    const [productCategoryId,setProductCategoryId] = useState<number>(0);

    type Category = {id:Number,name:String};
    
    const [categories, setCategories] = useState<Category[]>([]);

    const [isVisible, setIsVisible] = useState(false);

    const add_product = async () => {
        setIsVisible(true);
        console.log(name, unitPrice, description, productCategoryId);
        const res = await fetch(`api/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name, unitPrice, description, productCategoryId}),
            cache: 'no-store',
        });
        if (res.status === 201) {
            setName("");
            setDescription("");
            setProductCategoryId(0);
            setUnitPrice(0);
            setIsVisible(false);
        }
    }

    useEffect(() => {
        if (!refresh) {
            return;
        }

        setData([]);
        (async () => {
            const data = await getProducts(productOperations.getProductNamesDetailed);
            setData(data);
            setRefresh(false);
        })();

        (async () => {
            const response = await fetch('api/productCategories');
            const data =  await response.json();
            setCategories(data);
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
                                            value={name}
                                            onChange={(e)=> setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="description">Description</Label>
                                        <Input
                                            id="description"
                                            className="col-span-2 h-8"
                                            value={description}
                                            onChange={(e)=> setDescription(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="unitPrice">Unit Price</Label>
                                        <Input
                                            id="unitPrice"
                                            className="col-span-2 h-8"
                                            value={isNaN(unitPrice)?"0":unitPrice?.toString()}
                                            onChange={(e)=> setUnitPrice(parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="maxHeight">Category</Label>
                                        <div className="col-span-2 h-8">
                                            <Popover open={open} onOpenChange={setOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={open}
                                                        className="justify-between w-full h-full"
                                                    >
                                                        {productCategoryId
                                                            ? categories.find((category) => category.id === productCategoryId)?.name
                                                            : "Select category..."}
                                                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[200px] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search framework..." className=""/>
                                                        <CommandList>
                                                            <CommandEmpty>No framework found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {categories.map((category) => (
                                                                    <CommandItem
                                                                        key={category.id.toString()}
                                                                        value={category.id.toString()}
                                                                        onSelect={(currentValue) => {
                                                                            setProductCategoryId(parseInt(currentValue) == productCategoryId ? 0 : parseInt(currentValue))
                                                                            setOpen(false)
                                                                        }}
                                                                    >
                                                                        <CheckIcon
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                productCategoryId === category.id ? "opacity-100" : "opacity-0"
                                                                            )}
                                                                        />
                                                                        {category.name}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                    <div className="mt-2 grid grid-cols-4 items-center gap-4">
                                        <Button onClick={add_product} className="col-start-2 col-end-4 gap-2">
                                            {isVisible && (
                                                <Loader2Icon className="animate-spin" />
                                            )}
                                            Save
                                        </Button>
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