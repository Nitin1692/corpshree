import { connectDatabase } from "@/lib/index";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const client = await connectDatabase()
        const db = client.db('drivado')
        const userCollection = db.collection('users')
        const query = { }
        const users = await userCollection.find(query).toArray()
        return NextResponse.json({users},{status: 200})
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}