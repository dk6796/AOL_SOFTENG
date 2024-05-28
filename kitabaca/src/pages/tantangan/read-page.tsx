import "../../style/read-page.css";
import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useParams, useNavigate } from 'react-router-dom';
import useBook from "../../context/bookContext";
import useUser from "../../context/userContext";
import LoadingScreen from '../../components/loadingScreen';
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { IBook } from '../../interfaces/bookInterface';
import { IError } from "../../interfaces/errorInterface";
import ErrorMessage from "../../components/errorMessage";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function ReadPage() {
  const bookContext = useBook();
  const userContext  = useUser();
  const navigate = useNavigate();
  const { getBookByID } = bookContext;
  const { user, updateReadBook, checkUser, errorMessageHandler } = userContext;
  const { bookID } = useParams();
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [confirmation, setConfirmation] = useState<boolean>();
  const [isNext, setIsNext] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmAnimation, setConfirmAnimation] = useState<string>("");
  const [nextAnimation, setNextAnimation] = useState<string>("");

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  // useEffect(() => {
  //   if (!checkUser()) {
  //        navigate("/TantanganPage");
  //        const err: IError = {
  //             ErrorMessage: "Anda belum login !",
  //             ErrorType: "Authentication",
  //        }
  //        errorMessageHandler(err);
  //   }
  // }, [checkUser]);

  const goToPrevPage = () => setPageNumber(pageNumber - 2);
  const goToNextPage = () => setPageNumber(pageNumber + 2);

  const getBookFromDB = async (): Promise<IBook> => {
    const response = await getBookByID(parseInt(bookID ?? ""));
    return response;
  }

  const openConfirmation = () => {
    setConfirmation(true);
  }

  const closeConfirmation = () => {
    setConfirmAnimation("down");
    setTimeout(() => {
      setConfirmAnimation("");
      setConfirmation(false); 
    }, 400); 
  }

  const openNext = () => {
    setIsNext(true);
  }

  const closeNext = () => {
    setNextAnimation("down");
    setTimeout(() => {
      setNextAnimation("");
      setIsNext(false); 
    }, 400); 
  }

  const nextPage = () => {
    setNextAnimation("down");
    setTimeout(() => {
      setNextAnimation("");
      setIsNext(false); 
      navigate(`/QuizPage/${bookID ?? 0}`);
    }, 400); 
  }

  const getBook = async () => {
    if(user?.SavePage != 0){
      setPageNumber(user?.SavePage ?? 1);
    }
    const book = await getBookFromDB();
    console.log("Buku: ", book.FilePDF);
    setFileURL(book.FilePDF ?? "");
  }

  const saveProgress = async () => {
    const response = await updateReadBook(user?.UserID ?? 0, pageNumber, parseInt(bookID ?? ""));
    if(response != "Success"){
      console.log(response);
    }
  }

  const processSave = () => {
    setConfirmAnimation("down");
    setLoading(true);
    saveProgress();
    setTimeout(() => {
      setConfirmAnimation("");
      setConfirmation(false); 
    }, 400); 
    setTimeout(() => {
      setLoading(false);
      navigate("/TantanganPage");
    }, 2000);
  }

  useEffect(() => {
    getBook();
  }, [bookID]);

  return (
    <div>
      {loading && (
          <LoadingScreen/>
      )}
      {fileURL && (
        <div id="read-book-container">
           <ErrorMessage/>
            <div id="page-info">{pageNumber} of {numPages}</div>
            {pageNumber > 1 && (
              <div id="left-bttn" onClick={goToPrevPage}></div>
            )}
            {pageNumber <= 1 && (
              <div id="left-bttn-1"></div>
            )}
            <Document file={fileURL} onLoadSuccess={onDocumentLoadSuccess} className="read-document-container">
              {pageNumber-1 > 0 && (
                <Page pageNumber={pageNumber-1} className="read-document"  height={window.innerHeight} />
              )}
              <Page pageNumber={pageNumber} className="read-document" height={window.innerHeight} />
            </Document>
            {pageNumber >= numPages-1 && (
              <div id="right-bttn-1"></div>
            )}
            {pageNumber < numPages-1 && (
              <div id="right-bttn" onClick={goToNextPage}></div>
            )}
            <div id="read-back-bttn" onClick={openConfirmation}>Back</div>
            {pageNumber >= numPages-1 && (
              <div id="read-done-bttn" onClick={openNext}>Done</div>
            )}
            {confirmation && (
              <div id="confirmation-container-background">
                <div className={`confirmation-container ${confirmAnimation}`}>
                  <h1>Konfirmasi</h1>
                  <div>Anda yakin ingin keluar ?</div>
                  <h6>Note : halaman terakhir yang Anda baca akan disimpan</h6>
                  <div id="confirmation-bttn-container">
                    <div id="yakin-bttn" onClick={processSave}>Yakin</div>
                    <div id="tidak-bttn" onClick={closeConfirmation}>Tidak</div>
                  </div>
                </div>
              </div>
            )}
            {isNext && (
              <div id="confirmation-container-background">
                <div className={`confirmation-container ${nextAnimation}`}>
                  <h1>Konfirmasi</h1>
                  <div>Anda yakin sudah selesai membaca ?</div>
                  <h6 id="note-desc">Note : setelah ini ada 10 pertanyaan kuis yang harus dijawab oleh Anda dan tidak bisa lagi kembali ke halaman membaca</h6>
                  <div id="confirmation-bttn-container">
                    <div id="yakin-bttn" onClick={nextPage}>Yakin</div>
                    <div id="tidak-bttn" onClick={closeNext}>Tidak</div>
                  </div>
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
