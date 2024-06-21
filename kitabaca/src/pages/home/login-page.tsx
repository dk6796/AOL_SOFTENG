import '../../style/login-page.css'
import { useNavigate } from 'react-router-dom';
import useUser from "../../context/userContext"
import { useState, useEffect } from 'react';
import ErrorMessage from '../../components/errorMessage';
import { IError } from '../../interfaces/errorInterface';

export default function LoginPage(){
     const navigate = useNavigate();
     const userContext = useUser();

     const { checkUser, login, errorMessageHandler } = userContext;

     useEffect(() => {
          if (checkUser()) {
               window.history.back();
               const err: IError = {
                    ErrorMessage: "Anda sudah login !",
                    ErrorType: "Authentication",
               }
               errorMessageHandler(err);
          }
      }, [checkUser]);

     const handleIsClose = () => {
          navigate("/");
     }

     const handleToRegister = () => {
          navigate("/RegisterPage");
     }

     const userLogin = async (email: string, password: string) => {
          const response = await login(email, password);
          if(response != ""){
               const err: IError = {
                    ErrorMessage: response,
                    ErrorType: "Error",
               }
               errorMessageHandler(err);
               // setTimeout(() => {
               //      setErrorMsg("");
               // }, 7600);
          }
          else{
               const err: IError = {
                    ErrorMessage: "",
                    ErrorType: "",
               }
               errorMessageHandler(err);
               navigate("/");
          }
      }

     const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();

          const {email, pass} = e.currentTarget;
          console.log(email.value);
          userLogin(email.value, pass.value);

     }

     

     return (
          <div id="login-page-main-container">
               {/* <ErrorMessage/> */}

               <div id="selotip-div"></div>
               <div id="login-page-container">
                    <h1>Login</h1>
                    <div id="x-login" onClick={handleIsClose}></div>
                    <form action="" id="login-form" onSubmit={handleLogin}>
                         <label htmlFor="email">Email</label>
                         <input type="email" name="email" id="email" />
                         <label htmlFor="pass">Password</label>
                         <input type="password" name="pass" id="pass" />
                         <button type="submit" id="login-submit-bttn">Lanjutkan</button>
                    </form>
                    <div id="login-desc-container">
                         <hr/>
                         <div id="login-desc">atau login/buat akun dengan</div>
                         <hr/>
                    </div>
                    <div id="login-else-button-container">
                         <div id="otp-bttn">Login dengan OTP</div>
                         <div id="register-bttn" onClick={handleToRegister}>Buat Akun</div>
                         <div id="forgot-pswd-bttn">Lupa Password ?</div>
                    </div>
               </div>
          </div>
     )
}