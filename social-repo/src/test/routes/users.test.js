const request = require("supertest");
const buildApp = require("../../app");
const UserRepo = require("../../repos/user-repo");
const pool = require("../../pool");
const Context = require("../context");
let context;
//Building a schema so test can be run independently of future tests, all three tests, all 3 are posts, but are configured
//to run independently to remove any threat of data corruption.
beforeAll(async () => {
  context = await Context.build();
});

afterAll(() => {
  return context.close();
});
beforeEach(async () => {
  await context.reset();
});

it("create a user", async () => {
  const startingCount = await UserRepo.count();

  await request(buildApp())
    .post("/users")
    .send({ username: "testuser1", bio: "test bio1" })
    .expect(200);

  const finishCount = await UserRepo.count();
  expect(finishCount - startingCount).toEqual(1);
});
