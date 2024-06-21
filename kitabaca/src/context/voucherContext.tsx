import { useState, useContext, createContext } from "react";
import axios from "axios";
import { IVoucher } from "../interfaces/voucherInterface";
import { IExchangeVoucer } from "../interfaces/exchangeVoucherInterface";
import { IChildren } from "../interfaces/childrenInterface";

interface IVoucherContext {
     voucherUpload: (voucher: IVoucher) => Promise<string>;
     readVoucher: () => Promise<[]>;
     exchangeVoucherUpload: (exchange: IExchangeVoucer) => Promise<string>;
     readExchangeVoucher: (id: number) => Promise<[]>;
}

const context = createContext<IVoucherContext>({} as IVoucherContext)

export function VoucherProvider({ children }: IChildren) {

     const voucherUpload = async (voucher: IVoucher) => {
          try {
            const response = await axios.post(
              import.meta.env.VITE_APP_BACKEND_URL + "/addVoucher",
              voucher
            );
            return response.data;
          } catch (err) {
            console.log("INI ERROR : ", err.response.data.error);
            console.error("Error upload question: " + err);
      
            return err.response.data.error;
          }
     };
   
     const readVoucher = async () => {
       try {
         const response = await axios.get(
           import.meta.env.VITE_APP_BACKEND_URL + "/getVoucher"
         );
         return response.data;
       } catch (err) {
         console.error("Error fetching: ", err);
       }
     };

     const exchangeVoucherUpload = async (exchange: IExchangeVoucer) => {
          try {
            const response = await axios.post(
              import.meta.env.VITE_APP_BACKEND_URL + "/addExchangeVoucher",
              exchange
            );
            return response.data;
          } catch (err) {
            console.log("INI ERROR : ", err.response.data.error);
            console.error("Error upload question: " + err);
      
            return err.response.data.error;
          }
     };
   
     const readExchangeVoucher = async (id: number) => {
       try {
         const response = await axios.get(
           `${import.meta.env.VITE_APP_BACKEND_URL}/getExchangeVoucher`,
           {
             params: { id },
           }
         );
         return response.data;
       } catch (err) {
         console.error("Error fetching: ", err);
       }
     };

     const data: IVoucherContext = {
          voucherUpload,
          readVoucher,
          exchangeVoucherUpload,
          readExchangeVoucher,
     };
   
     return <context.Provider value={data}>{children}</context.Provider>;
   }
   
   export default function useVoucher() {
     return useContext(context);
   }
   