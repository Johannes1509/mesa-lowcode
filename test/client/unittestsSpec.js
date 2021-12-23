//Checking getJsonData() from phases matching the specified json requiered attributes
describe("helloWorld", () => {
  it("returns hello world", () => {
    var actual = helloWorld();
    expect(actual).toBe("hello world");
  });
})

//Checking the code-export communication between client and server