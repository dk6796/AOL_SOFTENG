import '../../style/profile-page.css'
import { useState, useEffect   } from 'react';
import useBook from "../../context/bookContext";
import useUser from '../../context/userContext';
import useVoucher from '../../context/voucherContext';
import { IBook } from '../../interfaces/bookInterface';
import { IVoucher } from '../../interfaces/voucherInterface';
import { IExchangeVoucer } from '../../interfaces/exchangeVoucherInterface';
import { storage } from '../../storage/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ErrorMessage from '../../components/errorMessage';
import { IQuestion } from '../../interfaces/questionInterface';
import { IOption } from '../../interfaces/optionInterface';
import { IError } from '../../interfaces/errorInterface';


export default function ProfilePage(){
     const bookContext = useBook();
     const userContext = useUser();
     const voucherContext = useVoucher();

     const { bookUpload, readBook, addQuestion, addOption, readQuestion, readOption } = bookContext
     const { user, fetchUser, logout, errorMessageHandler } = userContext;
     const { voucherUpload, readVoucher } = voucherContext;

     const [menuAdmin, setMenuAdmin] = useState<string>("book");
     const [image, setImage] = useState<File | null>(null);
     const [voucher, setVoucher] = useState<File | null>(null);
     const [urlPhoto, setUrlPhoto] = useState<string>("");
     const [urlImg, setUrlImg] = useState<string>("");
     const [file, setFile] = useState<File | null>(null);
     const [bookCategory, setBookCategory] = useState<string>("");

     const [bookList, setBookList] = useState<IBook[]>([]);

     const [bookDetailAnimation, setBookDetailAnimation] = useState<string>("");
     const [isOpenBookDetail, setIsOpenBookDetail] = useState<boolean>(false);
     const [bookDetail, setBookDetail] = useState<IBook>();

     const [addQuestionAnimation, setAddQuestionAnimation] = useState<string>("");
     const [isOpenAddQuestion, setIsOpenAddQuestion] = useState<boolean>(false);

     const [questionList, setQuestionList] = useState<IQuestion[]>([]);
     const [optionList, setOptionList] = useState<IOption[]>([]);

     const [voucherList, setVoucherList] = useState<IVoucher[]>([]);

     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target.files) {
              setFile(e.target.files[0]);
          }
     };

     const openBookDetail = (book: IBook) => {
          setIsOpenBookDetail(true);
          setBookDetail(book);
     }

     const closeBookDetail = () => {
          setBookDetailAnimation("down");
          setTimeout(() => {
               setBookDetailAnimation("up");
               setIsOpenBookDetail(false); 
          }, 400); 
     }

     const openAddQuestion = () => {
          closeBookDetail();
          setTimeout(() => {
               setIsOpenAddQuestion(true); 
          }, 400); 
     }

     const closeAddQuestion = () => {
          setAddQuestionAnimation("down");
          setTimeout(() => {
               setAddQuestionAnimation("up");
               setIsOpenAddQuestion(false); 
               setIsOpenBookDetail(true);
          }, 400); 
     }

     const getBookList = async () => {
          const result = await readBook();
          setBookList(result);
     }

     const getVoucherList = async () => {
          const result = await readVoucher();
          setVoucherList(result)
     }

     const setToBook = () => {
          setMenuAdmin("book");
     }

     const setToVoucher = () => {
          setMenuAdmin("voucher");
     }
     
     const back = () => {
          window.history.back();
     }

     const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
          const selectedPhoto = e.target.files?.[0];
          if(selectedPhoto){
              const urlImage = URL.createObjectURL(selectedPhoto);
              setImage(selectedPhoto);
              setUrlPhoto(urlImage);
          }
     }

     const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
          const selectedPhoto = e.target.files?.[0];
          if(selectedPhoto){
              const urlImage = URL.createObjectURL(selectedPhoto);
              setVoucher(selectedPhoto);
              setUrlImg(urlImage);
          }
     }

     const saveToStorage = async (formData: IBook) => {
          const storageRef = ref(storage, `coverBook/${image?.name}_${formData.Title}`);
          if(image){
               await uploadBytes(storageRef, image);
               const downloadURL = await getDownloadURL(storageRef);
               console.log("url: "+downloadURL);
               formData.CoverBook = downloadURL;
          }
     }

     const saveImgToStorage = async (formData: IVoucher) => {
          const storageRef = ref(storage, `voucher/${image?.name}_${formData.VoucherName}`);
          if(image){
               await uploadBytes(storageRef, image);
               const downloadURL = await getDownloadURL(storageRef);
               console.log("url: "+downloadURL);
               formData.VoucherImage = downloadURL;
          }
     }

     const savePDFToStorage = async (formData: IBook) => {
          const storageRef = ref(storage, `filePDF/${formData.Title}`);
          if(file){
               await uploadBytes(storageRef, file);
               const downloadURL = await getDownloadURL(storageRef);
               console.log("url pdf: "+downloadURL);
               formData.FilePDF = downloadURL;
          }
     }

     const saveToDB = async (formData: IBook) => {
          await saveToStorage(formData);
          await savePDFToStorage(formData);
          if(formData.CoverBook != "" && formData.FilePDF != ""){
               console.log("cover: "+formData.CoverBook);
               console.log("pdf: "+formData.FilePDF);
               const response = await bookUpload(formData);
               if(response != "Successfully"){
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
                    getBookList();
               }
          }
          
     }

     const handleUploadBook = (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();

          const {bookTitle, author, publisher, totalPage, bookLevel, category, genre, synopsis, coverBook} = e.currentTarget;
          if(file){
               const formData: IBook = {
                    Title: bookTitle.value,
                    Author: author.value,
                    Publisher: publisher.value,
                    TotalPage: totalPage.value,
                    Synopsis: synopsis.value,
                    CoverBook: "",
                    Level: bookLevel.value,
                    Category: category.value,
                    Genre: genre.value,
                    FilePDF: "",
               }
               saveToDB(formData);
          }
     }

     const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
          const value = event.target.value;
          setBookCategory(value);
     };

     const addQuestionToDB = async (question: IQuestion) => {
          const response = await addQuestion(question);
          if(response.message != "Succesfull"){
               console.log(response);
               return;
          }
          return response.questionID;
     }

     const addOptionToDB = async (option: IOption) => {
          const response = await addOption(option);
          if(response != "Succesfull"){
               console.log(response);
               return false;
          }
          return true;
     }

     const addQuestionHandler = async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          const {question, opsi1, aopsi1, opsi2, aopsi2, opsi3, aopsi3, opsi4, aopsi4} = e.currentTarget;
          
          const q: IQuestion = {
               BookID: bookDetail?.BookID,
               QuizQuestion: question.value,
          }

          const id = await addQuestionToDB(q);
          if(id){
               const op1: IOption = {
                    QuestionID: id,
                    Option: opsi1.value,
                    IsAnswer: aopsi1.checked,
               }
               const o1 = await addOptionToDB(op1);
               const op2: IOption = {
                    QuestionID: id,
                    Option: opsi2.value,
                    IsAnswer: aopsi2.checked,
               }
               const o2 = await addOptionToDB(op2);
               const op3: IOption = {
                    QuestionID: id,
                    Option: opsi3.value,
                    IsAnswer: aopsi3.checked,
               }
               const o3 = await addOptionToDB(op3);
               const op4: IOption = {
                    QuestionID: id,
                    Option: opsi4.value,
                    IsAnswer: aopsi4.checked,
               }
               const o4 = await addOptionToDB(op4);
               if(o1 && o2 && o3 && o4){
                    closeAddQuestion();
                    getQuestionList();
                    getOptionList();
               }
          }

     }

     const getQuestionList = async () => {
          const response = await readQuestion();
          setQuestionList(response);
     }

     const getOptionList = async () => {
          const response = await readOption();
          setOptionList(response);
     }

     useEffect(() => {
          getBookList();
          getVoucherList();
          getQuestionList();
          getOptionList();
          fetchUser();
     }, []);

     return (
          <div id="profile-page-container">
               <div id="bttn-close-profile" onClick={back}></div>
               <ErrorMessage/>
               {user?.Role == "Admin" && (
                    <div id="book-bttn" onClick={setToBook}>Buku</div>
               )}
               {user?.Role == "Admin" && (
                    <div id="voucher-bttn" onClick={setToVoucher}>Voucher</div>
               )}
               {user?.Role == "user" && (
                    <div id="book-bttn">Profile</div>
               )}
               {user?.Role == "user" && (
                    <div id="voucher-bttn">History</div>
               )}
               <div id="logout-bttn" onClick={logout}>Log out</div>

               {user?.Role == "Admin" && menuAdmin == "book" && (
                    <div id="set-book-container">
                         <form action="" id="book-form-container" onSubmit={handleUploadBook}>
                              <label htmlFor="bookTitle">Judul</label>
                              <input type="text" name="bookTitle" id="bookTitle" />
                              <div className="book-component-container-1">
                                   <div className="book-component-container-2">
                                        <label htmlFor="author">Penulis</label>
                                        <input type="text" name="author" id="author" />
                                   </div>
                                   <div className="book-component-container-2">
                                        <label htmlFor="publisher">Penerbit</label>
                                        <input type="text" name="publisher" id="publisher" />
                                   </div>
                              </div>
                              <div className="book-component-container-3">
                                   <div className="book-component-container-2">
                                        <label htmlFor="totalPage">Total Halaman</label>
                                        <input type="number" name="totalPage" id="totalPage" />
                                   </div>
                                   <div className="book-component-container-2">
                                        <label htmlFor="bookLevel">Level</label>
                                        <input type="number" name="bookLevel" id="bookLevel" />
                                   </div>
                                   <div className="book-component-container-2">
                                        <label htmlFor="category">Kategori</label>
                                        <select name="category" id="category" onChange={handleSelectChange}>
                                             <option value=""></option>
                                             <option value="non-fiksi">Non-Fiksi</option>
                                             <option value="fiksi">Fiksi</option>
                                        </select>
                                   </div>
                                   {bookCategory == "fiksi" && (
                                        <div className="book-component-container-2">
                                             <label htmlFor="genre">Genre</label>
                                             <select name="genre" id="genre">
                                                  <option value=""></option>
                                                  <option value="romance">Romance</option>
                                                  <option value="horror">Horror</option>
                                                  <option value="fantasy">Fantasy</option>
                                                  <option value="sci-fi">Sci-fi</option>
                                                  <option value="mystery">Mystery</option>
                                             </select>
                                        </div>
                                   )}
                                   {bookCategory == "non-fiksi" && (
                                        <div className="book-component-container-2">
                                             <label htmlFor="genre">Genre</label>
                                             <select name="genre" id="genre">
                                                  <option value=""></option>
                                                  <option value="biography">Biography</option>
                                                  <option value="history">History</option>
                                                  <option value="science">Science</option>
                                                  <option value="philosophy">Philosophy</option>
                                                  <option value="economy">Economy</option>
                                             </select>
                                        </div>
                                   )}
                              </div>
                              <label htmlFor="filePDF">File Buku</label>
                              <input type="file" name="filePDF" id="filePDF" onChange={handleFileChange}/>
                              <label htmlFor="synopsis">Sinopsis</label>
                              <textarea name="synopsis" id="synopsis"></textarea>
                              <div id="coverbook-container">
                                   {urlPhoto != "" && (
                                        <img src={urlPhoto} alt="" id="coverBookPhoto"/>
                                   )}
                                   <div className="book-component-container-2">
                                        <label htmlFor="coverBook">Cover Buku</label>
                                        <input type="file" name="coverBook" id="coverBook" onChange={handlePhoto}/>
                                   </div>
                              </div>
                              <button type="submit" id="book-submit">Submit</button>
                         </form>
                    </div>
               )}
               {user?.Role == "Admin" && menuAdmin == "book" && (
                    <div id="list-book-container">
                         <h2>List of Book</h2>
                         <div id="list-book-container-2">
                              {bookList.map((b, idx) => (
                                   <div id="book-show-container" onClick={() => openBookDetail(b)}>
                                        <div>{idx+1} .</div>
                                        <img src={b.CoverBook} alt="" id="cover-book-img"/>
                                        <div id="book-show-description">
                                             <div>Judul : {b.Title}</div>
                                             <div>Penulis : {b.Author}</div>
                                             <div>Kategori : {b.Category}</div>
                                             <div>Genre : {b.Genre}</div>
                                             <div>Level : {b.Level}</div>
                                             <div></div>
                                        </div>
                                        <div id="edit-bttn-container">
                                             <h3 id="edit-book-bttn">Edit</h3>
                                             <h3 id="delete-book-bttn">Hapus</h3>
                                        </div>
                                   </div>
                              ))}
                         </div>
                    </div>
               )}
               {user?.Role == "Admin" && menuAdmin == "voucher" && (
                    <div id="set-voucher-container">
                         <form action="" id="book-form-container" onSubmit={handleUploadBook}>
                              <label htmlFor="voucherName">Nama Voucher</label>
                              <input type="text" name="voucherName" id="voucherName" />
                              <div className="book-component-container-1">
                                   <div className="book-component-container-2">
                                        <label htmlFor="voucherCost">Harga Voucher</label>
                                        <input type="number" name="voucherCost" id="voucherCost" />
                                   </div>
                                   <div className="book-component-container-2">
                                        <label htmlFor="voucherStock">Stok Voucher</label>
                                        <input type="number" name="voucherStock" id="voucherStock" />
                                   </div>
                              </div>
                              <div className="book-component-container-2">
                                   <label htmlFor="voucherType">Tipe Voucher</label>
                                   <select name="voucherType" id="voucherType">
                                        <option value=""></option>
                                        <option value="makanan">Makanan</option>
                                        <option value="minuman">Minuman</option>
                                        <option value="buku">Buku</option>
                                        <option value="lainnya">Lainnya</option>
                                   </select>
                              </div>
                              <label htmlFor="voucherDesc">Deskripsi Voucher</label>
                              <textarea name="voucherDesc" id="voucherDesc"></textarea>
                              <div id="voucherimg-container">
                                   {urlImg != "" && (
                                        <img src={urlImg} alt="" id="voucherImgPhoto"/>
                                   )}
                                   <div className="book-component-container-2">
                                        <label htmlFor="voucherImg">Gambar Voucher</label>
                                        <input type="file" name="voucherImg" id="voucherImg" onChange={handleImage}/>
                                   </div>
                              </div>
                              <button type="submit" id="voucher-submit">Submit</button>
                         </form>
                    </div>
               )}
               {isOpenBookDetail && (
                    <div id="book-detail-background">
                         <div className={`book-detail-container ${bookDetailAnimation}`}>
                              <div id="bttn-close-book-detail" onClick={closeBookDetail}></div>
                              <h2>{bookDetail?.Title}</h2>
                              <div id="book-detail-information">
                                   <div><b>Penulis :</b> {bookDetail?.Author}</div>
                                   <div><b>Jumlah halaman :</b> {bookDetail?.TotalPage}</div>
                                   <div><b>Sinopsis :</b> </div>
                                   <div>{bookDetail?.Synopsis}</div>
                                   <div id="question-list-container">
                                        <div id="question-list-header">
                                             <div><b>Daftar pertanyaan :</b></div>
                                             <div id="add-question" onClick={openAddQuestion}>Tambah Pertanyaan</div>
                                        </div>
                                        <div id="question-list">
                                             {questionList.filter(book => book.BookID == bookDetail?.BookID).map((q, idx) => (
                                                  <div id="question-body">
                                                       <div key={idx}>{idx+1}. {q.QuizQuestion}</div>
                                                       <div id="option-list">
                                                            {optionList.filter(option => option.QuestionID == q.QuestionID).map((o, idx) => (
                                                                 <div>- {o.Option} {o.IsAnswer == true ? " : kunci jawaban" : ""}</div>
                                                            ))}
                                                       </div>
                                                  </div>
                                             ))}
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>
               )}
               {isOpenAddQuestion && (
                    <div id="book-detail-background">
                         <div className={`add-question-container ${addQuestionAnimation}`}>
                              <div id="bttn-close-book-detail" onClick={closeAddQuestion}></div>
                              <h2>Tambah Pertanyaan</h2>
                              <form action="" id="add-question-form" onSubmit={addQuestionHandler}>
                                   <label htmlFor="question">Pertanyaan : </label>
                                   <input type="text" name="question" id="question" />
                                   <label htmlFor="daftar-opsi">Daftar opsi : </label>
                                   <div className="add-opsi-container">
                                        <label htmlFor="opsi1">Opsi 1 : </label>
                                        <div className="answer-radio-container">
                                             <input type="radio" name="answer" id="aopsi1" />
                                             <label htmlFor="answer">kunci jawaban</label>
                                        </div>
                                   </div>
                                   <input type="text" name="opsi1" id="opsi1" />
                                   <div className="add-opsi-container">
                                        <label htmlFor="opsi2">Opsi 2 : </label>
                                        <div className="answer-radio-container">
                                             <input type="radio" name="answer" id="aopsi2" />
                                             <label htmlFor="answer">kunci jawaban</label>
                                        </div>
                                   </div>
                                   <input type="text" name="opsi2" id="opsi2" />
                                   <div className="add-opsi-container">
                                        <label htmlFor="opsi3">Opsi 3 : </label>
                                        <div className="answer-radio-container">
                                             <input type="radio" name="answer" id="aopsi3" />
                                             <label htmlFor="answer">kunci jawaban</label>
                                        </div>
                                   </div>
                                   <input type="text" name="opsi3" id="opsi3" />
                                   <div className="add-opsi-container">
                                        <label htmlFor="opsi1">Opsi 4 : </label>
                                        <div className="answer-radio-container">
                                             <input type="radio" name="answer" id="aopsi4" />
                                             <label htmlFor="answer">kunci jawaban</label>
                                        </div>
                                   </div>
                                   <input type="text" name="opsi4" id="opsi4" />
                                   <div id="submit-add-question-container">
                                        <button type="submit">Submit</button>
                                   </div>
                              </form>
                         </div>
                    </div>
               )}
          </div>
     )
}