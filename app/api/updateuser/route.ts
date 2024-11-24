import { connectDatabase } from "@/lib/index";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PUT(request: Request) {
    try {
        const { id, email, phone, bio, companyId } = await request.json();
        if (!id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }
        const updateData: Record<string,ObjectId> = {};
        if (email !== null && email !== undefined) updateData.email = email;
        if (phone !== null && phone !== undefined) updateData.phone = phone;
        if (bio !== null && bio !== undefined) updateData.bio = bio;
        if (companyId !== null && companyId !== undefined) updateData.companyId = ObjectId.createFromHexString(companyId)
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
        }
        const client = await connectDatabase();
        const db = client.db('drivado');
        const userCollection = db.collection('users');
        const result = await userCollection.updateOne(
            { _id: ObjectId.createFromHexString(id) },
            { $set: updateData }
        );
        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "User Updated Successfully" },{status: 200});
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
