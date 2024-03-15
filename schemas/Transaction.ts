import { z } from "zod";

const TransactionSchema = z.object({
  email: z.string().email({
    message: "Enter your pack email address.",
  }),
  address: z.string().min(1, {
    message: "Enter your USDT address.",
  }),
  txid: z.string().min(1, {
    message: "TxID cannot be empty.",
  }),
});
export default TransactionSchema;
