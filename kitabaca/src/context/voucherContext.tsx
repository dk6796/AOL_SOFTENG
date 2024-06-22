import { useState, useContext, createContext } from "react";
import axios from "axios";
import { IVoucher } from "../interfaces/voucherInterface";
import { IExchangeVoucher } from "../interfaces/exchangeVoucherInterface";
import { IChildren } from "../interfaces/childrenInterface";

interface IVoucherContext {
     voucherUpload: (voucher: IVoucher) => Promise<string>;
     readVoucher: () => Promise<[]>;
     exchangeVoucherUpload: (exchange: IExchangeVoucher) => Promise<string>;
     readExchangeVoucher: (id: number) => Promise<[]>;
     updateStock: (id: number, totalStock: number) => Promise<string>;
}

const context = createContext<IVoucherContext>({} as IVoucherContext)

export function VoucherProvider({ children }: IChildren) {

     const voucherUpload = async (voucher: IVoucher) => {
       console.log("VOUCHER: ", voucher);
       
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

     const exchangeVoucherUpload = async (exchange: IExchangeVoucher) => {
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

     const updateStock = async (id: number, totalStock: number) => {
      try {
        console.log("TOTAL SINI : ", totalStock);
        
          const response = await axios.put(
             `${import.meta.env.VITE_APP_BACKEND_URL}/updateStock/${id}`,{
              TotalCoin: totalStock,
             }
          );
          return response.data.message;
       } catch (err) {
          console.error('Error updating banned: ', err);
          return err.response.data.error;
       }
    }

     const data: IVoucherContext = {
          voucherUpload,
          readVoucher,
          exchangeVoucherUpload,
          readExchangeVoucher,
          updateStock
     };
   
     return <context.Provider value={data}>{children}</context.Provider>;
   }
   
   export default function useVoucher() {
     return useContext(context);
   }
   