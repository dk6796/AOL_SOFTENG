import '../../style/home-page.css'
import NavBar from '../../components/navbar'
import { useState, useEffect } from 'react';
import {UserProvider} from '../../context/userContext'
import { BookProvider } from '../../context/bookContext';
import ErrorMessage from '../../components/errorMessage';
import Footer from '../../components/footer';

export default function HomePage(){

     const [imageName, setImageName] = useState<string>('');
     const [imageName1, setImageName1] = useState<string>('');
     const [imageName2, setImageName2] = useState<string>(''); 

     const bannerImages = [
          'Slide1.jpg',
          'Slide2.jpg',
          'Slide3.jpg',
          'Slide4.jpg',
          'Slide5.jpg',
          'Slide6.jpg',
          'Slide7.jpg',
          'Slide8.jpg',
          'Slide9.jpg',
          'Slide10.jpg',
          'Slide11.jpg'
     ];

      const bannerImages1 = [
         'Slide1.jpg',
         'Slide2-m.jpg',
         'Slide3-m.jpg',
         'Slide4-m.jpg',
         'Slide5-m.jpg',
         'Slide6-m.jpg',
         'Slide7-m.jpg',
         'Slide8-m.jpg',
         'Slide9-m.jpg',
         'Slide10-m.jpg',
         'Slide11-m.jpg'
      ];

     useEffect(() => {
          const handleScroll = () => {
            const scrollPosition = window.scrollY;
            console.log("Position: ", scrollPosition);
            
            if (scrollPosition < 300) {
               setImageName(bannerImages[0]);
            } 
            else if (scrollPosition >= 300 && scrollPosition < 320) {
               setImageName(bannerImages[1]);
            }
            else if (scrollPosition >= 320 && scrollPosition < 350) {
               setImageName(bannerImages[2]);
            }
            else if (scrollPosition >= 350 && scrollPosition < 380) {
               setImageName(bannerImages[3]);
            } 
            else if (scrollPosition >= 380 && scrollPosition < 400) {
               setImageName(bannerImages[4]);
            }
            else if (scrollPosition >= 400 && scrollPosition < 430) {
               setImageName(bannerImages[5]);
            }
            else if (scrollPosition >= 430 && scrollPosition < 450) {
               setImageName(bannerImages[6]);
            }
            else if (scrollPosition >= 450 && scrollPosition < 470) {
               setImageName(bannerImages[7]);
            }
            else if (scrollPosition >= 470 && scrollPosition < 490) {
               setImageName(bannerImages[8]);
            }
            else if (scrollPosition >= 490 && scrollPosition < 510) {
               setImageName(bannerImages[9]);
            }
            else if (scrollPosition >= 510){
               setImageName(bannerImages[10]);
            }
            if (scrollPosition < 1200) {
               setImageName1(bannerImages1[0]);
            } 
            else if (scrollPosition >= 1200 && scrollPosition < 1220) {
               setImageName1(bannerImages1[1]);
            }
            else if (scrollPosition >= 1220 && scrollPosition < 1250) {
               setImageName1(bannerImages1[2]);
            }
            else if (scrollPosition >= 1250 && scrollPosition < 1280) {
               setImageName1(bannerImages1[3]);
            } 
            else if (scrollPosition >= 1280 && scrollPosition < 1300) {
               setImageName1(bannerImages1[4]);
            }
            else if (scrollPosition >= 1300 && scrollPosition < 1330) {
               setImageName1(bannerImages1[5]);
            }
            else if (scrollPosition >= 1330 && scrollPosition < 1350) {
               setImageName1(bannerImages1[6]);
            }
            else if (scrollPosition >= 1350 && scrollPosition < 1370) {
               setImageName1(bannerImages1[7]);
            }
            else if (scrollPosition >= 1370 && scrollPosition < 1390) {
               setImageName1(bannerImages1[8]);
            }
            else if (scrollPosition >= 1390 && scrollPosition < 1410) {
               setImageName1(bannerImages1[9]);
            }
            else if (scrollPosition >= 1410){
               setImageName1(bannerImages1[10]);
            }
            if (scrollPosition < 1630) {
               setImageName2(bannerImages[0]);
            } 
            else if (scrollPosition >= 1630 && scrollPosition < 1650) {
               setImageName2(bannerImages[1]);
            }
            else if (scrollPosition >= 1650 && scrollPosition < 1670) {
               setImageName2(bannerImages[2]);
            }
            else if (scrollPosition >= 1670 && scrollPosition < 1700) {
               setImageName2(bannerImages[3]);
            } 
            else if (scrollPosition >= 1700 && scrollPosition < 1720) {
               setImageName2(bannerImages[4]);
            }
            else if (scrollPosition >= 1720 && scrollPosition < 1750) {
               setImageName2(bannerImages[5]);
            }
            else if (scrollPosition >= 1750 && scrollPosition < 1820) {
               setImageName2(bannerImages[6]);
            }
            else if (scrollPosition >= 1820 && scrollPosition < 1870) {
               setImageName2(bannerImages[7]);
            }
            else if (scrollPosition >= 1870 && scrollPosition < 1900) {
               setImageName2(bannerImages[8]);
            }
            else if (scrollPosition >= 1900 && scrollPosition < 1920) {
               setImageName2(bannerImages[9]);
            }
            else if (scrollPosition >= 1950){
               setImageName2(bannerImages[10]);
            }
            
          };
      
          window.addEventListener('scroll', handleScroll);
          return () => window.removeEventListener('scroll', handleScroll);
     }, []);

     return (
          <div id="main-container">
             {/* <ErrorMessage/> */}
              <UserProvider>
                  <BookProvider>
                     <NavBar menu="home"/>
                  </BookProvider>
              </UserProvider>
              {/* <img src="/src/assets/Slide11.JPG" alt="hai hello world" /> */}
              <div id="contains-container">
                  <div id="banner-container" style={{ backgroundImage: `url('/src/assets/${imageName}')` }}>
                       
                  </div>
                  <div id="selotip-about1"></div>
                  <div id="selotip-about2"></div>
                  <div id="about-main-container">
                        <div id="about-container">
                              <h1>Tentang Kami</h1>
                              <div id="tentang-kami-desc">
                                   Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quos itaque commodi fugiat nemo amet officiis maiores temporibus. Nam alias officia voluptatibus possimus at odit sit nemo error officiis perspiciatis, accusamus a amet non voluptas similique laboriosam! Nemo, tempora necessitatibus? Perferendis porro, expedita itaque repellendus ab totam et dolore labore eligendi.
                              </div>
                        </div>
                  </div>
                  <div id="banner-container1" style={{ backgroundImage: `url('/src/assets/${imageName1}')` }}>
                        
                  </div>
              </div>
              {/* <Footer/> */}
          </div>
     )
}