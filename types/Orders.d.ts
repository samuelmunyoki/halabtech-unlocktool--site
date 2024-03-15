type Order = {
  id: string;
  packid: string;
  packstatus: number;
  packtitle: string;
  packprice: string;
  packemail: string;
  userid: string;
};
export const columns: ColumnDef<Orders>[] = [
  {
    accessorKey: "id",
    header: "OrderID",
  },
  {
    accessorKey: "userid",
    header: "User ID",
  },
  {
    accessorKey: "packstatus",
    header: "Status",
  },
];
