"use client";

import React, { useEffect, useState } from "react";
import Header from "./_components/Header";
import SideNav from "./_components/SideNav";
import { VideoDataContext } from "../_context/VideoDataContext";
import { UserDetailContext } from "../_context/UserDetailContext";
import { useUser } from "@clerk/nextjs";
import { db } from "@/configs/db";
import { Users } from "@/configs/schema"; // ✅ Your actual table schema

import { eq } from "drizzle-orm";

function DashboardLayout({ children }) {
  const [videoData, setVideoData] = useState([]);
  const [userDetail, setUserDetail] = useState(null);
  const { user } = useUser();
  useEffect(() => {
    user && getUserDetail();
  }, [user]);
  const getUserDetail = async () => {
    const result = await db
      .select()
      .from(Users)
      .where(eq(Users.email, user?.primaryEmailAddress?.emailAddress));
      if(result.length > 0){
        setUserDetail(result[0]);
      }else{
        console.error("No User Found for this email:",user?.primaryEmailAddress?.emailAddress);
        setUserDetail(null);
      }
    
      setUserDetail(result[0]);
  };
  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <VideoDataContext.Provider value={{ videoData, setVideoData }}>
        <div>
          <div className="hidden md:block h-screen bh-white fixed mt-[65px] w-64">
            <SideNav />
          </div>
          <div>
            <Header />
            <div className="md:ml-64 p-10">{children}</div>
          </div>
        </div>
      </VideoDataContext.Provider>
    </UserDetailContext.Provider>
  );
}

export default DashboardLayout;
