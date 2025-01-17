import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  Grid,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import defaultPhoto from "/placeholder.jpg";
import { MdOutlineInsertPhoto } from "react-icons/md";
import {
  createGlobalData,
  getGlobalData,
} from "../../../features/actions/globalData";
import FormInput from "../../../components/FormInput";
import { ClipLoader } from "react-spinners";

const LandingPageForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
  } = useForm();
  const [photo, setPhoto] = useState(null);
  const [selectedType, setSelectedType] = useState("image");
  const [isControlsVisible, setIsControlsVisible] = useState(false);

  const { landingGlobalData, isLoading } = useSelector(
    (state) => state.globalData
  );
  // console.log('landingGlobalData', landingGlobalData)
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    if (data["file"]) data["file"] = data["file"][0];
    else data["file"] = null;
    data["videoControls"] = isControlsVisible;
    console.log(data);
    dispatch(createGlobalData(data));
  };

  const handlePhotoChange = (e) => {
    const selectedPhoto = e.target.files[0];
    if (selectedPhoto) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedPhoto);
      reader.onloadend = () => setPhoto(reader.result);
    }
  };
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setPhoto(null); // Reset the photo preview
    setValue("file", null); // Reset the file in the form
  };

  useEffect(() => {
    dispatch(getGlobalData());
  }, []);

  useEffect(() => {
    if (landingGlobalData) {
      reset({
        title: landingGlobalData.title,
        subTitle: landingGlobalData.subTitle,
        mediaType: landingGlobalData.mediaType,
        file: null,
        videoControls: landingGlobalData.videoControls,
        buttonName: landingGlobalData.buttonName,
        link: landingGlobalData.link,
        buttonHeight: landingGlobalData.buttonHeight,
        buttonWidth: landingGlobalData.buttonWidth,
      });
    }
  }, [landingGlobalData]);

  return (
    <div className="pt-20 px-4 max-w-5xl mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white shadow-md p-6 rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center md:text-left">
          Landing Page Data
        </h2>

        {/* Title & Subtitle */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormInput
              name="title"
              label="Heading"
              control={control}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormInput
              name="subTitle"
              label="Sub Heading"
              control={control}
            />
          </Grid>
        </Grid>

        {/* Media Type Selection */}
        <div>
          <h3 className="font-medium mb-2">Landing Page Media Type</h3>
          <RadioGroup row value={selectedType} onChange={handleTypeChange}>
            <FormControlLabel value="image" control={<Radio />} label="Image" />
            <FormControlLabel value="video" control={<Radio />} label="Video" />
          </RadioGroup>
        </div>

        {/* Media Preview & Upload */}
        <div className="flex flex-wrap gap-4 items-start">
          {selectedType === "image" ? (
            <img
              src={photo || defaultPhoto}
              alt="Preview"
              className="w-44 h-36 object-cover rounded border"
            />
          ) : (
            <video
              src={photo || ""}
              poster={defaultPhoto}
              className="w-44 h-36 object-cover rounded border"
              muted
              autoPlay
              loop
              controls={isControlsVisible}
            />
          )}

          <div className="space-y-2">
            <label
              htmlFor="file_input"
              className="flex items-center gap-2 cursor-pointer"
            >
              <MdOutlineInsertPhoto size={24} />
              <span className="px-4 py-2 border rounded-md hover:bg-blue-500 hover:text-white">
                Upload {selectedType === "image" ? "Image" : "Video"}
              </span>
            </label>
            <input
              {...register("file", {
                // required: `Landing Page ${
                //   selectedType === "image" ? "Image" : "Video"
                // } is required`,
                onChange: handlePhotoChange,
              })}
              id="file_input"
              type="file"
              className="hidden"
            />
            {errors.file && (
              <span className="text-sm text-red-500">
                {errors.file.message}
              </span>
            )}
          </div>
        </div>

        {/* Button & Link */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormInput
              name="buttonName"
              label="Button Name"
              control={control}
              validation={{
                validate: (value) => {
                  // No validation for buttonName, always valid
                  return true;
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormInput
              name="link"
              label="Button Link"
              control={control}
              validation={{
                validate: (value, context) => {
                  if (context.buttonName) {
                    return value
                      ? true
                      : "Link is required when Button Name is present";
                  }
                  return true; // No validation required if buttonName is not present
                },
              }}
            />
          </Grid>
        </Grid>

        {/* Video Dimensions */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormInput
              name="buttonHeight"
              label="Height (px)"
              control={control}
              type="number"
              validation={{
                validate: (value, context) => {
                  if (context.buttonName) {
                    return value
                      ? true
                      : "Height is required when Button Name is present";
                  }
                  return true; // No validation required if buttonName is not present
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormInput
              name="buttonWidth"
              label="Width (px)"
              control={control}
              type="number"
              validation={{
                validate: (value, context) => {
                  if (context.buttonName) {
                    return value
                      ? true
                      : "Width is required when Button Name is present";
                  }
                  return true; // No validation required if buttonName is not present
                },
              }}
            />
          </Grid>
        </Grid>

        {/* Video Controls */}
        {selectedType === "video" && (
          <FormControlLabel
            control={
              <Checkbox
                checked={isControlsVisible}
                onChange={(e) => setIsControlsVisible(e.target.checked)}
              />
            }
            label="Show Video Controls"
          />
        )}

        {/* Submit Button */}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          {isLoading ? (
            <ClipLoader size={20} color="#fff" />
          ) : (
            "Update Landing Page"
          )}
        </Button>
      </form>
    </div>
  );
};

export default LandingPageForm;
