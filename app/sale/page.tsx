"use client";

import React, { useState, useRef } from "react";
import { RefreshCw, Download, Plus } from "lucide-react";

import { getProducts } from "@/lib/product";

import { ProductList, columns } from "@/app/product/columns";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/dataTable";
import { Input } from "@/components/ui/input";

import { Check, ChevronsUpDown } from "lucide-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const products = [
  {
    value: "1",
    label: "Veg Cake",
    unitprice: 90,
  },
  {
    value: "2",
    label: "Egg Cake",
    unitprice: 100,
  },
  {
    value: "3",
    label: "Red Velvet Cake",
    unitprice: 150,
  },
  {
    value: "4",
    label: "Brownie",
    unitprice: 250,
  },
]

export default function Sale() {
    const [refresh, setRefresh] = useState(true);
    const [data, setData] = useState<ProductList[]>([]);
    
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    const [qty, setQty] = useState(1)

    type pr_line = {id:any,qty:Number};
    const [pr_lines, setpr_line] = useState<pr_line[]>([]);

    const [pl, setpl] = useState<String[]>([]);

    const printRef = useRef<HTMLDivElement>(null);

    const addItem = (currentValue:any) => {
      if (!searchpline(currentValue)){
        setpr_line(prev => {
        const updated = [...prev, {id: currentValue, qty:1}];
        // setValue(updated[updated.length-1].id)
        return updated;
      })
      } else { 
        removeItem(currentValue);
      }
      setValue(pr_lines[setpr_line.length-1]?.id)
    };

    const removeItem = (id:Number) => {
      setpr_line(prevpl => {
        const updated = prevpl.filter(prl => prl.id !== id);
        return updated;
      });
    };

    const searchpline = (id:any) => {
      return pr_lines.some(pr => pr.id === id)
    };

      const handlePrint = () => {
    if (!printRef.current) return;

    // Add class to body to signal print mode
    document.body.classList.add('print-mode');

    window.print();

    // Cleanup after print
    const cleanup = () => {
      document.body.classList.remove('print-mode');
      window.removeEventListener('afterprint', cleanup);
    };

    window.addEventListener('afterprint', cleanup);
  };


  return (
    <div className="w-full mx-auto lg:mx-20 max-w-fit px-8 py-4">
      <h1 className="font-bold text-2xl flex text-left">
        Sales
      </h1>
      <div className="mt-5 gap-2 flex flex-col sm:flex-row">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="flex-1 justify-between"
            >
              {pr_lines.length >0
                ? products.find(product => product.value === pr_lines[pr_lines.length-1]?.id)?.label
                : "Select product"}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex-1 p-0">
            <Command>
              <CommandInput placeholder="Search framework..." className="h-9" />
              <CommandList>
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {products.map((product) => (
                    <CommandItem
                      key={product.value}
                      value={product.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue)
                        // currentValue === value ? removeItem(currentValue):addItem(currentValue)
                        addItem(currentValue)
                        // removeItem(currentValue)
                        // setpr_line([{}])
                        setOpen(false)
                      }}
                    >
                      {product.label}
                      <Check
                        className={cn(
                          "ml-auto",
                           searchpline(product.value) ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Input className="flex-1" type="number" id="qty" min={1} value={qty} onChange={(e) => setQty(parseInt(e.target.value))} placeholder="Quantity" />
      </div>

      <div ref={printRef} id="print-section" className="max-w-sm mx-auto bg-white p-4 border border-gray-200 mt-10">
        {/* Header */}
        <div className="full-width flex mb-4">
          <div className="mx-auto">
            <h2 className="text-center text-xl font-semibold text-gray-700">Dream Factory Cakes</h2>
            <h2 className="text-center text-xl font-semibold text-gray-700">Surprise Delivery </h2>
            <p className="text-sm text-gray-500 text-center">Navalar Road, Jaffna.</p>
          </div>
        </div>

        {/* Billing Info */}
        <div className="flex gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Billed To:</h3>
            <p className="text-sm text-gray-700">
              Walk-in
            </p>
          </div>
          <div className="flex-1 text-right">
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Invoice Date:</h3>
            <p className="text-sm text-gray-700">July 26, 2025</p>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-sm font-semibold text-gray-600 mt-2">Invoice No: 251012</h3>
        </div>

        {/* Table Header */}
        <div className="border-t border-b border-gray-300 font-semibold text-sm text-gray-600 grid grid-cols-6">
          <div className="col-span-3">Item</div>
          <div className="text-center">Qty</div>
          <div className="text-right">Rate</div>
          <div className="text-right col-end-7">Amt.</div>
        </div>

        {/* Line Items */}
        <div className="divide-y divide-gray-200 text-sm text-gray-700">
          <div className="grid grid-cols-6">
            <div className="col-span-3">Red Velvet Cake</div>
            <div className="text-center">1</div>
            <div className="text-right">250</div>
            <div className="text-right col-end-7">250</div>
          </div>
          <div className="grid grid-cols-6">
            <div className="col-span-3">Veg Cake</div>
            <div className="text-center">1</div>
            <div className="text-right">100</div>
            <div className="text-right col-end-7">100</div>
          </div>
        </div>

        {/* Totals */}
        <div className="mt-6 text-sm text-gray-800">
          <div className="flex justify-end">
            <div className="w-1/2">
              <div className="flex justify-between py-1">
                <span>Subtotal</span>
                <span>350Rs.</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Discount</span>
                <span>0</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 py-2 border-t border-gray-300">
                <span>Total</span>
                <span>350Rs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-xs text-gray-500 text-center">
          Thank you for your business. If you have any questions, contact support@example.com.
        </div>
      </div>
      <div className="w-full h-[30px] mt-2 inline-grid grid-cols-2 gap-4">
        <button
          className="bg-blue-600 text-white rounded"
        >
          Sale
        </button>
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white rounded"
        >
          Print
        </button>
      </div>            
    </div>
  )
}