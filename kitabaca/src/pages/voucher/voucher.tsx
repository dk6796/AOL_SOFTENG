import '../../style/voucher-page.css'
import NavBar from '../../components/navbar'
import ErrorMessage from '../../components/errorMessage'

export default function VoucherPage(){
     return (
          <div id="voucher-main-container">
               <ErrorMessage/>
              <NavBar menu="voucher"/>
          </div>
     )
}