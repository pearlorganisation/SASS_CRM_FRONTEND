import React, { useEffect } from 'react'
import {useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'

import { useNavigate } from 'react-router-dom'
import { addSidebarLink } from '../../../features/actions/sidebarLink'



const CreateSidebarLink = () => {

    const {register,handleSubmit,formState: { errors },control}=useForm()
    const navigate = useNavigate()
    const {sidebarLinkData,isLoading} = useSelector((state)=>state.sidebarLink)
const dispatch = useDispatch()

      const onSubmit = data =>{

        dispatch(addSidebarLink(data))
        }

        useEffect(()=>{
          if(sidebarLinkData.status){
            navigate("/sidebarLinks")
          }
        },[sidebarLinkData])

  return (
    <div className=''>
    <div className="mt-10 ">
  <div className=" flex justify-center">
   
  </div>
  <div className="bg-white rounded-lg shadow-lg  sm:rounded-lg sm:max-w-5xl mt-8 mx-auto">
    <h3 className="text-gray-700 text-base text-center bg-gray-100 font-medium sm:text-xl p-2 rounded-t-lg uppercase"> Add Sidebar Link </h3>
    <form className="space-y-6 mx-8 sm:mx-2  p-4 py-6" onSubmit={handleSubmit(onSubmit)}  >
      <div className="sm:flex space-y-6 sm:space-y-0 justify-between gap-10">
      <div className="w-full">
        <label className="font-medium">Title</label>
        <input 
        {...register('title', { required: true })}
          type="text"
          className="w-full mt-2  px-5 py-2 text-gray-500 border-slate-300 bg-transparent outline-none border focus:border-teal-400 shadow-sm rounded-lg"
        />
         {errors.title && (
                <span className="text-red-500">
                  Title is required
                </span>
              )}
      </div>
      <div className="w-full">
        <label className="font-medium">Link</label>
        <input 
        {...register('link', { required: true })}
          type="text"
          className="w-full mt-2  px-5 py-2 text-gray-500 border-slate-300 bg-transparent outline-none border focus:border-teal-400 shadow-sm rounded-lg"
        />
         {errors.link && (
                <span className="text-red-500">
                  Link is required
                </span>
              )}
      </div>
 
   
     
        </div>


        
      <div style={{ marginTop: '4rem' }}>
      
             <button className="w-full btn-grad:hover btn-grad"
          >
          {/* {isLoading ? (
            <ClipLoader color="#c4c2c2" />
          ) : (<>Create</>)} */}Create
          </button>
           
        </div>
    </form>  
  </div>
</div>
</div>
  )
}

export default CreateSidebarLink