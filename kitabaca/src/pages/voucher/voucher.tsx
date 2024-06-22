import '../../style/voucher-page.css'
import NavBar from '../../components/navbar'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../../components/errorMessage'
import useUser from '../../context/userContext';
import useVoucher from '../../context/voucherContext';
import { IVoucher } from '../../interfaces/voucherInterface';
import { IExchangeVoucher } from '../../interfaces/exchangeVoucherInterface';

export default function VoucherPage(){

     const userContext = useUser();
     const voucherContext = useVoucher();
     const navigate = useNavigate();

     const { user, fetchUser, updateCoin } = userContext;
     const { readVoucher, updateStock, exchangeVoucherUpload } = voucherContext;

     const [currType, setCurrType] = useState<string>("semua");
     const [voucherList, setVoucherList] = useState<IVoucher[]>([]);
     const [filteredVoucherList, setFilteredVoucherList] = useState<IVoucher[]>([]);
     const [openConfirm, setOpenConfirm] = useState<boolean>(false);
     const [openAnimation, setOpenAnimation] = useState<string>("");
     const [voucherDetail, setVoucherDetail] = useState<IVoucher>();
     const [successSave, setSuccessSave] = useState<boolean>(false);
     const [failedSave, setFailedSave] = useState<boolean>(false);

     const getVoucherList = async () => {
          const response = await readVoucher();
          setVoucherList(response);
          setFilteredVoucherList(response);
     }

     const filterVoucher = () => {
          if(currType != "semua"){
               const filter = voucherList.filter(v => v.VoucherType == currType);
               setFilteredVoucherList(filter);
          }
          else{
               setFilteredVoucherList(voucherList);
          }
     }

     useEffect(() => {
          fetchUser();
          getVoucherList();
     }, []);

     useEffect(() => {
          filterVoucher();
     }, [currType]);

     const chooseSemua = () => {
          setCurrType("semua");
     }

     const chooseMakanan = () => {
          setCurrType("makanan");
     }

     const chooseMinuman = () => {
          setCurrType("minuman");
     }

     const chooseBuku = () => {
          setCurrType("buku");
     }

     const chooseLainnya = () => {
          setCurrType("lainnya");
     }

     const openConfirmation = (voucher: IVoucher) => {
          setOpenConfirm(true);
          setVoucherDetail(voucher);
     }

     const closeConfirmartion = () => {
          setOpenAnimation("down");
          setTimeout(() => {
               setOpenAnimation("");
               setOpenConfirm(false); 
          }, 400); 
     }

     const updateCoinToDB = async (coin: number) => {
          const total_coin = (user?.TotalCoin ?? 0) - coin;
          console.log("TOTAL COIN SKRG: ", total_coin);
          
          const response = await updateCoin(user?.UserID ?? 0, total_coin);
          if(response != "Success"){
               console.log(response);
               return false;
          }
          return true;
     }

     const updateStockToDB = async () => {
          const total_stock = (voucherDetail?.VoucherStock ?? 0) - 1;
          console.log("TOTAL STOCK SKRG: ", total_stock);
          
          const response = await updateStock(voucherDetail?.VoucherID ?? 0, total_stock);
          if(response != "Success"){
               console.log(response);
               return false;
          }
          return true;
     }

     const saveExchangeToDB = async (exchange: IExchangeVoucher) => {
          const response = await exchangeVoucherUpload(exchange);
          if(response != "Succesfull"){
               console.log(response);
          }
          console.log("BERHASILLL");
          closeConfirmartion();
          setSuccessSave(true);
     }

     const addExchangeTransaction = async (id: number, coin: number) => {
          if(user){
               if((user?.TotalCoin ?? 0) >= coin){
                    const exchange: IExchangeVoucher = {
                         UserID: user?.UserID,
                         VoucherID: id,
                         ExchangeTime: new Date(),
                    }
          
                    if(await updateCoinToDB(coin) && await updateStockToDB()){
                         await saveExchangeToDB(exchange)
                    }
               }
               else{
                    closeConfirmartion();
                    setFailedSave(true);
               }
          }
          else{
               navigate('/LoginPage')
          }
     }

     const resetSuccessSave = () => {
          if(successSave){
               setTimeout(() => {
                    setSuccessSave(false);
               }, 4000);
          }
     }

     const resetFailedSave = () => {
          if(failedSave){
               setTimeout(() => {
                    setFailedSave(false);
               }, 4000);
          }
     }

     useEffect(() => {
          resetSuccessSave();
          resetFailedSave();
     }, [successSave, failedSave]);

     return (
          <div id="voucher-main-container">
               {user?.Role == "user" && (
                    <ErrorMessage/>
               )}
              <NavBar menu="voucher"/>
              <div id="type-filter-container">
                   <div className={currType == "semua" ?  `filter-voucher-selected` : `filter-voucher`} onClick={chooseSemua}>Semua</div>
                   <div className={currType == "makanan" ?  `filter-voucher-selected` : `filter-voucher`} onClick={chooseMakanan}>Makanan</div>
                   <div className={currType == "minuman" ?  `filter-voucher-selected` : `filter-voucher`} onClick={chooseMinuman}>Minuman</div>
                   <div className={currType == "buku" ?  `filter-voucher-selected` : `filter-voucher`} onClick={chooseBuku}>Buku</div>
                   <div className={currType == "lainnya" ?  `filter-voucher-selected` : `filter-voucher`} onClick={chooseLainnya}>Lainnya</div>
              </div>
              <div id="choose-voucher-container-all">
                    {filteredVoucherList.map((v, idx) => (
                         idx % 2 == 0 ? (
                              <div className="choose-voucher-container">
                                   <img src={v.VoucherImage} alt="" className="choose-voucher-img"/>
                                   <div className="choose-voucher-detail-container-1">
                                        <div className="choose-voucher-name">{v.VoucherName}</div>
                                        <div className="choose-voucher-desc-container-1">
                                             <div className="choose-voucher-desc">{v.VoucherDesc}</div>
                                             <div className="choose-voucher-action-container">
                                                  <div className="choose-voucher-coin-container">
                                                       <div className="choose-voucher-coin-img"></div>
                                                       <h2>{v.VoucherCost}</h2>
                                                  </div>
                                                  <div className="tukar-bttn-1" onClick={() => openConfirmation(v)}>Tukar</div>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         ) : (
                              <div className="choose-voucher-container">
                                   <div className="choose-voucher-detail-container-2">
                                        <div className="choose-voucher-name">{v.VoucherName}</div>
                                        <div className="choose-voucher-desc-container-2">
                                        <div className="choose-voucher-desc">{v.VoucherDesc}</div>
                                             <div className="choose-voucher-action-container">
                                                  <div className="tukar-bttn-2" onClick={() => openConfirmation(v)}>Tukar</div>
                                                  <div className="choose-voucher-coin-container">
                                                       <div className="choose-voucher-coin-img"></div>
                                                       <h2>{v.VoucherCost}</h2>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                                   <img src={v.VoucherImage} alt="" className="choose-voucher-img"/>
                              </div>
                         )
                    ))}
               </div>
               {openConfirm && (
                    <div id="confirmation-container-background">
                         <div className={`exchange-confirmation-container ${openAnimation}`}>
                              <h1>Konfirmasi</h1>
                              <div id="exchange-confirm-desc">Anda yakin ingin menukarkan koin Anda dengan <b>{voucherDetail?.VoucherName}</b> ?</div>
                              <div id="confirmation-bttn-container">
                                   <div id="yakin-bttn" onClick={() => addExchangeTransaction(voucherDetail?.VoucherID ?? 0, voucherDetail?.VoucherCost ?? 0)}>Yakin</div>
                                   <div id="tidak-bttn" onClick={closeConfirmartion}>Tidak</div>
                              </div>
                         </div> 
                    </div>
               )} 
               {failedSave && (
                    <div id="confirmation-container-background">
                         <div id="success-container">
                              <div id="failed-result"></div>
                              <h2>Gagal</h2>
                              <h4>Koin Anda tidak cukup</h4>
                         </div>
                    </div>
               )}
               {successSave && (
                    <div id="confirmation-container-background">
                         <div id="success-container">
                              <div id="success-result"></div>
                              <h2>Berhasil</h2>
                              <h4>silahkan cek voucher Anda di Profile Menu pada bagian History Penukaran</h4>
                         </div>
                    </div> 
               )}
                          
          </div>
     )
}