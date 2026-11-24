import request from "supertest"
import { app } from "../../src/app.js"
import { db } from "../../src/db/db.js"

const validOilTest = {
  date: "2026-11-24",
  results: [{ testId: "flashPoint", value: 42 }],
}

describe("calc-x API", () => {
  beforeEach(() => {
    db.oilTests.length = 0
  })

  it("creates and returns an oil test", async () => {
    const createResponse = await request(app).post("/calc-x/results").send(validOilTest).expect(201)

    const id: string = createResponse.body.data.id

    await request(app)
      .get(`/calc-x/results/${id}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.data).toEqual({
          id,
          ...validOilTest,
        })
      })
  })

  it("rejects an invalid request body", async () => {
    await request(app)
      .post("/calc-x/results")
      .send({})
      .expect(400)
      .expect(({ body }) => {
        expect(body.errors).toEqual(expect.any(Array))
      })
  })

  it("updates and deletes an oil test", async () => {
    const createResponse = await request(app).post("/calc-x/results").send(validOilTest).expect(201)

    const id: string = createResponse.body.data.id

    await request(app)
      .patch(`/calc-x/results/${id}`)
      .send({ date: "2026-11-25" })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.date).toBe("2026-11-25")
      })

    await request(app).delete(`/calc-x/results/${id}`).expect(204)
    await request(app).get(`/calc-x/results/${id}`).expect(404)
  })
})
