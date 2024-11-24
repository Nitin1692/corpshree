import { connectDatabase } from "@/lib/index";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PUT(request: Request) {
    try {
        const { id, name, email, phone, bio } = await request.json();
        if (!id) {
            return NextResponse.json({ error: "Company ID is required" }, { status: 400 });
        }
        const updateData: Record<string, string> = {};
        if (name !== null && name !== undefined) updateData.name = name;
        if (email !== null && email !== undefined) updateData.email = email;
        if (phone !== null && phone !== undefined) updateData.phone = phone;
        if (bio !== null && bio !== undefined) updateData.bio = bio;
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
        }
        const client = await connectDatabase();
        const db = client.db('drivado');
        const companyCollection = db.collection('company');
        const result = await companyCollection.updateOne(
            { _id: ObjectId.createFromHexString(id) },
            { $set: updateData }
        );
        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Company not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Company Updated Successfully" },{status: 200});
    } catch (error) {
        console.error("Error updating company:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
