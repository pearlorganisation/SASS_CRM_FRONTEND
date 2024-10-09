import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import Select from "react-select"
import {addEmployee} from "../../features/actions/employee"
import { useNavigate } from 'react-router-dom'

const CreateEmployee = () => {

    const {register,handleSubmit, watch,formState: { errors },control}=useForm()
    const {userData} = useSelector((state)=>state.auth)
    const {employeeData} = useSelector((state)=>state.employee)
const dispatch = useDispatch()
const navigate = useNavigate()

      const onSubmit = data =>{
        const newData={
          ...data,
          selectedRole:data.selectedRole.value,
          adminId:userData?.id
        }
        dispatch(addEmployee(newData))
        }

        const [isPasswordHidden,setPasswordHidden]= useState(true)
 
        const togglePasswordVisibility= ()=>{
          setPasswordHidden(!isPasswordHidden)
          const passwordInput = document.getElementById('hs-toggle-password');
          if(passwordInput){
            passwordInput.type = isPasswordHidden ? "text" : "password"
          }
        }

        useEffect(()=>{
          if(employeeData.status === "SUCCESS"){
            navigate("/employees")
          }
        },[employeeData])
  return (
    <div className=''>
    <div className="mt-10 ">
  <div className=" flex justify-center">
   
  </div>
  <div className="bg-white rounded-lg shadow-lg  sm:rounded-lg sm:max-w-5xl mt-8 mx-auto">
    <h3 className="text-gray-700 text-base text-center bg-gray-100 font-medium sm:text-xl p-2 rounded-t-lg uppercase"> Add Employee </h3>
    <form className="space-y-6 mx-8 sm:mx-2  p-4 py-6" onSubmit={handleSubmit(onSubmit)}  >
      <div className="sm:flex space-y-6 sm:space-y-0 justify-between gap-10">
      <div className="w-full">
        <label className="font-medium">User Name</label>
        <input 
        {...register('userName', { required: true })}
          type="text"
          className="w-full mt-2  px-5 py-2 text-gray-500 border-slate-300 bg-transparent outline-none border focus:border-teal-400 shadow-sm rounded-lg"
        />
         {errors.userName && (
                <span className="text-red-500">
                  User Name is required
                </span>
              )}
      </div>
      <div className="w-full">
        <label className="font-medium">Employee Type</label>
        <Controller 
                                  control={control}
                                  name="selectedRole"
                                  render={({ field }) => (
                                      <Select
                                          value={field.value}
                                          options={[{ value: "EMPLOYEE_SALES", label: "Sales" },{ value: "EMPLOYEE_REMINDER", label: "Reminder" }]}
                                          onChange={(selectedOption) => field.onChange(selectedOption)}
                                          className="mt-2 "
                                          placeholder="Choose Employee Type "
                                         
                                          styles={{
                                              control: (provided) => ({
                                                  ...provided,
                                                  border: '1px solid #CBD5E1', // Set custom border style
                                                  borderRadius: '0.400rem', // Set custom border radius
                                                  height: '40px', // Add height here
                                              }),
                                              placeholder: (provided) => ({
                                                  ...provided,
                                                  color: '#9CA3AF', // Set custom placeholder color
                                              }),
                                          }}

                                      />
                                 )}
                                  rules={{ required: true }}
                                  
                              />
         {errors.selectedRole && (
                <span className="text-red-500">
                  Role is required
                </span>
              )}
      </div>
   
     
        </div>

        
      <div className="sm:flex space-y-6 sm:space-y-0 justify-between gap-10">  <div className="w-full">
        <label className="font-medium">Email </label>
        <input 
        {...register('email', { required: true })}
          type="email"
          className="w-full mt-2  px-5 py-2 text-gray-500 border-slate-300 bg-transparent outline-none border focus:border-teal-400 shadow-sm rounded-lg"
        />
         {errors.email && (
                <span className="text-red-500">
                  Email is required
                </span>
              )}
      </div>
      <div className="w-full">
        <label className="font-medium">Phone Number</label>
        <input 
        {...register('phone', { required: true , 
        pattern: {
          value: /^[0-9]{10}$/,
          message: "Phone number must be numeric and 10 digits",
        }})}
          type="text"
          className="w-full mt-2  px-5 py-2 text-gray-500 border-slate-300 bg-transparent outline-none border focus:border-teal-400 shadow-sm rounded-lg"
        />
         {errors.phone && (
                <span className="text-red-500">
                  {errors.phone.message}
                </span>
              )}
      </div>
      </div>
      <div className="sm:flex space-y-6 sm:space-y-0 justify-between gap-10">
      <div className="w-full">
        <label className="font-medium">Password</label>
        <input 
        {...register('password', { required: true })}
          type="password"
          className="w-full mt-2  px-5 py-2 text-gray-500 border-slate-300 bg-transparent outline-none border focus:border-teal-400 shadow-sm rounded-lg"
        />
         {errors.password && (
                <span className="text-red-500">
                  Password is required
                </span>
              )}
      </div>
      <div className="w-full">
      
        <label className="font-medium">Confirm Password</label>
     <div className='relative'>
        <input 
        {...register("confirmPassword", { 
          required: "Please confirm your password",
          validate: (value) =>
            value === watch("password") || "The passwords do not match",
        })}
        id="hs-toggle-password"
          type="password"
          className="w-full mt-2  px-5 py-2 text-gray-500 border-slate-300 bg-transparent outline-none border focus:border-teal-400 shadow-sm rounded-lg"
        />

<button className="text-gray-400 absolute right-[14px] inset-y-4 my-auto active:text-gray-600"
                       type='button'
                       onClick={togglePasswordVisibility}
                >
                    {
                        isPasswordHidden ? (
                            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>

                        )
                    }
                </button>

        </div>
         {errors.confirmPassword && (
                <span className="text-red-500">
                  {errors.confirmPassword.message}
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

export default CreateEmployee