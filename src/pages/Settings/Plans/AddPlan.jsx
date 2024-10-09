import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'

const AddPlan = () => {
  const {register,handleSubmit,formState: { errors },control}=useForm()

  const onSubmit = data =>{
    }

return (
<div className=''>
<div className="mt-10 ">
<div className=" flex justify-center">

</div>
<div className="bg-white rounded-lg shadow-lg  sm:rounded-lg sm:max-w-5xl mt-8 mx-auto">
<h3 className="text-gray-700 text-base text-center bg-gray-100 font-medium sm:text-xl p-2 rounded-t-lg uppercase"> Add Plan </h3>
<form className="space-y-6 mx-8 sm:mx-2  p-4 py-6" onSubmit={handleSubmit(onSubmit)}  >
  <div className="sm:flex space-y-6 sm:space-y-0 justify-between gap-10">
  <div className="w-full">
    <label className="font-medium">Plan Name</label>
    <input 
    {...register('productName', { required: 'Name is required' })}
      type="text"
      className="w-full mt-2  px-5 py-2 text-gray-500 border-slate-300 bg-transparent outline-none border focus:border-teal-400 shadow-sm rounded-lg"
    />
     {errors.productName && (
            <span className="text-red-500">
              Name of Product is required
            </span>
          )}
  </div>
  <div className="w-full">
    <label className="font-medium">Price </label>
    <input
    {...register('productName', { required: 'Name is required' })}
      type="Number"
      className="w-full mt-2  px-5 py-2 text-gray-500 border-slate-300 bg-transparent outline-none border focus:border-teal-400 shadow-sm rounded-lg"
    />
     {errors.productName && (
            <span className="text-red-500">
              Name of Product is required
            </span>
          )}
  </div>

 
    </div>

    
  <div className="sm:flex space-y-6 sm:space-y-0 justify-between gap-10">
  <div className="w-full">
    <label className="font-medium">Admin Permissions</label>
    <Controller 
                              control={control}
                              name="admin"
                              render={({ field }) => (
                                  <Select
                                      value={field.value}
                                      options={[{ value: "Sales", label: "Dummy1" },{ value: "Reminder", label: "Dummy2" }]}
                                      onChange={(selectedOption) => field.onChange(selectedOption)}
                                      className="mt-2 "
                                      placeholder="Choose Admin Permissions "
                                     isMulti
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
     {errors.brand && (
            <span className="text-red-500">
              Brand is required
            </span>
          )}
  </div>
  <div className="w-full">
    <label className="font-medium">Employee Permissions</label>
    <Controller 
                              control={control}
                              name="employee"
                              render={({ field }) => (
                                  <Select
                                      value={field.value}
                                      options={[{ value: "Sales", label: "Dummy1" },{ value: "Reminder", label: "Dummy2" }]}
                                      onChange={(selectedOption) => field.onChange(selectedOption)}
                                      className="mt-2 "
                                      placeholder="Choose Employee Permissions "
                                     isMulti
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
     {errors.brand && (
            <span className="text-red-500">
              Brand is required
            </span>
          )}
  </div>
  </div>
  <div className="sm:flex space-y-6 sm:space-y-0 justify-between gap-10">
  <div className="w-[48%]">
    <label className="font-medium">Plan Expiry</label>
    <input 
    {...register('productName', { required: 'Name is required' })}
      type="Number"
      className="w-full mt-2  px-5 py-2 text-gray-500 border-slate-300 bg-transparent outline-none border focus:border-teal-400 shadow-sm rounded-lg"
    />
     {errors.productName && (
            <span className="text-red-500">
              Name of Product is required
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

export default AddPlan