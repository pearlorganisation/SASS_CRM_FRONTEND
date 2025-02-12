import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../features/actions/product";
import { useNavigate } from "react-router-dom";
import { getAllWebinars } from "../../features/actions/webinarContact";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import FormInput from "../../components/FormInput";
import productLevelService from "../../services/productLevelService";
import tagsService from "../../services/tagsService";
import { Usecase } from "../../utils/extra";
const CreateProduct = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tag: "",
    },
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { productData, isSuccess, isLoading } = useSelector(
    (state) => state.product
  );
  const { userData } = useSelector((state) => state.auth);
  const { webinarData } = useSelector((state) => state.webinarContact);
  const [productLevelData, setProductLevelData] = useState([]);
  const [tagData, setTagData] = useState([]);

  const onSubmit = (data) => {
    const newData = { ...data };
    console.log(newData);
    dispatch(addProduct(newData));
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/products");
    }
  }, [isSuccess]);

  useEffect(() => {
    // dispatch(getAllWebinars(1));
    productLevelService.getProductLevels().then((res) => {
      if (res.success) {
        setProductLevelData(res.data);
      }
    });
    tagsService.getTags({ usecase: Usecase.PRODUCT_TAGGING }).then((res) => {
      if (res.success) {
        setTagData(res.data);
      }
    });
  }, []);

  return (
    <div className="container mx-auto px-4 mt-10">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-lg font-semibold text-center mb-5 bg-gray-100 py-3 rounded-t-lg">
          Add Product
        </h3>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <Controller
                name="name"
                control={control}
                rules={{ required: "Product Name is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Product Name"
                    variant="outlined"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </div>

            {/* Price */}
            <div>
              <FormInput
                name="price"
                label="Price"
                control={control}
                type="number"
                validation={{
                  required: "Price is required",
                }}
              />
            </div>

            {/* Purchase Date */}
            {/* <div>
              <Controller
                name="purchaseDate"
                control={control}
                rules={{ required: "Purchase Date is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="date"
                    label="Purchase Date"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    error={!!errors.purchaseDate}
                    helperText={errors.purchaseDate?.message}
                  />
                )}
              />
            </div> */}

            {/* Webinar */}
            {/* <div>
              <FormControl fullWidth variant="outlined" error={!!errors.webinarName}>
                <InputLabel>Webinar</InputLabel>
                <Controller
                  name="webinarName"
                  control={control}
                  rules={{ required: "Please select a webinar" }}
                  render={({ field }) => (
                    <Select {...field} label="Webinar">
                      <MenuItem value="" disabled>
                        Select a webinar
                      </MenuItem>
                      {webinarData &&
                        webinarData.map((item, index) => (
                          <MenuItem key={index} value={item.csvName}>
                            {item.csvName}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                />
                {errors.webinarName && (
                  <p className="text-red-500 mt-1 text-sm">{errors.webinarName.message}</p>
                )}
              </FormControl>
            </div> */}

            {/* Product Level */}
              <FormControl fullWidth variant="outlined" error={!!errors.level}>
                <InputLabel>Product Level</InputLabel>
                <Controller
                  name="level"
                  control={control}
                  rules={{ required: "Please select a product level" }}
                  render={({ field }) => (
                    <Select {...field} label="Product Level">
                      <MenuItem value="" disabled>
                        Select a level
                      </MenuItem>
                      {productLevelData.map((item) => (
                        <MenuItem key={item._id} value={item.level}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.level && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.level.message}
                  </p>
                )}
              </FormControl>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Tag</InputLabel>
                <Controller
                  name="tag"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select {...field} label="Tag">
                      <MenuItem value="" disabled>
                        Select a tag
                      </MenuItem>
                      {tagData.map((item) => (
                        <MenuItem key={item._id} value={item.name}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>

            {/* Description */}
            <div className="sm:col-span-2">
              <Controller
                name="description"
                control={control}
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Description"
                    variant="outlined"
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className="bg-gradient-to-r from-teal-500 to-blue-600 text-white"
            >
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
