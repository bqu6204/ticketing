import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

jest.mock("../nats-wrapper.ts");

process.env.STRIPE_KEY = "sk_test_4eC39HqLyjWDarjtT1zdp7dc";

let mongo: any;

// Run before all the tests start ,
// to make sure to create a new mongo-db instance through mongodb-memory-server.
beforeAll(async () => {
  process.env.JWT_KEY = "test";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

// Run before each test start ,
// delete all collections in mongo
beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// Run after all tests are complete,
afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }

  await mongoose.connection.close();
});
