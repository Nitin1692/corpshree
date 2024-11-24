import { connectDatabase } from "@/lib/index";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const client = await connectDatabase()
        const db = client.db('drivado')
        const companyCollection = db.collection('company')
        const query = { }
        const companies = await companyCollection.find(query, {projection: {name: 1,_id: 1}}).toArray()
        return NextResponse.json({companies}, {status: 200})
    } catch (error) {
        console.error("Error fetching company:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}