import Header from '@/app/header/page';
import { SignIn } from '@clerk/nextjs'
import Image from 'next/image';
import '../../sign-up/[[...sign-up]]/signup.css'
export default function Page() {
  
  return(
     <div className='signin'>
      <Header />
      {/* <div className='login-form'>
        <Image src={'/login.jpg'} alt="login" width={500} height={500} className='w-full object-contain' />
        
      </div> */}
      <div className='signincomponent' >
      <SignIn />
        </div>
    </div>
  ) 
}