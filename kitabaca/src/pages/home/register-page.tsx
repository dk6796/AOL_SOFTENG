import '../../style/register-page.css'
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import * as React from 'react';
import { IUser } from "../../interfaces/userInterface";
import { storage } from '../../storage/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import useUser from "../../context/userContext"
import ErrorMessage from '../../components/errorMessage';
import { IError } from '../../interfaces/errorInterface';

export default function RegisterPage(){

     const [image, setImage] = useState<File | null>(null);
     const [urlPhoto, setUrlPhoto] = useState<string>("");
     const [bookCategory, setCategoryBook] = useState<string>("");
     const userContext = useUser();
     const navigate = useNavigate();

     const { checkUser, register, errorMessage, errorMessageHandler } = userContext;

     useEffect(() => {
          if (checkUser()) {
               const err: IError = {
                    ErrorMessage: "Anda sudah login !",
                    ErrorType: "Authentication",
               }
               errorMessageHandler(err);
               window.history.back();
          }
      }, [checkUser]);

     const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
          const selectedPhoto = e.target.files?.[0];
          if(selectedPhoto){
              const urlImage = URL.createObjectURL(selectedPhoto);
              setImage(selectedPhoto);
              setUrlPhoto(urlImage);
          }
     }

     const saveToStorage = async (formData: IUser) => {
          const storageRef = ref(storage, `profile/${image?.name}_${formData.FullName}`);
          if(image){
               await uploadBytes(storageRef, image);
               const downloadURL = await getDownloadURL(storageRef);
               formData.ProfilePict = downloadURL;
          }
     }

     const saveToDB = async (formData: IUser) => {
          await saveToStorage(formData);
          const response = await register(formData);
          if(response != "Succesfull"){
               const err: IError = {
                    ErrorMessage: response,
                    ErrorType: "Error",
               }
               errorMessageHandler(err);
          }
          else{
               const err: IError = {
                    ErrorMessage: "",
                    ErrorType: "",
               }
               errorMessageHandler(err);
               navigate("/LoginPage");
          }
     }

     const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();

          const {nama, dob, emailr, passr, confirm, profile} = e.currentTarget;
          setImage(profile.value);

          const formData: IUser = {
               FullName: nama.value,
               DOB: dob.value,
               Email: emailr.value,
               Password: passr.value,
               ConfirmPassword: confirm.value,
               ProfilePict: "",
               TotalCoin: 0,
               Level: 1,
               Role: "user",
               SavePage: 0,
               SaveBookID: 0,
               BookCategory: "",
          }

          console.log(formData);

          saveToDB(formData);

     }


     return(
          <div id="register-page-main-container">
               <div id="selotip-div1"></div>
               <div id="selotip-div2"></div>
               <ErrorMessage/>
               {/* <div id="scrapbook-5"></div> */}
               <div id="scrapbook-1"></div>
               <div id="scrapbook-2"></div>
               <div id="scrapbook-3"></div>
               <div id="scrapbook-4"></div>
               <div id="register-page-container">
                    <h1>Register</h1>
                    <form action="" id="register-form" onSubmit={handleRegister}>
                         <div className="form-container">
                              <div className="form-detail-container">
                                   <label htmlFor="nama">Nama Lengkap</label>
                                   <input type="text" name="nama" id="nama" placeholder="Masukkan nama lengkap" className="inputted"/>
                              </div>
                         </div>
                         <div className="form-container">
                              <div className="form-detail-container">
                                   <label htmlFor="dob">Tanggal Lahir</label>
                                   <input type="date" name="dob" id="dob" className="inputted"/>
                              </div>
                              <div className="form-detail-container">
                                   <label htmlFor="emailr">Email</label>
                                   <input type="email" name="emailr" id="emailr" placeholder="Masukkan email" className="inputted"/>
                              </div>
                         </div>
                         <div className="form-container">
                              <div className="form-detail-container">
                                   <label htmlFor="passr">Password</label>
                                   <input type="password" name="passr" id="passr" placeholder="Masukkan password" className="inputted"/>
                              </div>
                              <div className="form-detail-container">
                                   <label htmlFor="confirm">Confirm Password</label>
                                   <input type="password" name="confirm" id="confirm" placeholder="Masukkan password lagi" className="inputted"/>
                              </div>
                         </div>
                         <div id="form-container2">
                              <div id="img-container">
                                   {urlPhoto != "" && (
                                        <img src={urlPhoto} alt="" id="img-profile"/>
                                   )}
                                   <div className="form-detail-container">
                                        <label htmlFor="profile">Image Profile</label>
                                        <input type="file" name="profile" id="profile" onChange={handlePhoto}/>
                                   </div>
                              </div>
                              {/* <div className="error-line">Testing</div> */}
                         </div>
                         <div className="form-detail-container2">
                              <button type="submit" id="register-form-bttn">Register</button>
                              <div id="to-login-container">
                                   <div id="login-desc">Sudah daftar akun?</div>
                                   <Link to="/LoginPage" id="login-link">Login</Link>
                              </div>
                         </div>
                    </form>
               </div>
          </div>
     )
}