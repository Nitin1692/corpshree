import { connectDatabase } from "@/lib/index";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
    try {
        const {companyId} = await request.json()
        const client = await connectDatabase();
        const db = client.db("drivado");
        const userCollection = db.collection("users");
        const objectId = ObjectId.createFromHexString(companyId);
        const query = {companyId: objectId}
        const users = await userCollection.find(query).toArray();
        return NextResponse.json({ users }, {status: 200});
    } catch (error) {
        console.error("Error fetching employees:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
