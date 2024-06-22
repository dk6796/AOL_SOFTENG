import '../../style/voucher-page.css'
import NavBar from '../../components/navbar'
import { useState, useEffect } from 'react';
import ErrorMessage from '../../components/errorMessage'
import useUser from '../../context/userContext';
import useVoucher from '../../context/voucherContext';
import { IVoucher } from '../../interfaces/voucherInterface';

export default function VoucherPage(){

     const userContext = useUser();
     const voucherContext = useVoucher();

     const { fetchUser } = userContext;
     const { readVoucher } = voucherContext;

     const [currType, setCurrType] = useState<string>("semua");
     const [voucherList, setVoucherList] = useState<IVoucher[]>([]);
     const [filteredVoucherList, setFilteredVoucherList] = useState<IVoucher[]>([]);
     const [openConfirm, setOpenConfirm] = useState<boolean>(false);
     const [openAnimation, setOpenAnimation] = useState<string>("");
     const [voucherName, setVoucherName] = useState<string>("");

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
          setVoucherName(voucher.VoucherName ?? "");
     }

     const closeConfirmartion = () => {
          setOpenAnimation("down");
          setTimeout(() => {
               setOpenAnimation("");
               setOpenConfirm(false); 
          }, 400); 
     }

     return (
          <div id="voucher-main-container">
               {/* <ErrorMessage/> */}
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
                              <div id="exchange-confirm-desc">Anda yakin ingin menukarkan koin Anda dengan <b>{voucherName}</b> ?</div>
                              <div id="confirmation-bttn-container">
                                   <div id="yakin-bttn" >Yakin</div>
                                   <div id="tidak-bttn" onClick={closeConfirmartion}>Tidak</div>
                              </div>
                         </div> 
                    </div>
               )}             
          </div>
     )
}