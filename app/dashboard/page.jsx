"use client"
import { Button } from '@/components/ui/button'
import React, {  useEffect, useState } from 'react'
import EmptyState from './_components/EmptyState';
import Link from "next/link";
import { VideoData } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import VideoList from './_components/VideoList';
import { useUser } from '@clerk/nextjs';
import { db } from '@/configs/db';



function Dashboard() {
  const [videoList,setVideoList] = useState([]);

  const {user}= useUser();
  useEffect(()=>{
    user&&GetVideoList();
  },[user])
  // use to get users video
  const GetVideoList=async()=>{
    const result = await db.select().from(VideoData)
    .where(eq(VideoData?.createdBy,user?.primaryEmailAddress?.emailAddress))
  console.log(result);
  setVideoList(result);
  }
  return (
    <div>
      <div className='flex justify-between items-center'>
         <h2 className='font-bold text-2xl text-white'>Dashboard</h2>
        <Link href={"/dashboard/create-new"} >
        <Button className='cursor-pointer'> Create New +</Button>
      </Link>
      </div>
      {/* {empty list} */}
      {
        videoList?.length==0&&<div>
          <EmptyState />
        </div>
      }
      {/* List of Videos generated */}
     <VideoList videoList={videoList} />
    </div>
  )
}

export default Dashboard
