import "../style/errorMessage.css";
import { useState, useEffect } from "react";
import useUser from "../context/userContext";
import { IError } from "../interfaces/errorInterface";

export default function ErrorMessage() {
  const [messageAnimation, setMessageAnimation] = useState<string>("slide-in");

  const userContext = useUser();
  const { errorMessage, errorMessageHandler } = userContext;

  useEffect(() => {
     let slideOutTimer: NodeJS.Timeout;
     let clearMsgTimer: NodeJS.Timeout;

     const storedErrorMessage = localStorage.getItem("errorMessage");

    if (!errorMessage && storedErrorMessage) {
          errorMessageHandler(JSON.parse(storedErrorMessage) as IError);
    }

     if (errorMessage != null) {
          setMessageAnimation("slide-in");
          slideOutTimer = setTimeout(() => {
            setMessageAnimation("slide-out");
            clearMsgTimer = setTimeout(() => {
               const err: IError = {
                    ErrorMessage: "",
                    ErrorType: "",
               }
               errorMessageHandler(err);
               localStorage.removeItem("errorMessage");
            }, 500);
          }, 7500);
     }
    
        return () => {
          clearTimeout(slideOutTimer);
          clearTimeout(clearMsgTimer);
        };
  }, [errorMessage, errorMessageHandler]);

  return (
    <div>
      {errorMessage != null && errorMessage.ErrorMessage != "" && (
        <div className={`error-message-container ${messageAnimation}`}>
          <h4>{errorMessage?.ErrorType} : </h4>
          <div>{errorMessage?.ErrorMessage}</div>
        </div>
      )}
    </div>
  );
}
