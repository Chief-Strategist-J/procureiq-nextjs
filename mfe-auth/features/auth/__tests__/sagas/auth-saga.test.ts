import { executeSaga, runLoginSaga, runSignupSaga } from "../../sagas/auth-saga"

describe("Auth Saga Engine", () => {
  it("executes all saga steps sequentially when successful", async () => {
    const executedSteps: string[] = []

    const result = await executeSaga("TestSaga", [
      {
        id: "step1",
        name: "Step 1",
        execute: async () => {
          executedSteps.push("step1")
          return "result1"
        },
      },
      {
        id: "step2",
        name: "Step 2",
        execute: async () => {
          executedSteps.push("step2")
          return "result2"
        },
      },
    ])

    expect(executedSteps).toEqual(["step1", "step2"])
    expect(result).toBe("result2")
  })

  it("triggers compensating transactions in reverse order when a step fails", async () => {
    const compensations: string[] = []

    await expect(
      executeSaga("FailingSaga", [
        {
          id: "step1",
          name: "Step 1",
          execute: async () => "step1_ok",
          compensate: async () => {
            compensations.push("compensate_step1")
          },
        },
        {
          id: "step2",
          name: "Step 2",
          execute: async () => {
            throw new Error("Simulated failure in step 2")
          },
        },
      ])
    ).rejects.toThrow("Simulated failure in step 2")

    expect(compensations).toEqual(["compensate_step1"])
  })

  it("runs runLoginSaga successfully for valid credentials", async () => {
    const result = await runLoginSaga({ username: "testuser", password: "password123" })
    expect(result).toHaveProperty("permissions")
  })

  it("fails runSignupSaga if passwords do not match", async () => {
    await expect(
      runSignupSaga({
        username: "newuser",
        email: "new@procureiq.com",
        password: "pass1",
        confirmPassword: "pass2",
      })
    ).rejects.toThrow("Passwords do not match.")
  })
})
