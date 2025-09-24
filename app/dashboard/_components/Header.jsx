import React ,{ useContext } from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { UserDetailContext } from '@/app/_context/UserDetailContext'



function Header() {
     const {userDetail,setUserDetail}=useContext(UserDetailContext);
  return (
    <div className='p-3 px-5 flex items-center justify-between shadow-md'>
        <div className='flex gap-3 items-center'>
            <Image src={'/logo.png'} alt="logo" width={50} height={50} />
            <h2 className='font-bold text-white text-xl'>Ai Short Video</h2>
        </div>
      <div className='flex gap-3 items-center'>
        <div className='flex gap-1 items-center'>
          <Image src={'/dollar.png'} alt="coin" width={20} height={20}/>
          <h2 className='text-white'>{userDetail?.credits}</h2>
        </div>
        <Button className="bg-[#3a2898]">Dashboard</Button>
        <UserButton/>
      </div>
    </div>
  )
}

export default Header

