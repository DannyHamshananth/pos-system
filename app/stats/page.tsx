"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sale } from "@/lib/sale";
import { format, set } from "date-fns";

import { ChevronDownIcon } from "lucide-react"

import { ResponsiveDataTable } from "@/components/ResponsiveDataTable"
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function StatsPage() {
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [startTime, setStartTime] = useState("00:00:00")
  const [endDateOpen, setEndDateOpen] = useState(false)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [endTime, setEndTime] = useState("00:00:00")
  const [sales, setSales] = useState<Sale[]>([]);

  const generateStas = async () => {

    const start_time = format(new Date(startDate!.toString()), "yyyy-MM-dd") + "T" + startTime + ".000Z"
    const end_time = format(new Date(endDate!.toString()), "yyyy-MM-dd") + "T" + endTime + ".000Z"
    console.log(start_time);
    console.log(end_time);

    const params = new URLSearchParams({
      start_time: start_time,
      end_time: end_time
    });
    fetch(`/api/sales?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then(data => {
        const cleanedSales = data.map((sale: any) => ({
          ...sale, // copy all original properties
          saleLine: sale.saleLine?.map((line: any) => ({
            // create new cleaned line object here
            name: line.product.name,
            unitPrice: line.product.unitPrice,
            quantity: line.quantity
          }))
        }));
        setSales(cleanedSales);
        console.log(cleanedSales);
      })
      .catch(error => {
        console.error("Fetch error:", error);
      });

  }

  useEffect(() => {
    setEndTime(format(new Date(), "HH:mm:ss"))
  }, []);

  return (
    <div className="px-10 py-4 sm:ml-10 space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold">📊 Custom Statistics</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <h2 className="text-sm font-bold">Start Day and Time</h2>
          <div>
            <Label htmlFor="date-picker" className="px-1">
              Date
            </Label>
            <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date-picker"
                  className="justify-between font-normal w-full"
                >
                  {startDate ? startDate.toLocaleDateString() : "Select date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setStartDate(date)
                    setStartDateOpen(false)
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="time-picker" className="px-1">
              Time
            </Label>
            <Input
              type="time"
              id="time-picker"
              step="1"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-bold">End Day and Time</h2>
          <div>
            <Label htmlFor="date-picker" className="px-1">
              Date
            </Label>
            <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date-picker"
                  className="justify-between font-normal w-full"
                >
                  {endDate ? endDate.toLocaleDateString() : "Select date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setEndDate(date)
                    setEndDateOpen(false)
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="time-picker" className="px-1">
              Time
            </Label>
            <Input
              type="time"
              id="time-picker"
              step="1"
              value={endTime}
              onChange={(e)=> setEndTime(e.target.value)}
              className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </div>
        </div>
      </div>

      <div className="text-center ">
        <Button onClick={generateStas}>Generate Detailed Report</Button>
      </div>

      {sales.length > 0 &&
        <div>
          {/* Stat Cards */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Net Sale</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{sales?Sale.getTotal(sales,"total"):""}Rs.</p>
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
                <p className="text-3xl font-bold">{Sale.getTotal(sales,"discount")}Rs.</p>
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
          <main className="mt-2">
            <ResponsiveDataTable data={sales} />
          </main>
        </div>
      }
    </div>
  );
}