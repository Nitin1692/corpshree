import { connectDatabase } from "@/lib/index";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import User from "@/models/user";

export async function POST(request: Request) {
    try {
        const {Id,name,email,bio,phone} = await request.json();
        const client = await connectDatabase()
        const db = client.db('drivado')
        const userCollection = db.collection('users')
        const companyId = ObjectId.createFromHexString(Id)
        const userData = new User(name,email,bio,phone,companyId)
        await userCollection.insertOne(userData)
        return NextResponse.json({message: 'User Created'}, {status: 200})
    } catch (error) {
        console.error("Error inserting user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}