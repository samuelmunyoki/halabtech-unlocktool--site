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

export const POST = async (req: NextRequest) => {
  const getStatusNumber = (status: string): number | undefined => {
    switch (status) {
      case "Queued":
        return 0;
      case "Processing":
        return 1;
      case "Declined":
        return 2;
      case "Delivered":
        return 3;
      default:
        return undefined;
    }
  };
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
    console.log(rawdata);

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
    // Get the number value for packstatus
    const ps = getStatusNumber(rawdata.action);
    console.log(ps);

    const order = await ordersColl.updateOne(
      { packtxid: rawdata.txid },
      {
        $set: {
          packstatus: ps,
          updatedAt: now,
        },
      }
    );

    await session.commitTransaction();
    const res: ServerResponses = {
      Code: rescode.SUCCESS,
      Message: "Order updated.",
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
