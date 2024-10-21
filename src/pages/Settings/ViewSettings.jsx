import React, { useState } from "react";
import { MdAdminPanelSettings, MdOutlineInsertPhoto } from "react-icons/md";
import { PiLinkSimpleBold } from "react-icons/pi";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { roles } from "../../utils/roles";
import { useForm } from "react-hook-form";
import defaultPhoto from "/placeholder.jpg";
import { useDispatch } from "react-redux";
import { createGlobalData } from "../../features/actions/globalData";
const ViewSettings = () => {
  const { role } = useSelector((state) => state.auth.userData);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [photo, setPhoto] = useState(null);
  const [selectedType, setSelectedType] = useState("image"); // State for radio button
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    console.log(data);
    data['file'] = data['file'][0];
    data['fileType'] = selectedType;
    dispatch(createGlobalData(data));

  };

  const handlePhotoChange = (e) => {
    const selectedPhoto = e.target.files[0];

    if (selectedPhoto) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedPhoto);
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
    }
  };

  const handleRadioChange = (e) => {
    console.log(e.target.value);
    setSelectedType(e.target.value);
  };

  return (
    <div className="mt-10 text-center">
      <span className="text-2xl font-bold ">SETTINGS</span>
      <div className="grid grid-cols-3 p-10 justify-items-center gap-10 mt-8 shadow-sm bg-gray-50 mx-10 rounded-lg ">
        <Link
          to="/plans"
          className="flex items-center justify-center gap-10 font-bold text-xl rounded-lg bg-white h-20 w-52 cursor-pointer  hover:bg-green-700 hover:text-white text-green-700"
        >
          <RiMoneyRupeeCircleLine size={40} /> Plans
        </Link>
        {roles.SUPER_ADMIN === role && (
          <Link
            to="/sidebarLinks"
            className="flex items-center justify-center gap-10 font-bold text-xl rounded-lg bg-white h-20 w-56 cursor-pointer hover:bg-blue-600 hover:text-white text-blue-600"
          >
            <PiLinkSimpleBold size={40} /> Sidebar links
          </Link>
        )}
        <div className="flex items-center justify-center gap-10 font-bold text-xl rounded-lg bg-white h-20 w-52 cursor-pointer hover:border-2 hover:border-black-400">
          <GiPerspectiveDiceSixFacesRandom size={40} /> Dummy
        </div>
      </div>
      <div>
        <form
          className="space-y-6 mx-8 sm:mx-2 p-4 py-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h2 className="text-2xl font-bold ">Landing Page Data</h2>
          <div className="sm:flex space-y-6 sm:space-y-0 justify-between gap-10">
            <div className="w-full">
              <label className="font-medium">Heading</label>
              <input
                {...register("title", { required: "Heading is required" })}
                type="text"
                className="w-full mt-2 px-5 py-2 text-gray-500 border-slate-300 bg-transparent outline-none border focus:border-teal-400 shadow-sm rounded-lg"
              />
              {errors?.title && (
                <span className="text-red-500">{errors.title.message}</span>
              )}
            </div>
            <div className="w-full">
              <label className="font-medium">Sub Heading </label>
              <input
                {...register("subTitle", {
                  required: "Sub Heading is required",
                })}
                type="text"
                className="w-full mt-2 px-5 py-2 text-gray-500 border-slate-300 bg-transparent outline-none border focus:border-teal-400 shadow-sm rounded-lg"
              />
              {errors?.subTitle && (
                <span className="text-red-500">{errors.subTitle.message}</span>
              )}
            </div>
          </div>
          <div className="sm:flex space-y-6 sm:space-y-0 justify-between gap-10">
            <div className="font-medium w-fit space-y-6">
              Landing Page {selectedType === 'image' ? 'Image' : 'Video'}
              <div className="flex items-center gap-12">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="image"
                      name="landingPageType"
                      value="image"
                      checked={selectedType === "image"}
                      onChange={handleRadioChange}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="image"
                      className="ml-2 block text-sm font-medium text-gray-700"
                    >
                      Image
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="video"
                      name="landingPageType"
                      value="video"
                      checked={selectedType === "video"}
                      onChange={handleRadioChange}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="video"
                      className="ml-2 block text-sm font-medium text-gray-700"
                    >
                      Video
                    </label>
                  </div>
                </div>
                {selectedType === "image" ? (
                  <img
                    className="mt-2 w-44 object-cover h-36 rounded border"
                    src={photo || defaultPhoto}
                    alt="No Image"
                  />
                ) : (
                  <video
                    className="mt-2 w-44 object-cover h-36 rounded border"
                    src={photo || ""}
                    poster={defaultPhoto}
                    muted
                    autoPlay
                    loop
                  />
                )}
              </div>
              <label htmlFor="file_input" className="flex gap-1 cursor-pointer">
                <MdOutlineInsertPhoto size="25" />
                <div className="px-2 border rounded-md border-slate-300 hover:bg-red-500 hover:text-white hover:border-none">
                  Click here to upload
                </div>
              </label>
              <input
                {...register("file", {
                  required: true,
                  onChange: (e) => {
                    handlePhotoChange(e);
                  },
                })}
                className="hidden"
                id="file_input"
                type="file"
              />
              {errors.file && (
                <span className="text-sm font-medium text-red-500">
                  Landing Page {selectedType === 'image' ? 'Image' : 'Video'} is required
                </span>
              )}
            </div>
          </div>
          

          <div style={{ marginTop: "4rem" }}>
            <button className="w-full btn-grad:hover btn-grad">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ViewSettings;
