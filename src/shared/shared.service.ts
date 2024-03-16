import { Injectable } from "@nestjs/common";
import mongoose from "mongoose";

@Injectable()
export class SharedService {
  verifyMongooseID(id: string) {
    return mongoose.Types.ObjectId.isValid(id);
  }
}
