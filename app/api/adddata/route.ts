import { NextResponse } from "next/server";
import { connectDatabase } from "@/lib/index";
import axios from "axios";
import { ObjectId } from "mongodb";

interface Company {
    id: string;
    companyName: string;
    email: string;
    mobileNumber: string;
}

interface User {
    name: string;
    email: string;
    mobileNumber: string;
    companyId?: string;
}

export async function GET() {
    try {
        const client = await connectDatabase();
        const db = client.db('drivado');
        const companyResponse = await axios.get<Company[]>('https://673736a9aafa2ef222330e54.mockapi.io/company');
        const companies = companyResponse.data;
        const userResponse = await axios.get<User[]>('https://673736a9aafa2ef222330e54.mockapi.io/users');
        const users = userResponse.data;
        const companyCollection = db.collection('company');
        const userCollection = db.collection('users');
        const companyInsertResults = await companyCollection.insertMany(
            companies.map((company) => ({
                name: company.companyName,
                email: company.email,
                phone: company.mobileNumber
            }))
        );
        const companyIdMap = companies.reduce((acc: Record<string, ObjectId>, company, index) => {
            acc[company.id] = companyInsertResults.insertedIds[index];
            return acc;
        }, {});
        const transformedUsers = users.map((user) => ({
            name: user.name,
            email: user.email,
            phone: user.mobileNumber,
            companyId: user.companyId ? companyIdMap[user.companyId] : null,
        }));
        await userCollection.insertMany(transformedUsers);
        return NextResponse.json({ message: 'Data inserted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error in fetching and adding data:', error);
        return NextResponse.json({ message: 'Error in inserting data' }, { status: 500 });
    }
}
