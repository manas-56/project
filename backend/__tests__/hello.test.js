jest.config.js:
{
  "testEnvironment": "node",
  "verbose": true
}

__tests__/hello.test.js:
test('hello world!', () => {
  expect(1 + 1).toBe(2);
});