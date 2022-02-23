# Exercises 4.1.-4.2

In the exercises for this part we will be building a blog list application, that allows users to save information about interesting blogs they have stumbled across on the internet. For each listed blog we will save the author, title, url, and amount of upvotes from users of the application.

## 4.1 Blog list, step1

Let's imagine a situation, where you receive an email that contains the following application body:

``` javascript
const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = 'mongodb://localhost/bloglist'
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

Turn the application into a functioning npm project. In order to keep your development productive, configure the application to be executed with nodemon. You can create a new database for your application with MongoDB Atlas, or use the same database from the previous part's exercises.

Verify that it is possible to add blogs to list with Postman or the VS Code REST client and that the application returns the added blogs at the correct endpoint.

## 4.2 Blog list, step2

Refactor the application into separate modules as shown earlier in this part of the course material.

>NB refactor your application in baby steps and verify that the application works after every change you make. If you try to take a "shortcut" by refactoring many things at once, then Murphy's law will kick in and it is almost certain that something will break in your application. The "shortcut" will end up taking more time than moving forward slowly and systematically.

One best practice is to commit your code every time it is in a stable state. This makes it easy to rollback to a situation where the application still works.

# Exercises 4.8.-4.12

> NB: the material uses the toContain matcher in several places to verify that an array contains a specific element. It's worth noting that the method uses the === operator for comparing and matching elements, which means that it is often not well-suited for matching objects. In most cases, the appropriate method for verifying objects in arrays is the toContainEqual matcher. However, the model solutions don't check for objects in arrays with matchers, so using the method is not required for solving the exercises.

>Warning: If you find yourself using async/await and then methods in the same code, it is almost guaranteed that you are doing something wrong. Use one or the other and don't mix the two.

## 4.8: Blog list tests, step 1

Use the supertest package for writing a test that makes an HTTP GET request to the /api/blogs url. Verify that the blog list application returns the correct amount of blog posts in the JSON format.

Once the test is finished, refactor the route handler to use the async/await syntax instead of promises.

Notice that you will have to make similar changes to the code that were made in the material, like defining the test environment so that you can write tests that use their own separate database.

NB: When running the tests, you may run into the following warning:

![fullstack content](https://fullstackopen.com/static/e8bcb367be162a9be3c71b7f47d855a2/5a190/8a.png)
The problem is quite likely caused by the Mongoose version 6.x, the problem does not appear when the version 5.x is used. Actually Mongoose documentation does not recommend testing Mongoose applications with Jest.

One way to get rid of this is to run tests with option --forceExit:

```
{
  // ..
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development nodemon index.js",
    "lint": "eslint .",
    "test": "cross-env NODE_ENV=test jest --verbose --runInBand --forceExit"
  },
  // ...
}
```

NB: when you are writing your tests it is better to not execute all of your tests, only execute the ones you are working on. Read more about this here.

## 4.9*: Blog list tests, step 2

Write a test that verifies that the unique identifier property of the blog posts is named id, by default the database names the property _id. Verifying the existence of a property is easily done with Jest's toBeDefined matcher.

Make the required changes to the code so that it passes the test. The toJSON method discussed in part 3 is an appropriate place for defining the id parameter.

## 4.10: Blog list tests, step 3

Write a test that verifies that making an HTTP POST request to the /api/blogs url successfully creates a new blog post. At the very least, verify that the total number of blogs in the system is increased by one. You can also verify that the content of the blog post is saved correctly to the database.

Once the test is finished, refactor the operation to use async/await instead of promises.

## 4.11*: Blog list tests, step 4

Write a test that verifies that if the likes property is missing from the request, it will default to the value 0. Do not test the other properties of the created blogs yet.

Make the required changes to the code so that it passes the test.

## 4.12*: Blog list tests, step 5

Write a test related to creating new blogs via the /api/blogs endpoint, that verifies that if the title and url properties are missing from the request data, the backend responds to the request with the status code 400 Bad Request.

Make the required changes to the code so that it passes the test.

# Exercises 4.13.-4.14

## 4.13 Blog list expansions, step1

Implement functionality for deleting a single blog post resource.

Use the async/await syntax. Follow RESTful conventions when defining the HTTP API.

Implement tests for the functionality.

## 4.14 Blog list expansions, step2

Implement functionality for updating the information of an individual blog post.

Use async/await.

The application mostly needs to update the amount of likes for a blog post. You can implement this functionality the same way that we implemented updating notes in part 3.

Implement tests for the functionality.
