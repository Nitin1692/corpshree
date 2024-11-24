import { connectDatabase } from "@/lib/index";
import { NextResponse } from "next/server";
import Company from "@/models/company";

export async function POST(request: Request) {
    try {
        const {name,email,phone,bio} = await request.json()
        const client = await connectDatabase()
        const db = client.db('drivado')
        const companyCollection = db.collection('company')
        const companyData = new Company(name,email,bio,phone)
        await companyCollection.insertOne(companyData)
        return NextResponse.json({message: 'Company Created'}, {status: 200})
    } catch (error) {
        console.error("Error inserting company:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}