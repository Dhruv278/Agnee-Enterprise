

export interface InvoiceType {
    isGST: boolean;
    createdAt: string;
    billNo:number;  // Use Date if you prefer working with Date objects
    _id: string;
    recipient: {
        recipientName: string;
        recipientPhone: number;
        recipientGSTNo: string;
        slug: string;
    };
    invoiceDate: string;  // Use Date if you prefer working with Date objects
    gst:{
        sgst:number,
        cgst:number,
    }
    products: {
        _id: string;
        name: string;
        quantity: string;
        price: number;
        total_amount: number;
    }[];
    final_amount: number;
    HSN: number;
    isPaid: boolean;
    totalBillAmmount: number;
    __v: number;
}

export interface Product {
    name: string;
    quantity: string;
    price: string;
  }
  
  export interface Recipient {
    recipientName: string;
    recipientPhone: string;
    recipientGSTNo: string;
  }
  