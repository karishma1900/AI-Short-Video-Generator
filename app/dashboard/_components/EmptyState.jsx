import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function EmptyState() {
  return (
    <div className="p-5 py-24 flex items-center flex-col mt-10 border-2 border-dashed">
      <h2 className="text-white pb-[15px]">You Don't Have any Short Video Created</h2>
      <Link href={"/dashboard/create-new"}>
        <Button className='cursor-pointer'>Create New Short Button</Button>
      </Link>
    </div>
  );
}

export default EmptyState;
