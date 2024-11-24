import { connectDatabase } from "@/lib/index";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        if (!id) {
            return NextResponse.json({ error: "Company ID is required" }, { status: 400 });
        }

        const client = await connectDatabase();
        const db = client.db('drivado');
        const companyCollection = db.collection('company');
        const result = await companyCollection.deleteOne({ _id: ObjectId.createFromHexString(id) });
        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Company not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Company Deleted Successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting company:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
