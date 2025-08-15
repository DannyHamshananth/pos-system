import { Fragment } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption
} from "@/components/ui/table";

import { format, set } from "date-fns";

export function ResponsiveDataTable({ data }: { data: any[] }) {
    return (
        <>
            {/* Desktop Table */}
            <div className="hidden md:block">
                <div className="w-full overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Invoice #</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>ItemsxQuantity</TableHead>
                                <TableHead>Sub Total</TableHead>
                                <TableHead>Off./Discount</TableHead>
                                <TableHead>Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((sale, index) => (
                                <TableRow key={index}>
                                    <TableCell>{sale.id}</TableCell>
                                    <TableCell>{sale.invoicenum}</TableCell>
                                    <TableCell>{format(new Date(sale.saleDate), "yyyy-MMM-dd")}</TableCell>
                                    <TableCell>{format(new Date(sale.saleDate), "hh:mma")}</TableCell>
                                    <TableCell>{sale.saleLine.map((line: any, index: any)=>(
                                        <div>{line.name + '('+ line.unitPrice +')'+ 'x' + line.quantity + '=' + line.quantity*line.unitPrice}</div>
                                    ))}
                                    </TableCell>
                                    <TableCell>{sale.subTotal}</TableCell>
                                    <TableCell>{sale.discount}</TableCell>
                                    <TableCell>{sale.total}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="block md:hidden space-y-2">
                {data.map((sale, index) => (
                    <div
                        key={index}
                        className="p-4 border rounded-lg shadow-sm bg-white"
                    >
                        <div className="flex justify-between">
                            <div>
                                <div className="font-semibold text-xs">Invoice:</div>
                                <div className="text-xs">{sale.id +'-'+sale.invoicenum}</div>
                                <div className="text-xs text-gray-600">Date:</div>
                                <div className="text-xs text-gray-600">{format(new Date(sale.saleDate), "yyyy-MMM-dd")}</div>
                                <div className="text-xs text-gray-600">Time:</div>
                                <div className="text-xs text-gray-600">{format(new Date(sale.saleDate), "hh:mma")}</div>
                            </div>
                            <div className="text-right">
                                <Table>
                                    <TableBody className="text-sm">
                                        {sale.saleLine.map((line: any, index: any)=> (
                                            <TableRow>
                                                <TableCell className="p-0 text-xs">{line.name + 'x' + line.quantity+':'}</TableCell>
                                                <TableCell className="p-0">{line.quantity*line.unitPrice}</TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow>
                                            <TableCell className="p-0">Sub Total:</TableCell>
                                            <TableCell className="p-0">{sale.subTotal}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="p-0">Off./Discount:</TableCell>
                                            <TableCell className="p-0">{sale.discount}</TableCell>
                                        </TableRow>
                                        <TableRow className="font-bold">
                                            <TableCell className="p-0">Net Total:</TableCell>
                                            <TableCell className="p-0">{sale.total}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
