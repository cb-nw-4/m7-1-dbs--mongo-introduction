# Exercise 2.6 - `updateGreeting`

Some of the data doesn't have data for the `hello` key. It's missing. We can imagine that if someone were to query a for a language and that language didn't have a value for `hello`, we could turn around and ask them for it. (Making them work to better our database. 😉)

Follow the same steps as in previous exercises.

1. Create a new function called `updateGreeting`.
2. Create an endpoint to update a database entry. Use `.put()` and include `:_id` in the url. This will be the item we want to update.
3. Test the connection. Send a test object in the body.

```json
{
  "test": "bacon"
}
```

4. Respond with the value of the test.

```js
res.status(200).json({ status: 200, _id, ...req.body });
```

5. The function should be built much like `.deleteOne`, with a few exceptions.
   - The `.updateOne()` method accepts TWO objects as arguments. The first one is the query, the second is the "new values."

First Object:

```js
// we are querying on the _id
const query = { _id };
```

Second Object (it must have a key of `$set` that is passed the object containing the key/value to update.).

```js
// contains the values that we which to
const newValues = { $set: { ...req.body } };
```

6. The above `$set` expects the user to pass JSON in the body of the query. Like so:

```json
{
  "hello": "Salut"
}
```

What happens if they pass us a bunch of other stuff? Not good. We could end up polluting our database.

7. We should limit the updating to the `hello` value. Verify the data coming in and only update the appropriate value.
8. If anything else is sent along in the body, it should be ignored.
9. If there is no `hello` key, we should return an error, and **not** modify the database in any way. i.e. just `return`...
10. Finally, we also want to add some confirmation that the database
    1. found the document we want to update
    2. updated the document

Use the following `asserts` to validate this.

```js
assert.equal(1, results.matchedCount);
assert.equal(1, results.modifiedCount);
```
