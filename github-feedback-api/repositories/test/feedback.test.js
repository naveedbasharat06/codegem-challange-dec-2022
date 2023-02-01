const request = require('supertest')
const baseURL='http://localhost:3000'

describe('get Today CheckIn Count', () => {
  it('Test Current Streak and Check IN Cunt', async () => {
    const res = await request(baseURL).get('/check_in_status')
    console.log("body", res.body)
    expect(res.statusCode).toEqual(200)
    expect(res.body.currentStreak>=1).toBe(true);
  })
})

describe('Post Endpoints', () => {
  it('should create a new Feedback Mod', async () => {
    const res = await request(baseURL)
      .post('/feedback')
      .send({
        moods: [3],
        tags: [5,6,7],
        feedback:"Test Learning Mood Feedback",
        source:"http://localhost"
      })
    expect(res.statusCode).toEqual(201)
  })
})
