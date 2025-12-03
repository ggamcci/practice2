import { prisma } from "../db";

export class BaseService {
  protected db = prisma;
}
