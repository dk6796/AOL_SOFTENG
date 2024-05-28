import { useState, useContext, createContext, useEffect, useRef } from "react";
import axios from "axios";
import { IUser } from "../interfaces/userInterface";
import { IChildren } from "../interfaces/childrenInterface";
import { IError } from "../interfaces/errorInterface";
import * as CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import { IBookHistory } from "../interfaces/bookHistoryInterface";
import { IQuizResult } from "../interfaces/quizResultInterface"

interface IUserContext {
  user: IUser | null;
  errorMessage: IError | null;
  errorMessageHandler: (err: IError) => void;
  fetchUser: () => Promise<void>;
  checkUser: () => boolean;
  register: (user: IUser) => Promise<string>;
  login: (email: string, password: string) => Promise<string>;
  updateCategory: (id: number, category: string) => Promise<string>;
  updateReadBook: (id: number, page: number, bookID: number) => Promise<string>;
  updateCoin: (id: number, totalCoin: number) => Promise<string>;
  updateLevel: (id: number, level: number) => Promise<string>;
  saveHistoryBook: (history: IBookHistory) => Promise<any>;
  saveQuizResult: (result: IQuizResult) => Promise<string>;
  readHistoryBook: () => Promise<[]>;
  readQuizResult: () => Promise<[]>;
  getHistoryBookByID: (id: number) => Promise<IBookHistory[]>;
  getQuizResultByID: (id: number) => Promise<IQuizResult>;
  logout: () => void;
}

const context = createContext<IUserContext>({} as IUserContext);

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

const encryptData = (data: IUser) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

const decryptData = (ciphertext: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedData) {
      throw new Error("Decrypted data is empty");
    }

    return JSON.parse(decryptedData);
  } catch (error) {
    console.error("Error decrypting data:", error);
    return null;
  }
};

export function UserProvider({ children }: IChildren) {
  const navigate = useNavigate();

  const [user, setUser] = useState<IUser | null>(null);
  const [errorMessage, setErrorMessage] = useState<IError | null>(
    JSON.parse(localStorage.getItem("errorMessage") || 'null')
  );

  const errorMessageHandler = (err : IError) => {
    setErrorMessage(err);
    localStorage.setItem("errorMessage", JSON.stringify(err));
  }

  const fetchUser = async () => {
    try {
      const account = localStorage.getItem("userAccount");
      if (account) {
        const decryptedData = decryptData(account);
        const id = decryptedData.UserID;
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_APP_BACKEND_URL}/getUser`,
            {
              params: { id }
            }
          );
          setUser(response.data);
        } catch (err) {
          console.error("Error fetching user: ", err);
        }
      }
    } catch (error) {
      console.error("Error initializing user state:", error);
    }
  };

  const checkUser = () => {
    if(user){
      return true;
    }
    return false;
  }

  useEffect(() => {
    fetchUser();
  }, []);

  const register = async (user: IUser) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_APP_BACKEND_URL + "/register",
        user
      );
      return response.data.message;
    } catch (err) {
      console.log("INI ERROR : ", err.response.data.error);
      console.error("Error write data user: " + err);

      return err.response.data.error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_APP_BACKEND_URL + "/login",
        {
          email: email,
          password: password,
        },
        { withCredentials: true }
      );
      //     const token = response.data.token;
      const user = response.data.user;

      const encryptedData = encryptData(user);

      // localStorage.setItem("accessToken", token);
      localStorage.setItem("userAccount", encryptedData);
      setUser(user);
      return "";
    } catch (err) {
      console.error("Error write data user: " + err);
      return err.response.data.error;
    }
  };

  const logout = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_APP_BACKEND_URL}/logout/${user?.UserID}`,
        null,
        { withCredentials: true }
      );
      console.log("ini logout");
      localStorage.removeItem("userAccount");
      // removeCookie();
      navigate("/");
      setUser(null);
      console.log("ERROR MSG: ", response.data);

      return "";
    } catch (err) {
      console.error("Error write data user: " + err);
      return err.response.data.error;
    }
  };

  const updateCategory = async (id: number, category: string) => {
    try {
        const response = await axios.put(
           `${import.meta.env.VITE_APP_BACKEND_URL}/updateCategory/${id}`,{
            BookCategory: category,
           }
        );
        fetchUser();
        return response.data.message;
     } catch (err) {
        console.error('Error updating banned: ', err);
        return err.response.data.error;
     }
  } 

  const updateReadBook = async (id: number, page: number, bookID: number) => {
    try {
        const response = await axios.put(
           `${import.meta.env.VITE_APP_BACKEND_URL}/updateReadBook/${id}`,{
            SavePage: page,
            SaveBookID: bookID,
           }
        );
        fetchUser();
        return response.data.message;
     } catch (err) {
        console.error('Error updating banned: ', err);
        return err.response.data.error;
     }
  } 

  const updateCoin = async (id: number, totalCoin: number) => {
    try {
      console.log("TOTAL SINI : ", totalCoin);
      
        const response = await axios.put(
           `${import.meta.env.VITE_APP_BACKEND_URL}/updateCoin/${id}`,{
            TotalCoin: totalCoin,
           }
        );
        fetchUser();
        return response.data.message;
     } catch (err) {
        console.error('Error updating banned: ', err);
        return err.response.data.error;
     }
  }

  const updateLevel = async (id: number, level: number) => {
    try {
        const response = await axios.put(
           `${import.meta.env.VITE_APP_BACKEND_URL}/updateLevel/${id}`,{
            Level: level,
           }
        );
        fetchUser();
        return response.data.message;
     } catch (err) {
        console.error('Error updating banned: ', err);
        return err.response.data.error;
     }
  }
  
  const saveHistoryBook = async (history: IBookHistory) => {
    console.log("HISTORY 2 : ", history);
    
    try {
      const response = await axios.post(
        import.meta.env.VITE_APP_BACKEND_URL + "/addBookHistory",
        history
      );
      console.log("RESPONSE: ", response.data);
      
      return response.data;
    } catch (err) {
      console.log("INI ERROR : ", err.response.data.error);
      console.error("Error write data user: " + err);

      return err.response.data.error;
    }
  };

  const saveQuizResult = async (result: IQuizResult) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_APP_BACKEND_URL + "/addQuizResult",
        result
      );
      return response.data.message;
    } catch (err) {
      console.log("INI ERROR : ", err.response.data.error);
      console.error("Error write data user: " + err);

      return err.response.data.error;
    }
  };

  const readHistoryBook = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_APP_BACKEND_URL + "/getHistoryBook"
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching: ", err);
    }
  };

  const readQuizResult = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_APP_BACKEND_URL + "/getQuizResult"
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching: ", err);
    }
  };

  const getHistoryBookByID = async (id: number) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/getBookHistoryByID`,
        {
          params: { id },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching: ", err);
    }
  };

  const getQuizResultByID = async (id: number) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/getQuizResultByID`,
        {
          params: { id },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching: ", err);
    }
  };

  const data: IUserContext = {
    user,
    errorMessage,
    errorMessageHandler,
    fetchUser,
    checkUser,
    register,
    login,
    updateCategory,
    updateReadBook,
    updateCoin,
    updateLevel,
    saveHistoryBook,
    saveQuizResult,
    readHistoryBook,
    readQuizResult,
    getHistoryBookByID,
    getQuizResultByID,
    logout,
  };

  return <context.Provider value={data}>{children}</context.Provider>;
}

export default function useUser() {
  return useContext(context);
}
