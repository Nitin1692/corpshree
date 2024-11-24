import { connectDatabase } from "@/lib/index";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
    try {
        const {id} = await request.json()
        const client = await connectDatabase()
        const db = client.db('drivado')
        const companyCollection = db.collection('company')
        const query = { _id: ObjectId.createFromHexString(id) }
        const companies = await companyCollection.findOne(query)
        return NextResponse.json({companies}, {status: 200})
    } catch (error) {
        console.error("Error fetching company:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}