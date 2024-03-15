"use server";
import clientPromise from "@/database/mongodb";
import { z } from "zod";
import RegistrationSchema from "@/schemas/RegistrationSchema";
import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/passwordhash";
// import { ServerResponses, rescode } from "@/types/Responses";

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

type UserData = z.infer<typeof RegistrationSchema>;

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
    const userdata: UserData = RegistrationSchema.parse(rawuserdata);

    if (dbStatus.isConnected) {
      const session = (await clientPromise).startSession();
      try {
        session.startTransaction();
        const userColl = (await clientPromise)
          .db("unlocktooltest")
          .collection("users");
        const userfind = await userColl.findOne({
          emailaddress: userdata.emailaddress,
        });
        if (userfind != null) {
          const res: ServerResponses = {
            Code: rescode.RETRY,
            Message: "Email already registered.",
          };
          return NextResponse.json(res, {
            status: 200,
          });
        }
        // Hash the password before saving
        const hashedPassword = await hashPassword(userdata.password);
        // Create the new user
        // Add timestamps manually
        const now = new Date();
        await userColl.insertOne({
          fullname: userdata.fullname,
          emailaddress: userdata.emailaddress,
          password: hashedPassword,
          isadmin: false,

          createdAt: now,
          updatedAt: now,
        });

        await session.commitTransaction();
        const res: ServerResponses = {
          Code: rescode.SUCCESS,
          Message: "Account created. Verify your email.",
        };
        return NextResponse.json(res, {
          status: 200,
        });
      } catch (error) {
        await session.abortTransaction();
        const res: ServerResponses = {
          Code: rescode.RETRY,
          Message: "Something went wrong. Try again",
        };
        return NextResponse.json(res, {
          status: 200,
        });
      } finally {
        await session.endSession();
      }
    }

    const res: ServerResponses = {
      Code: rescode.ERROR,
      Message: "Something went wrong. Server error!",
    };
    return NextResponse.json(res, {
      status: 200,
    });
  } catch (error) {
    const res: ServerResponses = {
      Code: rescode.ERROR,
      Message: "Something went wrong. Server error!",
    };
    return NextResponse.json(res, {
      status: 200,
    });
  }
};
