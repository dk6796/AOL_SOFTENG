import '../style/navbar.css'
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useUser from "../context/userContext"

interface NavBarProps {
     menu: string;
}

export default function NavBar({ menu }: NavBarProps){
     const navigate = useNavigate();

     const toLogin = () => {
          navigate('/LoginPage');
     }

     const toProfilePage = () => {
          navigate('/ProfilePage');
          // setAnimateBoongan("background-boongan");
          // setTimeout(() => {
          //      setAnimateBoongan("");
          //      navigate('/ProfilePage');
          // }, 2000); 
     }

     const [isHover, setIsHover] = useState<boolean>(false);
     const [animateBoongan, setAnimateBoongan] = useState<string>("");

     const userContext = useUser();
     const { user } = userContext;
     

     const handleHover = () => {
          setIsHover(!isHover);
     }

     
     return(
          <div id="header-container">
               {/* <div id={animateBoongan}></div> */}
               <div id="navbar-main-container">
                    <div id="navbar">
                         <div className={menu == 'home' ? 'active':'navbar-menu'}>
                              <Link to={'/'} className={menu == 'home' ? 'link-active':'navbar-link'}>Menu Utama</Link>
                         </div>
                         <div className={menu == 'tantangan' ? 'active':'navbar-menu'}>
                              <Link to={'/TantanganPage'} className={menu == 'tantangan' ? 'link-active':'navbar-link'}>Tantangan</Link>
                         </div>
                         <div className={menu == 'voucher' ? 'active':'navbar-menu'}>
                              <Link to={'/VoucherPage'} className={menu == 'voucher' ? 'link-active':'navbar-link'}>Voucher</Link>
                         </div>
                    </div>
                    {!user && (
                         <div id="login-bttn" onClick={toLogin}>Login</div>
                    )}               
                    {user && user.Role != "Admin" && (
                         <div id="user-login-container">
                              <div id="user-detail-container">
                                   <div id="total-coin-container">
                                        <div id="coin"></div>
                                        <div id="total-coin">{user?.TotalCoin}</div>
                                   </div>
                                   <div id="level">Level {user?.Level}</div>
                              </div>
                              <img src={user?.ProfilePict} alt="" id="profile-pict-user" onMouseEnter={handleHover} onMouseLeave={handleHover} onClick={toProfilePage}/>
                         </div>
                    )}
                    {user && user.Role == "Admin" && (
                         <div id="admin-bttn" onClick={toProfilePage}>Admin</div>
                    )}
                    {isHover && (
                         <div id="profile-desc">User Profile</div>
                    )}
               </div>
               {menu == "home" && (
                    <div className="header-main-container">
                         <div id="logo-header-home"></div>
                         <div className="header-title">
                              <div id="header-home1"></div>
                              <div id="header-home2"></div>
                              <div id="img-home1"></div>
                              <div id="img-home2"></div>
                         </div>
                    </div>
               )}
               {menu == "tantangan" && (
                    <div className="header-main-container">
                         <div id="logo-header-tantangan"></div>
                         <div className="header-title">
                              <div id="header-tantangan"></div>
                              {/* <div id="img-tantangan1"></div> */}
                              {/* <div id="img-tantangan2"></div> */}
                         </div>
                    </div>
               )}
               {menu == "voucher" && (
                    <div className="header-main-container">
                         <div id="logo-header-voucher"></div>
                         <div className="header-title">
                              <div id="header-voucher"></div>
                              {/* <div id="img-voucher1"></div>
                              <div id="img-voucher2"></div> */}
                         </div>
                    </div>
               )}
               <div id="user-profile-container">
                    
               </div>
          </div>
     )
}