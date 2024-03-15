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

export const GET = async (req: NextRequest) => {
  const getConnectionStatus = async (): Promise<ConnectionStatus> => {
    try {
      await clientPromise;
      return { isConnected: true };
    } catch (error) {
      return { isConnected: false };
    }
  };
  try {
    const dbStatus: ConnectionStatus = await getConnectionStatus();

    if (!dbStatus.isConnected) {
      const res: ServerResponses = {
        Code: rescode.ERROR,
        Message: "Failed to connect to the database.",
      };
      return NextResponse.json(res, { status: 500 });
    }

    const ordersColl = (await clientPromise)
      .db("unlocktooltest")
      .collection("orders");
    const orderfind = await ordersColl.find().sort({ createdAt: -1 }).toArray();

    if (!orderfind.length) {
      const res: ServerResponses = {
        Code: rescode.EMPTY,
        Message: "You have no orders.",
      };
      return NextResponse.json(res, { status: 200 });
    }
    if (orderfind.length < 1) {
      const res: ServerResponses = {
        Code: rescode.EMPTY,
        Message: "You have no orders.",
        Data: orderfind,
      };
      return NextResponse.json(res, { status: 200 });
    }
    const res: ServerResponses = {
      Code: rescode.SUCCESS,
      Message: "Orders",
      Data: orderfind,
    };
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error("An error occurred:", error);
    const res: ServerResponses = {
      Code: rescode.ERROR,
      Message: "An unexpected error occurred.",
    };
    return NextResponse.json(res, { status: 200 });
  }
};

export const POST = async (req: NextRequest) => {
  const getConnectionStatus = async (): Promise<ConnectionStatus> => {
    try {
      await clientPromise;
      return { isConnected: true };
    } catch (error) {
      return { isConnected: false };
    }
  };
  try {
    const dbStatus: ConnectionStatus = await getConnectionStatus();
    const rawuserid = await req.json(); // Parse the request body as JSON
    console.log("User ID", rawuserid);

    if (!dbStatus.isConnected) {
      const res: ServerResponses = {
        Code: rescode.ERROR,
        Message: "Failed to connect to the database.",
      };
      return NextResponse.json(res, { status: 500 });
    }

    const ordersColl = (await clientPromise)
      .db("unlocktooltest")
      .collection("orders");
    const orderfind = await ordersColl
      .find({
        userid: rawuserid.userid,
      })
      .sort({ createdAt: -1 })
      .toArray();

    if (!orderfind.length) {
      const res: ServerResponses = {
        Code: rescode.EMPTY,
        Message: "You have no orders.",
      };
      return NextResponse.json(res, { status: 200 });
    }
    if (orderfind.length < 1) {
      const res: ServerResponses = {
        Code: rescode.EMPTY,
        Message: "You have no orders.",
        Data: orderfind,
      };
      return NextResponse.json(res, { status: 200 });
    }
    const res: ServerResponses = {
      Code: rescode.SUCCESS,
      Message: "Orders",
      Data: orderfind,
    };
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error("An error occurred:", error);
    const res: ServerResponses = {
      Code: rescode.ERROR,
      Message: "An unexpected error occurred.",
    };
    return NextResponse.json(res, { status: 200 });
  }
};
