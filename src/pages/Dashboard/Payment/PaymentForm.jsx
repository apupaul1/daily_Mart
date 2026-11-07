import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import Loading, { Spinner } from "../../../Shared/Loading/Loading";
import { toast } from "sonner";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { productId } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();


  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState("");
  const [processing, setProcessing] = useState(false);

  const { isPending, data: productInfo = {} } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/product/${productId}`);
      return res.data;
    },
  });

  if (isPending) {
    return (
      <Loading
        variant="section"
        size="md"
        message="Preparing secure checkout"
        description="Fetching the latest price for this product."
        className="min-h-[24rem] rounded-[1.5rem] border border-base-300/60 bg-base-100"
      />
    );
  }

  const amount = productInfo.product.latestPrice * quantity;
  const amountInCents = amount * 100;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || processing) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (!card) {
      return;
    }

    setProcessing(true);

    try {
      const { error: methodError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card,
        });

      if (methodError) {
        setError(methodError.message);
        return;
      }

      setError("");

      const res = await axiosSecure.post("/create-payment-intent", {
        amountInCents,
        productId,
      });

      const clientSecret = res.data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.displayName,
            email: user.email,
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
        return;
      }

      setError("");

      if (result.paymentIntent.status === "succeeded") {
        const paymentData = {
          productId,
          productName: productInfo.product.itemName,
          marketName: productInfo.product.marketName,
          price: productInfo.product.latestPrice,
          email: user.email,
          amount,
          quantity: quantity,
          transactionId: result.paymentIntent.id,
          paymentMethod: result.paymentIntent.payment_method_types,
        };
        const paymentRes = await axiosSecure.post("/payments", paymentData);
        if (paymentRes.data.insertedId) {
          toast.success(`Payment Successful
                    Transaction ID: ${result.paymentIntent.id}`);
          navigate("/dashboard/myorder");
        }
      }
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Payment could not be completed. Please try again.",
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto"
      >
        <label htmlFor="">Enter the quantity (KG)</label>
        <input
          id="quantity"
          className="p-3 border w-full"
          placeholder="eg...1"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <CardElement className="p-2 border rounded"></CardElement>
        <button
          className="btn btn-primary w-full"
          type="submit"
          disabled={!stripe || processing}
        >
          {processing ? (
            <>
              <Spinner size="sm" />
              Processing payment…
            </>
          ) : (
            `Pay ৳ ${amount}`
          )}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
