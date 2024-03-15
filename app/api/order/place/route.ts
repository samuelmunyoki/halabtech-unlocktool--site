"use server";
import clientPromise from "@/database/mongodb";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import LoginSchema from "@/schemas/LoginSchema";

type ConnectionStatus = {
  isConnected: boolean;
};
type ServerResponses = {
  Code: rescode;
  Message?: string;
  Data?: any;
};

enum rescode {
  "ERROR",
  "RETRY",
  "SUCCESS",
  "EMPTY",
}

type UserData = z.infer<typeof LoginSchema>;

export const POST = async (req: NextRequest) => {
  const getConnectionStatus = async (): Promise<ConnectionStatus> => {
    try {
      await clientPromise;
      return { isConnected: true };
    } catch (error) {
      return { isConnected: false };
    }
  };
  const session = (await clientPromise).startSession();
  try {
    const dbStatus: ConnectionStatus = await getConnectionStatus();
    const rawdata = await req.json(); // Parse the request body as JSON

    if (!dbStatus.isConnected) {
      const res: ServerResponses = {
        Code: rescode.ERROR,
        Message: "Failed to connect to the database.",
      };
      return NextResponse.json(res, { status: 500 });
    }

    session.startTransaction();

    const ordersColl = (await clientPromise)
      .db("unlocktooltest")
      .collection("orders");
    const now = new Date();
    var order = await ordersColl.insertOne({
      packid: rawdata.Id,
      packstatus: 0,
      packtitle: rawdata.Title,
      packprice: rawdata.Price,
      userid: rawdata.userid,
      packemail: rawdata.email,
      packtxid: rawdata.txid,
      packaddr: rawdata.address,
      createdAt: now,
      updatedAt: now,
    });

    await session.commitTransaction();
    const res: ServerResponses = {
      Code: rescode.SUCCESS,
      Message: "Order created.",
      Data: order,
    };
    return NextResponse.json(res, {
      status: 200,
    });
  } catch (error) {
    session.abortTransaction();
    console.error("An error occurred:", error);
    const res: ServerResponses = {
      Code: rescode.ERROR,
      Message: "An unexpected error occurred.",
    };
    return NextResponse.json(res, { status: 200 });
  } finally {
    await session.endSession();
  }
};
