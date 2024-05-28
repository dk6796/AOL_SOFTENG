import { useState, useContext, createContext } from "react";
import axios from "axios";
import { IBook } from "../interfaces/bookInterface";
import { IChildren } from "../interfaces/childrenInterface";
import { IOption } from "../interfaces/optionInterface";
import { IQuestion } from "../interfaces/questionInterface";

interface IBookContext {
  bookUpload: (book: IBook) => Promise<string>;
  readBook: () => Promise<[]>;
  getBookByLevel: (level: number, category: string) => Promise<[]>;
  getBookByID: (id: number) => Promise<IBook>;
  addQuestion: (question: IQuestion) => Promise<any>;
  addOption: (option: IOption) => Promise<string>;
  readQuestion: () => Promise<[]>;
  readOption: () => Promise<[]>;
}

const context = createContext<IBookContext>({} as IBookContext);

export function BookProvider({ children }: IChildren) {
  const bookUpload = async (book: IBook) => {
    const formData = new FormData();
    console.log("masuk");
    console.log("PDFF : " + book.FilePDF);

    if (book.FilePDF) {
      formData.append("title", book.Title || "");
      formData.append("author", book.Author || "");
      formData.append("publisher", book.Publisher || "");
      formData.append("synopsis", book.Synopsis || "");
      formData.append("level", book.Level?.toString() || "");
      formData.append("totalPage", book.TotalPage?.toString() || "");
      formData.append("category", book.Category || "");
      formData.append("coverBook", book.CoverBook || "");
      formData.append("genre", book.Genre || "");
      formData.append("file", book.FilePDF || "");
    }
    try {
      const response = await axios.post(
        import.meta.env.VITE_APP_BACKEND_URL + "/uploadBook",
        formData
      );
      return response.data.message;
    } catch (err) {
      console.log("INI ERROR : ", err.response.data.error);
      console.error("Error upload book: " + err);

      return err.response.data.error;
    }
  };

  const readBook = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_APP_BACKEND_URL + "/readBook"
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching: ", err);
    }
  };

  const getBookByLevel = async (level: number, category: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/getBooks`,
        {
          params: { level, category },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching: ", err);
    }
  };

  const getBookByID = async (id: number) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/getBookByID`,
        {
          params: { id },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching: ", err);
    }
  };

  const addQuestion = async (question: IQuestion) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_APP_BACKEND_URL + "/addQuestion",
        question
      );
      return response.data;
    } catch (err) {
      console.log("INI ERROR : ", err.response.data.error);
      console.error("Error upload question: " + err);

      return err.response.data.error;
    }
  };

  const addOption = async (option: IOption) => {
    console.log("OPTION: ", option);
    
    try {
      const response = await axios.post(
        import.meta.env.VITE_APP_BACKEND_URL + "/addOption",
        option
      );
      return response.data.message;
    } catch (err) {
      console.log("INI ERROR : ", err.response.data.error);
      console.error("Error upload option: " + err);

      return err.response.data.error;
    }
  };

  const readQuestion = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_APP_BACKEND_URL + "/getQuestion"
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching: ", err);
    }
  };

  const readOption = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_APP_BACKEND_URL + "/getOption"
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching: ", err);
    }
  };

  const data: IBookContext = {
    bookUpload,
    readBook,
    getBookByLevel,
    getBookByID,
    addQuestion,
    addOption,
    readQuestion,
    readOption,
  };

  return <context.Provider value={data}>{children}</context.Provider>;
}

export default function useBook() {
  return useContext(context);
}
