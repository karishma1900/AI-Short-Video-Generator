import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";



function SelectDuration({onUserSelect}) {
  return (
    <div className='mt-7'>
      <h2 className="font-bold text-2xl text-white">Duration</h2>
      <p className="text-gray-500">Select the Duration of Your Video</p>
      <Select onValueChange={(value)=>{
      
        value!= 'Custom Prompt' && onUserSelect('duration',value)

      }}>
        <SelectTrigger className="w-full mt-2 p-6 text-lg cursor-pointer" >
          <SelectValue placeholder="Select Duration" />
        </SelectTrigger>

        <SelectContent>
         <SelectItem value='30' className="demo">30 Seconds</SelectItem>
      <SelectItem value='60'>60 Seconds</SelectItem>
        </SelectContent>
      </Select>
     
    </div>
  )
}

export default SelectDuration
