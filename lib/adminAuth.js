import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";
import connectDB from "./mongodb";
import User from "@/models/User";

export async function isAdmin(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return false;
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    
    return user && user.role === "admin";
  } catch (error) {
    console.error("Admin check error:", error);
    return false;
  }
}

export async function requireAdmin(request) {
  const admin = await isAdmin(request);
  
  if (!admin) {
    throw new Error("Unauthorized: Admin access required");
  }
  
  return true;
}
