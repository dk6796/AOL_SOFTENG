import { Route, BrowserRouter as Router, Routes } from '../node_modules/react-router-dom/dist/index'
import HomePage from './pages/home/home'
import TantanganPage from './pages/tantangan/tantangan'
import VoucherPage from './pages/voucher/voucher'
import LoginPage from './pages/home/login-page'
import RegisterPage from './pages/home/register-page'
import ProfilePage from './pages/home/profile-page'
import ReadPage from './pages/tantangan/read-page'
import QuizPage from './pages/tantangan/quiz-page'
import {UserProvider} from "./context/userContext"
import {BookProvider} from "./context/bookContext"
import {VoucherProvider} from "./context/voucherContext"

function App() {
  return (
    <Router>
      <UserProvider>
        <BookProvider>
          <VoucherProvider>
            <Routes>
              <Route path="/" element={<HomePage/>}></Route>
              <Route path="/LoginPage" element={<LoginPage/>}></Route>
              <Route path="/RegisterPage" element={<RegisterPage/>}></Route>
              <Route path="/ProfilePage" element={<ProfilePage/>}></Route>
              <Route path="/TantanganPage" element={<TantanganPage/>}></Route>
              <Route path="/ReadPage/:bookID" element={<ReadPage/>}></Route>
              <Route path="/QuizPage/:bookID" element={<QuizPage/>}></Route>
              <Route path="/VoucherPage" element={<VoucherPage/>}></Route>
            </Routes>
          </VoucherProvider>
        </BookProvider>
      </UserProvider>
    </Router>
  )
}

export default App