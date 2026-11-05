import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaEnvelope, FaUserAlt, FaStore, FaCalendarAlt, FaInfoCircle, FaLeaf, FaClipboardCheck, FaImage, FaMoneyBillWave, FaStickyNote } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { toast } from "react-toastify";

const AddProduct = () => {
  const { register, handleSubmit, control, setValue, watch, reset } = useForm({
    defaultValues: {
      date: new Date(),
      prices: [{ date: new Date().toISOString().split('T')[0], price: '' }],
      status: 'pending'
    }
  });

  const { user } = useAuth()


  const axiosSecure = useAxiosSecure();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'prices'
  });

  const onSubmit = async (data) => {

    axiosSecure.post('/products', data).then(res => {
      if (res.data.insertedId) {
        toast.success("Product Added successfully!");
        reset();
      } else {
        toast.error("Submission failed. Please try again.");
      }
    })
    // try {
    //   console.log(data);

    //   const res = await axiosSecure.post('/products', data)
    //   console.log(res.data);

    //   if (res.data.insertedId) {
    //     toast.success("Advertisement submitted successfully!");
    //     reset();
    //   } else {
    //     toast.error("Submission failed. Please try again.");
    //   }
    // }
    // catch (err) {
    //   console.error("Submit error:", err);
    //   toast.error("Something went wrong while submitting.");
    // }
  };

  const selectedDate = watch('date');

  const inputFocusClasses = "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150";

  return (
    <div className=" p-4 sm:p-6 bg-white rounded-lg ">
      <h2 className="text-2xl md:text-4xl font-bold mb-6 text-center">Add Product</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

        {/* Vendor Email (read-only) */}
        <label className="form-control">
          <div className="label">
            <span className="label-text flex items-center gap-2">
              <FaEnvelope /> Vendor Email
            </span>
          </div>
          <input
            type="email"
            readOnly
            {...register('vendorEmail')}
            defaultValue={user.email}
            className={`input input-bordered w-full ${inputFocusClasses}`}
          />
        </label>

        {/* Vendor Name */}
        <label className="form-control">
          <div className="label">
            <span className="label-text flex items-center gap-2">
              <FaUserAlt /> Vendor Name
            </span>
          </div>
          <input
            type="text"
            {...register('vendorName')}
            className={`input input-bordered w-full ${inputFocusClasses}`}
          />
        </label>

        {/* Market Name */}
        <label className="form-control">
          <div className="label">
            <span className="label-text flex items-center gap-2">
              <FaStore /> Market Name
            </span>
          </div>
          <input
            type="text"
            {...register('marketName', { required: true })}
            className={`input input-bordered w-full ${inputFocusClasses}`}
          />
        </label>

        {/* Date */}
        <label className="form-control">
          <div className="label">
            <span className="label-text flex items-center gap-2">
              <FaCalendarAlt /> Date
            </span>
          </div>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setValue('date', date)}
            dateFormat="dd-MM-yyyy"
            className={`input input-bordered w-full ${inputFocusClasses}`}
            placeholderText="Select date"
            wrapperClassName="w-full"
          />
        </label>

        {/* Market Description */}
        <label className="form-control md:col-span-2">
          <div className="label">
            <span className="label-text flex items-center gap-2">
              <FaInfoCircle /> Market Description
            </span>
          </div>
          <textarea
            {...register('marketDescription')}
            className={`textarea textarea-bordered w-full ${inputFocusClasses}`}
            rows={3}
          ></textarea>
        </label>

        {/* Item Name */}
        <label className="form-control">
          <div className="label">
            <span className="label-text flex items-center gap-2">
              <FaLeaf /> Item Name
            </span>
          </div>
          <input
            type="text"
            {...register('itemName', { required: true })}
            className={`input input-bordered w-full ${inputFocusClasses}`}
          />
        </label>

        {/* Status */}
        <label className="form-control">
          <div className="label">
            <span className="label-text flex items-center gap-2">
              <FaClipboardCheck /> Status
            </span>
          </div>
          <input
            type="text"
            readOnly
            {...register('status')}
            className={`input input-bordered w-full ${inputFocusClasses}`}
          />
        </label>

        {/* Product Image */}
        <label className="form-control">
          <div className="label">
            <span className="label-text flex items-center gap-2">
              <FaImage /> Product Image URL
            </span>
          </div>
          <input
            type="text"
            {...register('imageUrl')}
            className={`input input-bordered w-full ${inputFocusClasses}`}
          />
        </label>

        {/* Price per Unit */}
        <label className="form-control">
          <div className="label">
            <span className="label-text flex items-center gap-2">
              <FaMoneyBillWave /> Price per Unit (e.g., ৳30/kg)
            </span>
          </div>
          <input
            type="text"
            {...register('pricePerUnit')}
            className={`input input-bordered w-full ${inputFocusClasses}`}
          />
        </label>

        {/* Price and Date Array */}
        <div className="form-control md:col-span-2 ">
          <div className="label mr-4">
            <span className="label-text flex items-center gap-2">
              <FaMoneyBillWave /> Price and Date Entries
            </span>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col sm:flex-row gap-2 mb-2 items-center">
              <input
                type="date"
                {...register(`prices.${index}.date`)}
                className={`input input-bordered w-full sm:w-1/3 ${inputFocusClasses}`}
                defaultValue={field.date}
              />
              <input
                type="number"
                {...register(`prices.${index}.price`)}
                placeholder="Price"
                className={`input input-bordered w-full sm:w-1/3 ${inputFocusClasses}`}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="btn btn-error btn-sm w-full sm:w-auto"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ date: new Date().toISOString().split('T')[0], price: '' })}
            className="btn btn-outline btn-sm mt-2"
          >
            ➕ Add Price
          </button>
        </div>

        {/* Item Description */}
        <label className="form-control md:col-span-2">
          <div className="label">
            <span className="label-text flex items-center gap-2">
              <FaStickyNote /> Item Description
            </span>
          </div>
          <textarea
            {...register('itemDescription')}
            className={`textarea textarea-bordered w-full ${inputFocusClasses}`}
            rows={3}
          ></textarea>
        </label>

        {/* Submit */}
        <div className="form-control md:col-span-2">
          <button type="submit" className="btn btn-primary w-full">
            Submit Item
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
