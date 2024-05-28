import '../../style/tantangan-page.css'
import NavBar from '../../components/navbar'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useBook from '../../context/bookContext';
import useUser from '../../context/userContext';
import { IBook } from '../../interfaces/bookInterface';
import LoadingScreen from '../../components/loadingScreen';
import ErrorMessage from '../../components/errorMessage';
import { IBookHistory } from '../../interfaces/bookHistoryInterface';
import { format } from 'date-fns';
import { IQuizResult } from '../../interfaces/quizResultInterface';

export default function TantanganPage(){
     
     const [isCategoryActive, setIsCategoryActive] = useState<boolean>(false);
     const [categoryAnimation, setCategoryAnimation] = useState<string>("up");
     const [isBookSelectionActive, setIsBookSelectionActive] = useState<boolean>(false);
     const [idx, setIdx] = useState<number>(0);
     const [categoryBook, setCategoryBook] = useState<string>("");
     const [bookList, setBookList] = useState<IBook[]>([]);
     const [bookID, setBookID] = useState<number>(0);
     const [loading, setLoading] = useState<boolean>(false);
     const [isDonePage, setIsDonePage] = useState<boolean>(false);

     const [bookHistoryList, setBookHistoryList] = useState<IBookHistory[]>([]);
     const [bookHist, setBookHist] = useState<IBookHistory>();
     const [bookDetail, setBookDetail] = useState<IBook>();
     const [result, setResult] = useState<IQuizResult>();
     const [currLevel, setCurrLevel] = useState<number>(0);
 

     const navigate = useNavigate();

     const bookContext = useBook();
     const userContext = useUser();

     const { getBookByLevel, getBookByID } = bookContext;
     const { user, updateCategory, getHistoryBookByID, getQuizResultByID } = userContext;

     const getHistoryBookList = async () => {
          const response = await getHistoryBookByID(user?.UserID ?? 0); 
          setBookHistoryList(response);
          return response;
     }

     const getQuizResult = async (id: number): Promise<IQuizResult> => {
          const response = await getQuizResultByID(id);
          return response;
     }

     const checkProgress = async (level: number) => {
          const list = await getHistoryBookList();
          const filteredList = list.filter(h => h.Level == level)[0];
          const book = await getBook(filteredList.BookID ?? 0);
          const quiz = await getQuizResult(filteredList.BookHistoryID ?? 0);
          setBookDetail(book);
          setResult(quiz);
          setBookHist(filteredList);
          return filteredList;
     }

     const getBook = async (id: number): Promise<IBook> => {
          const response = await getBookByID(id);
          return response;
     }

     useEffect(() => {
          getHistoryBookList();
     }, [getHistoryBookByID])

     const openDonePage = () => {
          setIsDonePage(true);
     }

     const closeDonePage = () => {
          setCategoryAnimation("down");
          setTimeout(() => {
               setCategoryAnimation("up");
               setIsDonePage(false);
          }, 400); 
     }

     const getBookList = async (category: string): Promise<IBook[]> => {
          const response = await getBookByLevel(user?.Level ?? 0, category);
          return response;
     };

     const updateCategoryToDB = async (category: string) => {
          const response = await updateCategory(user?.UserID ?? 0, category);
          if(response != "Success"){
               console.log(response);
          }
     }

     const continueRead = () => {
          navigate(`/ReadPage/${user?.SaveBookID ?? 0}`);
     }

     const anotherLevel = async () => {
          const books = await getBookList(user?.BookCategory ?? "");
          setBookList(books);
          if (books) {
               setTimeout(() => {
                    setLoading(false);
                    bookSelectionActive();
               }, 2000);
          } else {
               setLoading(false); 
          }
     }

     const handleLevel = (level: number) => {
          if(level < (user?.Level ?? 0)){
               if(bookHistoryList.length != 0){
                    const res = checkProgress(level);
                    if(res != null){
                         openDonePage();
                    }
               }
          }
          else{
               if(user?.Level == level && user?.SavePage != 0){
                    continueRead();
               }
               else {
                    if(user?.Level != 1){
                         if(user?.BookCategory == "fiksi"){
                              if(user.Level ?? 0 % 2 != 0){
                                   setCategoryFiksi();
                              }
                              else{
                                   setCategoryNonFiksi();
                              }
                         }
                         else{
                              if(user?.Level ?? 0 % 2 == 0){
                                   setCategoryFiksi();
                              }
                              else{
                                   setCategoryNonFiksi();
                              }
                         }
                    }
                    else{
                         if(user.BookCategory == ""){
                              categoryActive();
                         }
                         else{
                              anotherLevel();
                         }
                         
                    }
               }
          }
          
          
     }

     const categoryActive = () => {
          setIsCategoryActive(true);
     }

     const setCategoryFiksi = async () => {
          setLoading(true);
          setCategoryBook("fiksi");
          if(user?.Level == 1){
               updateCategoryToDB("fiksi");
          }
          const books = await getBookList("fiksi");
          setBookList(books);
          if (books) {
               setTimeout(() => {
                    setLoading(false);
                    bookSelectionActive();
               }, 2000);
          } else {
              setLoading(false); 
          }
      };
      
      const setCategoryNonFiksi = async () => {
          setLoading(true);
          setCategoryBook("non-fiksi");
          if(user?.Level == 1){
               updateCategoryToDB("non-fiksi");
          }
          const books = await getBookList("non-fiksi");
          setBookList(books);
          if (books) {
               setTimeout(() => {
                    setLoading(false);
                    bookSelectionActive();
               }, 2000); 
          } else {
              setLoading(false); 
          }
      };

     const categoryInActive = () => {
          setCategoryAnimation("down");
          setTimeout(() => {
               setCategoryAnimation("up");
               setIsCategoryActive(false); 
          }, 400); 
     }

     const bookSelectionActive = () => {
          categoryInActive();
          setTimeout(() => {
               setIsBookSelectionActive(true);
          }, 400); 
     }

     const bookSelectionInActive = () => {
          setCategoryAnimation("down");
          setTimeout(() => {
               setCategoryAnimation("up");
               setIsBookSelectionActive(false); 
          }, 400); 
     }

     const readBook = () => {
          setCategoryAnimation("down");
          if(bookList[idx].BookID ?? 0){
               setTimeout(() => {
                    setCategoryAnimation("up");
                    setIsBookSelectionActive(false); 
                    navigate(`/ReadPage/${bookList[idx].BookID ?? 0}`);
               }, 400); 
          }
     }

     const goLeft = () => {
          if(idx > 0){
               setIdx(idx-1);
          }
     }

     const goRight = () => {
          if(idx < 4){
               setIdx(idx+1);
          }
     }

     // useEffect(() => {
     //      console.log("tes");
          
     //      if(categoryBook != "" && bookList.length == 0){
     //           setLoading(true);
     //      }
     //      setLoading(false);
     // }, [categoryBook]);

     const formatDate = (date: Date): string => {
          return format(date, 'EEE, dd MMM yyyy (HH:mm)');
     };
     
     const checkLevel = (curr: number) => {
          if(curr <= (user?.Level ?? 0)){
               return 'bookshelf'
          }
          else{
               return 'silk-covered';
          }
     }
     

     return (
          <div id="tantangan-main-container">
               <NavBar menu="tantangan"/>
               {loading && (
                    <LoadingScreen/>
               )}
               <ErrorMessage/>
               <div id="frame-petunjuk">
                    <h1>Petunjuk Permainan</h1>
                    <div id="desc-petunjuk">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                        Laudantium doloremque commodi voluptatum temporibus porro possimus, 
                        eveniet laboriosam et quia voluptas praesentium natus autem delectus 
                        iure illo quidem dolores neque cum placeat, eum ipsum earum. Numquam 
                        libero voluptatibus, ut beatae corporis fuga nihil incidunt 
                        ducimus delectus saepe sunt quibusdam odit nulla?
                    </div>
               </div>
               <div id="game-container">
                    <div className="level-container">
                         <div className="level" style={{backgroundImage: `url('/src/assets/level1.jpg')`}}></div>
                         <div className="bookshelf">
                              <div className="play-bttn" onClick={() => handleLevel(1)}></div>
                         </div>
                    </div>
                    <div className="level-container">
                         <div className={checkLevel(2)}>
                              {checkLevel(2) == 'bookshelf' && (
                                   <div className="play-bttn" onClick={() => handleLevel(2)}></div>
                              )}
                         </div>
                         <div className="level" style={{backgroundImage: `url('/src/assets/level2.jpg')`}}></div>
                    </div>
                    <div className="level-container">
                         <div className="level" style={{backgroundImage: `url('/src/assets/level3.jpg')`}}></div>
                         <div className={checkLevel(3)}>
                              {checkLevel(3) == 'bookshelf' && (
                                   <div className="play-bttn" onClick={() => handleLevel(3)}></div>
                              )}
                         </div>
                    </div>
                    <div className="level-container">
                         <div className={checkLevel(4)}>
                              {checkLevel(4) == 'bookshelf' && (
                                   <div className="play-bttn" onClick={() => handleLevel(4)}></div>
                              )}
                         </div>
                         <div className="level" style={{backgroundImage: `url('/src/assets/level4.jpg')`}}></div>
                    </div>
                    <div className="level-container">
                         <div className="level" style={{backgroundImage: `url('/src/assets/level5.jpg')`}}></div>
                         <div className={checkLevel(5)}>
                              {checkLevel(5) == 'bookshelf' && (
                                   <div className="play-bttn" onClick={() => handleLevel(5)}></div>
                              )}
                         </div>
                    </div>
                    <div className="level-container">
                         <div className={checkLevel(6)}>
                              {checkLevel(6) == 'bookshelf' && (
                                   <div className="play-bttn" onClick={() => handleLevel(6)}></div>
                              )}
                         </div>
                         <div className="level" style={{backgroundImage: `url('/src/assets/level6.jpg')`}}></div>
                    </div>
                    <div className="level-container">
                         <div className="level" style={{backgroundImage: `url('/src/assets/level7.jpg')`}}></div>
                         <div className={checkLevel(7)}>
                              {checkLevel(7) == 'bookshelf' && (
                                   <div className="play-bttn" onClick={() => handleLevel(7)}></div>
                              )}
                         </div>
                    </div>
                    <div className="level-container">
                         <div className={checkLevel(8)}>
                              {checkLevel(8) == 'bookshelf' && (
                                   <div className="play-bttn" onClick={() => handleLevel(8)}></div>
                              )}
                         </div>
                         <div className="level" style={{backgroundImage: `url('/src/assets/level8.jpg')`}}></div>
                    </div>
                    <div className="level-container">
                         <div className="level" style={{backgroundImage: `url('/src/assets/level9.jpg')`}}></div>
                         <div className={checkLevel(9)}>
                              {checkLevel(9) == 'bookshelf' && (
                                   <div className="play-bttn" onClick={() => handleLevel(9)}></div>
                              )}
                         </div>
                    </div>
                    <div className="level-container">
                         <div className={checkLevel(10)}>
                              {checkLevel(10) == 'bookshelf' && (
                                   <div className="play-bttn" onClick={() => handleLevel(10)}></div>
                              )}
                         </div>
                         <div className="level" style={{backgroundImage: `url('/src/assets/level10.jpg')`}}></div>
                    </div>
               </div>
               <footer>
                     
               </footer>
               {isCategoryActive && (
                    <div className="detail-container">
                         <div className={`container-1 ${categoryAnimation}`}>
                              <div className="x-bttn-1" onClick={categoryInActive}></div>
                              <div className="category-container">
                                   <h2>Kategori</h2>
                                   <div id="fiksi-bttn" onClick={setCategoryFiksi}></div>
                                   <div id="non-fiksi-bttn" onClick={setCategoryNonFiksi}></div>
                                   <div id="notes-container">
                                        <h3>Note : </h3>
                                        <div>Pemilihan kategori hanya diawal saja. Untuk level-level selanjutnya, kategorinya akan bergantian dengan pilihan awal Anda. Jika Anda memilih Fiksi maka selanjutnya Non-Fiksi, begitu sebaliknya.</div>
                                   </div>
                              </div>
                         </div>
                    </div>
               )}

               {isBookSelectionActive && (
                    <div className="detail-container">
                         <div className={`container-2 ${categoryAnimation}`}>
                              <div className="x-bttn-2" onClick={bookSelectionInActive}></div>
                              <div className="pilbuk-container">
                                   <div id="header-1"></div>
                                   <h2>Pilihan Buku</h2>
                                   <div id="pilbuk-container-1">
                                        <div id="pilbuk-container-2">
                                             <div id="carousel-container">
                                                  {idx != 0 && (
                                                       <div id="arrow-left" onClick={goLeft}></div>
                                                  )}
                                                  {idx == 0 && (
                                                       <div id="arrow-left-0"></div>
                                                  )}
                                                  <img src={bookList[idx].CoverBook} id="pilbuk"/>
                                                  {idx < 4 && (
                                                       <div id="arrow-right" onClick={goRight}></div>
                                                  )}
                                                  {idx == 4 && (
                                                       <div id="arrow-right-0"></div>
                                                  )}
                                             </div>
                                             <div id="bttn-container">
                                                  <div id="pilih-bttn" onClick={readBook}>Pilih</div>
                                                  {idx == 4 && (
                                                       <div id="acak-bttn">Acak</div>
                                                  )}
                                                  {idx < 4 && (
                                                       <div id="acak-bttn-0">Acak</div>
                                                  )}
                                             </div>
                                        </div>
                                        <div id="sinopsis-container">
                                             <h3>Title : {bookList[idx].Title} </h3>
                                             <h3>Author : {bookList[idx].Author} </h3>
                                             <h3>Genre : {bookList[idx].Genre} </h3>
                                             <h3>Total page : {bookList[idx].TotalPage} </h3>
                                             <h3>Sinopsis :</h3>
                                             <div>{bookList[idx].Synopsis}</div>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>
               )}
               {isDonePage && (
                    <div id="level-progress-background">
                         <div className={`level-progress-container ${categoryAnimation}`}>
                              <h1>Selesai</h1>
                              <div id="level-progress-desc">
                                   <div className="prog-desc-container">
                                        <h2>Judul buku : </h2>
                                        <div className="prog-desc">{bookDetail?.Title}</div>
                                   </div>
                                   <div className="prog-desc-container">
                                        <h2>Penulis : </h2>
                                        <div className="prog-desc">{bookDetail?.Author}</div>
                                   </div>
                                   <div className="prog-desc-container">
                                        <h2>Kategori : </h2>
                                        <div className="prog-desc">{bookDetail?.Category}</div>
                                   </div>
                                   <div className="prog-desc-container">
                                        <h2>Selesai pada : </h2>
                                        <div className="prog-desc"> {bookHist?.FinishTime ? formatDate(bookHist.FinishTime) : '-'}</div>
                                   </div>
                                   <div className="prog-desc-container">
                                        <h2>Total koin : </h2>
                                        <div className="prog-desc">{result?.CoinEarned}</div>
                                   </div>
                                   <div id="prog-bttn-container">
                                        <div id="ok-prog-bttn" onClick={closeDonePage}>OK</div>
                                   </div>
                              </div>
                         </div>
                    </div>
               )}
          </div>
     )
}