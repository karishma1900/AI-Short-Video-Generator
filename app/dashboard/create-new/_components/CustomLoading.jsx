import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Image from 'next/image'


function CustomLoading({loading}) {
  return (
    
  <AlertDialog open={loading}>
    <AlertDialogTitle>...</AlertDialogTitle>
  <AlertDialogContent >
   <div className="flex flex-col items-center mt-10 justify-center">
    <Image alt='loading' src={'/loading.gif'} width={100} height={100} />
    <h2>Generating Your Video... Do Not Refresh</h2>
   </div>
  </AlertDialogContent>
</AlertDialog>

  )
}

export default CustomLoading
