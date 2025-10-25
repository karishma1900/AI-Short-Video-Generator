import { SignUp } from '@clerk/nextjs'
import Image from 'next/image';
import './signup.css'
import Header from '@/app/header/page';
export default function Page() {
  
  return(
     <div className='signup'>
      <Header />
      {/* <div className='login-form'>
        <Image src={'/login.jpg'} alt="login" width={500} height={500} className='w-full object-contain' />
        
      </div> */}
      <div className='signincomponent'>
      <SignUp />
        </div>
    </div>
  ) 
}