"use client";

import React, { useState, useEffect, useRef } from "react";
import { Check, ChevronsUpDown, Printer} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { format } from 'date-fns'

import { getProducts, productOperations, Product} from "@/lib/product";

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
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Sale() {
    const shopname = process.env.NEXT_PUBLIC_SHOP_NAME;
    const shopadress = process.env.NEXT_PUBLIC_SHOP_ADDRESS;
    const shopcontact = process.env.NEXT_PUBLIC_SHOP_CONTACT;
    
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(0)

    const [date, setDate] = useState("")
    const [time, setTime] = useState("")
    const [saleDate, setSaleDate] = useState("")
    const [invoicenum, setInvoiceNum] = useState<number>();
    const [products, setProducts] = useState<Product[]>([]);

    const [isBtnVisible, setIsBtnVisible] = useState(false);

  const showToast = (message: any, code: any) => {
    if (code == 1) {
      const id = toast.success(message, {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss(id);   // 👈 closes this toast
          },
        },
      })
    } else {
      const id = toast.error(message, {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss(id);   // 👈 closes this toast
          },
        },
      })
    }
  }

    useEffect(() => {
      setDate(format(new Date(), 'yyyy-MMM-dd'));
      setTime(format(new Date(), 'hh:mma'));
      setSaleDate(format(new Date(), 'yyyy-MM-dd HH:mm:ss').replace(" ", "T") + "Z");
      setInvoiceNum(parseInt(format(new Date(), 'MMddhhmm') + Math.floor(Math.random() * 10)));
      (async () => {
        const data = await getProducts(productOperations.getProductNamesShorter);
        setProducts(data);
      })();
    }, []);

    type pr_line = {productId:number,quantity:number};
    const [pr_lines, setpr_line] = useState<pr_line[]>([]);
    const [discount, setDiscount] = useState(0)

    const printRef = useRef<HTMLDivElement>(null);

    const addItem = (currentValue:number) => {
      if (!searchpline(currentValue)){
        setpr_line(prev => {
        const updated = [...prev, {productId: currentValue, quantity:1}];
        setValue(updated[updated.length-1].productId)
        return updated;
      })
      } else { 
        removeItem(currentValue);
      }
    };

    const removeItem = (id:number) => {
      setpr_line(prevpl => {
        const updated = prevpl.filter(prl => prl.productId !== id);
        setValue(updated[updated.length-1]?.productId)
        return updated;
      });
    };

    const searchpline = (id:number) => {
      return pr_lines.some(pr => pr.productId === id)
    };

    const qtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setpr_line(prev =>
        prev.map(pr_line =>
          pr_line.productId === value ? { ...pr_line, ...{productId:value,quantity:parseInt(e.target.value)} }: pr_line
        )
      );
    }

    const completeSale = async () => {
      if (pr_lines.length == 0) {
        alert('No items selected!')
      } else {
        const subTotal = pr_lines.reduce((sum,pr_line)=> sum + products.find(product=> product.id == pr_line.productId)!.unitPrice*pr_line.quantity, 0);
        const total = subTotal - discount;
        const res = await fetch(`api/sales`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({invoicenum, saleLine:pr_lines, subTotal, discount, total, saleDate}),
            cache: 'no-store',
        });

        if (res.status === 201) {
          setIsBtnVisible(true);
          showToast("Sales Saved!", 1);
        } else {
          showToast("Error...!", 0);
        }
      }
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

  return (
    <div className="w-full mx-auto lg:mx-25 max-w-fit px-8 py-4">
      <h1 className="font-bold text-2xl flex text-left">
        Sales
      </h1>
      <div className="mt-5 gap-2 flex flex-col md:flex-row">
        <div className="flex-1 grid w-full max-w-sm items-center gap-1">
        <Label htmlFor="product">Add product</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="flex-1 justify-between"
            >
              {pr_lines.length >0
                ? products.find(product => product.id == pr_lines[pr_lines.length-1]?.productId)?.name
                : "Select product"}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 full-width">
            <Command className="flex-1">
              <CommandInput id="product" placeholder="Search products..." className="h-9" />
              <CommandList>
                <CommandEmpty>No product found.</CommandEmpty>
                <CommandGroup>
                  {products.map((product) => (
                    <CommandItem
                      key={product.id}
                      value={product.id.toString()}
                      onSelect={(currentValue) => {
                        addItem(parseInt(currentValue))
                        setOpen(false)
                      }}
                    >
                      {product.name}
                      <Check
                        className={cn(
                          "ml-auto",
                           searchpline(product.id) ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        </div>
        {/* <Input className="flex-1" disabled={pr_lines.length?false:true} type="number" id="qty" value={(pr_lines.length?pr_lines.find(pr_line => (pr_line.id===value))?.qty:0)?.toString()} onChange={qtyChange} placeholder="Quantity" />
        <Input className="flex-1" disabled={pr_lines.length?false:true} type="number" value={offer} placeholder="Discount (Rs.)" onChange={(e)=> setOffer(parseInt(e.target.value))}/> */}

        <div className="flex-1 grid w-full max-w-sm items-center gap-1">
          <Label htmlFor="qty">Quantity</Label>
          <Input disabled={pr_lines.length?false:true} type="number" id="qty" value={(pr_lines.length?pr_lines.find(pr_line => (pr_line.productId==value))?.quantity:0)?.toString()} onChange={qtyChange} placeholder="Quantity" />
        </div>
        <div className="flex-1 grid w-full max-w-sm items-center gap-1">
          <Label htmlFor="offer">Off./Discount (In Rs.)</Label>
          <Input className="flex-1" disabled={pr_lines.length?false:true} type="number" id="offer" value={discount} placeholder="Discount (Rs.)" onChange={(e)=> setDiscount(parseInt(e.target.value))}/>
        </div>
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
        <div className="flex gap-2">
          <div className="flex-1 align-left min-h-[40px]">
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Billed To:</h3>
            <p className="text-sm text-gray-700">
              Walk-in
            </p>
          </div>
          <div className="flex-1 text-center min-h-[40px]">
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Invoice Date:</h3>
            <p className="text-sm text-gray-700">{date}</p>
          </div>
          <div className="flex-1 text-right min-h-[40px]">
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Time:</h3>
            <p className="text-sm text-gray-700">{time}</p>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-sm font-semibold text-gray-600 mt-2">Invoice No:{invoicenum?.toString()}</h3>
        </div>

        {/* Table Header */}
        <div className="border-t border-b border-gray-400 font-semibold text-sm text-gray-600 grid grid-cols-6">
          <div className="col-span-3">Item</div>
          <div className="text-center">Qty</div>
          <div className="text-right">Rate</div>
          <div className="text-right col-end-7">Amt.</div>
        </div>

        {/* Line Items */}
        <div className="text-sm text-gray-700">
          {pr_lines.length>0?pr_lines.map((prline)=>(
            <div className="grid grid-cols-6" key={prline.productId}>
              <div className="col-span-3">{products.find(product=> product.id == prline.productId)?.name}</div>
              <div className="text-center">{prline.quantity.toString()}</div>
              <div className="text-right">{products.find(product=> product.id == prline.productId)?.unitPrice}</div>
              <div className="text-right col-end-7">{prline.quantity*products.find(product=> product.id == prline.productId)!.unitPrice}</div>
            </div>
          )):<div className="text-center">No items added yet.</div>}
        </div>
        {/* Totals */}
        <div className="mt-6 text-sm text-gray-800">
          <div className="flex justify-end">
            <div className="w-1/2">
              <div className="flex justify-between py-1">
                <span>Subtotal</span>
                <span>{pr_lines.reduce((sum,pr_line)=> sum + products.find(product=> product.id == pr_line.productId)!.unitPrice*pr_line.quantity, 0)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Off.</span>
                <span>{isNaN(discount)?0:discount}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 py-2 border-t border-gray-500">
                <span>Total</span>
                <span>Rs. {(pr_lines.reduce((sum,pr_line)=> sum + products.find(product=> product.id == pr_line.productId)!.unitPrice*pr_line.quantity, 0)-discount).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          Thank you for your purchase! For questions or future orders, contact us via phone or WhatsApp {shopcontact}.
        </div>
      </div>
      <div className="w-full h-[40px] mt-2 inline-grid grid-cols-2 gap-4">
        <Button
          className="bg-green-500 text-white rounded"
          onClick={completeSale}
          disabled={isBtnVisible}
        >
          Sale
        </Button>
        <Button
          onClick={handlePrint}
          className="bg-blue-600 text-white rounded gap-4"
        >
          <Printer/> Print Invoice
        </Button>
      </div>            
    </div>
  )
}