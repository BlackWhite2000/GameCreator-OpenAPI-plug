const { takeWhile } = OpenAPI.ArrayUtilities

trace(takeWhile([1, 2, 3, 4], x => x > 3))