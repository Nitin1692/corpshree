import { connectDatabase } from "@/lib/index";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function DELETE(request: Request) {
    try {
        const {id} = await request.json()
        if (!id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }
        const client = await connectDatabase();
        const db = client.db('drivado');
        const userCollection = db.collection('users');
        await userCollection.deleteOne({_id: ObjectId.createFromHexString(id)})
        return NextResponse.json({ message: "User Deleted Successfully" },{status: 200});
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}