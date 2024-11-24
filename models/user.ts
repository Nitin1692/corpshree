import { ObjectId } from "mongodb";

export default class User{
    constructor(public name: string,public email: string,public bio: string,public phone: string,public companyId: ObjectId) {}
}