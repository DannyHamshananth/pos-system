export class Sale {
    id: number;
    invoicenum: number;
    subTotal: number;
    saleDate: Date;
    discount: number;
    total: number;
    saleLine?: any[];

    constructor(
        id: number,
        invoicenum: number,
        subTotal: number,
        saleDate: Date,
        discount: number,
        total: number,
        saleLine?: any[]
    ) {
        this.id = id;
        this.invoicenum = invoicenum;
        this.subTotal = subTotal;
        this.saleDate = saleDate;
        this.discount = discount;
        this.total = total;
        this.saleLine = saleLine;
    }

    static getTotal(sales: Sale[],param: keyof Pick<Sale, 'subTotal' | 'total' | 'discount'>):number{
        return sales.reduce((acc, sale) => acc + sale[param], 0);
    }
}