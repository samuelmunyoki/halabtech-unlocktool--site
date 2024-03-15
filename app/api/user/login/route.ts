"use server";
import clientPromise from "@/database/mongodb";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { comparePasswords } from "@/lib/passwordhash";
import LoginSchema from "@/schemas/LoginSchema";
import { UserLoginDetails } from "@/store/UserStore";

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
  try {
    const dbStatus: ConnectionStatus = await getConnectionStatus();
    const rawuserdata = await req.json(); // Parse the request body as JSON
    const userdata: UserData = LoginSchema.parse(rawuserdata);

    if (!dbStatus.isConnected) {
      const res: ServerResponses = {
        Code: rescode.ERROR,
        Message: "Failed to connect to the database.",
      };
      return NextResponse.json(res, { status: 500 });
    }

    const userColl = (await clientPromise)
      .db("unlocktooltest")
      .collection("users");
    const userfind = await userColl.findOne({
      emailaddress: userdata.emailaddress,
    });

    if (!userfind) {
      const res: ServerResponses = {
        Code: rescode.RETRY,
        Message: "Invalid email or password credentials.",
      };
      return NextResponse.json(res, { status: 200 });
    }

    const isPasswordMatch = await comparePasswords(
      userdata.password,
      userfind.password
    );

    if (!isPasswordMatch) {
      const res: ServerResponses = {
        Code: rescode.RETRY,
        Message: "Invalid email or password credentials.",
      };
      return NextResponse.json(res, { status: 200 });
    }
    const logindata: UserLoginDetails = {
      id: userfind._id.toString(),
      emailaddress: userdata.emailaddress,
      fullname: userfind.fullname,
      isadmin: userfind.isadmin,
    };
    const res: ServerResponses = {
      Code: rescode.SUCCESS,
      Message: "Logging in...",
      Data: logindata,
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
