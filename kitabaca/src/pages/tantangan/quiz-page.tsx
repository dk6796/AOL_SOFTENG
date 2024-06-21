import '../../style/quiz-page.css'
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useBook from "../../context/bookContext";
import useUser from '../../context/userContext';
import { IQuestion } from '../../interfaces/questionInterface';
import { IOption } from '../../interfaces/optionInterface';
import LoadingScreen from '../../components/loadingScreen';
import { IBookHistory } from '../../interfaces/bookHistoryInterface';
import { IQuizResult } from '../../interfaces/quizResultInterface';
import { IBook } from '../../interfaces/bookInterface';
import { IError } from '../../interfaces/errorInterface';
import ErrorMessage from '../../components/errorMessage';

export default function QuizPage(){

     const [timeLeft, setTimeLeft] = useState<number>(30);
     const timerRef = useRef<NodeJS.Timeout | null>(null);
     const duration = 30;

     const navigate = useNavigate();

     const { bookID } = useParams();

     const bookContext = useBook();
     const userContext = useUser();

     const { readQuestion, readOption, getBookByID } = bookContext;
     const { user, updateCoin, saveHistoryBook, saveQuizResult, checkUser, errorMessageHandler, updateLevel } = userContext;

     const [questionList, setQuestionList] = useState<IQuestion[]>([]);
     const [optionList, setOptionList] = useState<IOption[]>([]);

     const [filterQuestionList, setFilterQuestionList] = useState<IQuestion[]>([]);
     const [filterOptionList, setFilterOptionList] = useState<IOption[]>([]);
     const [number, setNumber] = useState<number>(1);

     const [result, setResult] = useState<string>("");

     const [totalPoint, setTotalPoint] = useState<number>(0);
     const [winStreak, setWinStreak] = useState<number>(0);

     const [isOpenResult, setOpenResult] = useState<boolean>(false);
     const [openResultAnimation, setOpenResultAnimation] = useState<string>("");

     var checkStatus = 0;

     // useEffect(() => {
     //      if (!checkUser()) {
     //           navigate("/TantanganPage");
     //           const err: IError = {
     //                ErrorMessage: "Anda belum login !",
     //                ErrorType: "Authentication",
     //           }
     //           errorMessageHandler(err);
     //      }
     // }, [checkUser]);

     const updateLevelToDB = async () => {
          const response = await updateLevel(user?.UserID ?? 0, (user?.Level ?? 0 + 1));
          if(response != "Success"){
               console.log(response);
               return false;
          }
          return true;
     }

     const updateCoinToDB = async () => {
          const total = ((totalPoint*10)+(winStreak*3));
          const total_coin = total + (user?.TotalCoin ?? 0);
          // console.log("TOTAL: ", total);
          // console.log("COIN : ", total_coin);
          
          const response = await updateCoin(user?.UserID ?? 0, total_coin);
          if(response != "Success"){
               console.log(response);
               return false;
          }
          return true;
     }

     const quizDone = async () => {
          if(await updateLevelToDB() && await updateCoinToDB()){
               navigate("/TantanganPage");
          }
     }

     const getBookFromDB = async (): Promise<IBook> => {
          const response = await getBookByID(parseInt(bookID ?? ""));
          return response;
     }

     const openResult = () => {
          setOpenResult(true);
     }

     const closeResult = () => {
          setOpenResultAnimation("down");
          setTimeout(() => {
               setOpenResultAnimation("");
               setOpenResult(false);
               quizDone();
          }, 400);
     }

     const getQuestionList = async (): Promise<IQuestion[]> => {
          const response = await readQuestion();
          return response;
     }

     const getOptionList = async (): Promise<IOption[]> => {
          const response = await readOption();
          return response;
     }

     const getQuestionFilter = async () => {
          const list = await getQuestionList();
          const choice = await getOptionList();
          const filter = list.filter(q => q.BookID == bookID);
          setQuestionList(list);
          setOptionList(choice);
          setFilterQuestionList(filter);
     }

     const getOptionFilter = () => {
          const filter = optionList.filter(o => o.QuestionID == filterQuestionList[number-1].QuestionID);
          setFilterOptionList(filter);
     }

     // useEffect(() => {
     //      if(number <= 10){
     //           getOptionFilter();
     //      }
     // }, [number, questionList, optionList]);

     const fetchData = async () => {
          await getQuestionList();
          await getOptionList();
     };

     const checkOption = (id: number) => {
          stopTimer();
          if(id == -1){
               setResult("Waktu Habis");
               setWinStreak(0);
          }
          else if(filterOptionList[id].IsAnswer){
               setResult("Benar");
               setTotalPoint(totalPoint+1);
               setWinStreak(winStreak+1);
          }
          else{
               setResult("Salah");
               setWinStreak(0);
          }
          setTimeout(() => {
               setResult("");
               if(number < 10){
                    setNumber(number+1);
                    setTimeLeft(30);
                    if(number <= 10){
                         getOptionFilter();
                    }
               }
               else if(number == 10){
                    openResult();
               }
          }, 3000);
          // console.log(result);
          
     }

     useEffect(() => {
          getQuestionFilter();
     }, []);

     useEffect(() => {
          if (questionList.length !== 0 && optionList.length !== 0) {
               getQuestionFilter();
               getOptionFilter();
          }
     }, [number, questionList, optionList]);
     
     const stopTimer = () => {
          if (timerRef.current) {
              clearInterval(timerRef.current);
          }
     };

     const startTimer = () => {
          if (timerRef.current) {
              clearInterval(timerRef.current);
          }
  
          timerRef.current = setInterval(() => {
              setTimeLeft((prevTime) => {
                  if (prevTime <= 1) {
                      clearInterval(timerRef.current!);
                      checkOption(-1);
                      return 0;
                  }
                  return prevTime - 1;
              });
          }, 1000);
     };

     useEffect(() => {
          startTimer();
          return () => clearInterval(timerRef.current!);
     }, [number]);

     if (questionList.length === 0 || filterOptionList.length === 0) {
          return <LoadingScreen/>;
     }

     const saveBookHistoryToDB = async (history: IBookHistory) => {
          console.log("HISTORY: ", history);
          
          const response = await saveHistoryBook(history);
          if(response.message != "Succesfull"){
               console.log(response);
               return;
          }
          return response.bookHistoryID;
     }

     const saveQuizResultToDB = async (result: IQuizResult) => {
          const response = await saveQuizResult(result);
          if(response != "Succesfull"){
               console.log(response);
               return false;
          }
          return true;
     }

     const saveProgress = async () => {
          const book = await getBookFromDB();
          const history: IBookHistory = {
               UserID: user?.UserID,
               BookID: parseInt(bookID ?? ""),
               Level: book.Level,
               FinishTime: new Date(),
          }
          const historyID = await saveBookHistoryToDB(history);

          const result: IQuizResult = {
               BookHistoryID: historyID,
               TotalCorrect: totalPoint,
               CorrectStreak: winStreak,
               CoinEarned: ((totalPoint*10)+(winStreak*3)),
          }

          const res = await saveQuizResultToDB(result);
          if(res){
               closeResult();
          }
     }

     return (
          <div id="quiz-page-main-container">
               {/* <ErrorMessage/> */}
               <div id="quiz-page-container">
                    <div id="time-left-container">
                         <div id="time-img"></div>
                         <h1 id="quiz-time">00 : {timeLeft}</h1>
                    </div>
                    <div id="time-bar-container">
                         <div id="time-bar" style={{width: `${(timeLeft / duration) * 100}%`}}></div>
                    </div>
                    <div id="quiz-question">{number}. {filterQuestionList[number-1].QuizQuestion}</div>
                    <div className="answer-container">
                         <div id="answer-1" onClick={() => checkOption(0)}>{filterOptionList[0].Option}</div>
                         <div id="answer-3" onClick={() => checkOption(2)}>{filterOptionList[2].Option}</div>
                    </div>
                    <div className="answer-container">
                         <div id="answer-2" onClick={() => checkOption(1)}>{filterOptionList[1].Option}</div>
                         <div id="answer-4" onClick={() => checkOption(3)}>{filterOptionList[3].Option}</div>
                    </div>
               </div>
               {result != "" && (
                    <div id="result-quiz-container">
                         {result == "Benar" && (
                              <div className="result-quiz-container-1">
                                   <div id="result-img" style={{backgroundImage: `url('/src/assets/correct.gif')`}}></div>
                                   <div id="result-desc">{result}</div>
                              </div>
                         )}
                         {result == "Salah" && (
                              <div className="result-quiz-container-1">
                                   <div id="result-img" style={{backgroundImage: `url('/src/assets/wrong.gif')`}}></div>
                                   <div id="result-desc">{result}</div>
                                   <div></div>
                              </div>
                         )}
                         {result == "Waktu Habis" && (
                              <div className="result-quiz-container-1">
                                   <div id="result-img" style={{backgroundImage: `url('/src/assets/timesup.gif')`}}></div>
                                   <div id="result-desc">{result}</div>
                              </div>
                         )}
                    </div>
               )}
               {isOpenResult && (
                    <div id="end-quiz-container">
                         <div id="end-quiz-result">
                              <h2>Hasil Akhir</h2>
                              <div id="end-quiz-desc">
                                   <div id="from-soal-container">
                                        <div id="jumlah-soal-container">
                                             <div id="jumlah-desc">Jumlah Soal yang Benar : </div>
                                             <div id="tampil-skor">{totalPoint} dari 10</div>
                                        </div>
                                        <div className="quiz-coin-container">
                                             <div>+ {totalPoint * 10}</div>
                                             <div id="skor-coin"></div>
                                        </div>
                                   </div>
                                   <div id="from-streak-container">
                                        <div id="streak-container">
                                             <div id="streak-desc">Win Streak : </div>
                                             <div id="streak-skor">{winStreak}</div>
                                        </div>
                                        <div className="quiz-coin-container">
                                             <div>+ {winStreak * 3}</div>
                                             <div id="skor-coin"></div>
                                        </div>
                                   </div>
                                   <div id="hr-quiz"></div>
                                   <div id="total-coin-quiz-container">
                                        <div id="total-coin-desc">Total :</div>
                                        <div className="quiz-coin-container">
                                             <div>+ {(totalPoint*10)+(winStreak*3)}</div>
                                             <div id="skor-coin"></div>
                                        </div>
                                   </div>
                                   <div id="ok-quiz-button" onClick={saveProgress}>Ok</div>
                              </div>
                         </div>
                    </div>
               )}
          </div>
     )
}