"use client";

import React, { useState, useEffect, useRef } from "react";
import { RefreshCw, Download, Plus } from "lucide-react";

import { ProductList, columns } from "@/app/product/columns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Check, ChevronsUpDown } from "lucide-react"
import { format } from 'date-fns'

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
import { setPriority } from "os";

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
    const shopname = process.env.NEXT_PUBLIC_SHOP_NAME;
    const shopadress = process.env.NEXT_PUBLIC_SHOP_ADDRESS;
    const shopcontact = process.env.NEXT_PUBLIC_SHOP_CONTACT;

    const [refresh, setRefresh] = useState(true);
    const [data, setData] = useState<ProductList[]>([]);
    
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(0)

    const [qty, setQty] = useState(0)

    type pr_line = {id:any,qty:number};
    const [pr_lines, setpr_line] = useState<pr_line[]>([]);
    const [offer, setOffer] = useState(0)

    const printRef = useRef<HTMLDivElement>(null);

    const addItem = (currentValue:any) => {
      if (!searchpline(currentValue)){
        setpr_line(prev => {
        const updated = [...prev, {id: currentValue, qty:1}];
        setValue(updated[updated.length-1].id)
        return updated;
      })
      } else { 
        removeItem(currentValue);
      }
      // setValue(pr_lines[setpr_line.length-1]?.id)
    };

    const removeItem = (id:Number) => {
      setpr_line(prevpl => {
        const updated = prevpl.filter(prl => prl.id !== id);
        setValue(updated[updated.length-1]?.id)
        return updated;
      });
    };

    const searchpline = (id:any) => {
      return pr_lines.some(pr => pr.id === id)
    };

    const qtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setpr_line(prev =>
        prev.map(pr_line =>
          pr_line.id === value ? { ...pr_line, ...{id:value,qty:parseInt(e.target.value)} }: pr_line
        )
      );
    }

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

  const gen_saleref = () => {
    const id = format(new Date(), 'yyMMdd') + Math.floor(Math.random() * 1000);
    return id;
  }


  return (
    <div className="w-full mx-auto lg:mx-25 max-w-fit px-8 py-4">
      <h1 className="font-bold text-2xl flex text-left">
        Sales
      </h1>
      <div className="mt-5 gap-2 flex flex-col md:flex-row">
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
                        // setValue(currentValue === value ? "" : currentValue)
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
        <Input className="flex-1" disabled={pr_lines.length?false:true} type="number" id="qty" value={pr_lines.length?pr_lines.find(pr_line => (pr_line.id===value))?.qty:0} onChange={qtyChange} placeholder="Quantity" />
        <Input className="flex-1" disabled={pr_lines.length?false:true} type="number" value={offer} placeholder="Discount (Rs.)" onChange={(e)=> setOffer(parseInt(e.target.value))}/>
      </div>

      <div ref={printRef} id="print-section" className="max-w-sm mx-auto bg-white p-4 border border-gray-200 mt-10">
        {/* Header */}
        <div className="full-width flex mb-4">
          <div className="mx-auto">
            <h2 className="text-center text-xl font-semibold text-gray-700">{shopname}</h2>
            <p className="text-sm text-gray-500 text-center">{shopadress}</p>
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
            {/* <p className="text-sm text-gray-700">{format(new Date(), 'yyyy-MMM-dd')}</p>
            <p className="text-sm text-gray-700">{format(new Date(), 'h:mm a')}</p> */}
            <p className="text-sm text-gray-700">{'est'}</p>
            <p className="text-sm text-gray-700">{'test'}</p>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-sm font-semibold text-gray-600 mt-2">Invoice No:Test</h3>
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
          {pr_lines.map((prline,index)=>(
            <div className="grid grid-cols-6">
              <div className="col-span-3">{products.find(product=> product.value === prline.id)?.label}</div>
              <div className="text-center">{prline.qty.toString()}</div>
              <div className="text-right">{products.find(product=> product.value === prline.id)?.unitprice}</div>
              <div className="text-right col-end-7">{prline?.qty.valueOf()*(products.find(product=> product.value === prline.id)?.unitprice??0)}</div>
            </div>
          ))}
        </div>
        {/* Totals */}
        <div className="mt-6 text-sm text-gray-800">
          <div className="flex justify-end">
            <div className="w-1/2">
              <div className="flex justify-between py-1">
                <span>Subtotal</span>
                <span>{pr_lines.reduce((sum,pr_line)=> sum + products.find(product=> product.value === pr_line.id)!.unitprice*pr_line.qty, 0)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Off.</span>
                <span>{offer}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 py-2 border-t border-gray-300">
                <span>Total</span>
                <span>{pr_lines.reduce((sum,pr_line)=> sum + products.find(product=> product.value === pr_line.id)!.unitprice*pr_line.qty, 0)-offer}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          Thank you for your purchase! For questions or future orders, contact us via phone or WhatsApp {shopcontact}.
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