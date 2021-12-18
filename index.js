const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// Import models
const Post = require('./src/models/post');

// Define application
const app = express()

// Define DB Connection
const db = mongoose.connect('mongodb://localhost:27017/first-node-api-db')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(req, res) {
  // handle the request for root route
  res.send({ ping: 'pong' })
})

// Operations: Create, Read, Update, Delete (CRUD)
app.post('/posts', function(req, res) {
  // Get values from request payload
  const title = req.body.title
  const author = req.body.author
  const content = req.body.content

  // Assign values to Post model
  var post = new Post();
  post.title = title
  post.author = author
  post.content = content

  // Save the post
  post.save(function(error, savedPost) {
    if(error) {
      // send error response
      res.status(500).send({ error: 'Unable to save Post '})
    } else {
      // send success response
      res.status(200).send(savedPost)
    }
  })
});

// Get list of all posts
app.get('/posts', function(req, res) {
  Post.find({}, function(error, posts) {
    if(error) {
      // send error response
      res.status(422).send({ error: 'Unable to fetch posts '})
    } else {
      // send success response
      res.status(200).send(posts)
    }
  })
})

//For Post
app.get('/post',function(req,res){
  // console.log(req);
  // res.status(200).send({text:"Hello"});
  Post.find({id:req.params.id},function(error,post){
      if(error){
        res.status(422).send({error: 'unable to find post'});
      }
      else{
        res.status(200).send(post);
      }
  });
});
//For Update
app.post('/updatePost',function(req,res){
  Post.findOneAndUpdate({id:req.params.id},{author:req.body.author, title : req.body.title, content : req.body.content},function(error,newpost){
    if(error){
      console.log("Error in Updating");
    }
    else{
      res.status(200).send(newpost);
    }
  })
});
//For Delete
app.delete('/deletePost',function(req,res){
  Post.findOneAndDelete({id:req.params.id},function(error,deletedPost){
    if(error){
      res.send(422).send("Error in Deleting post");
    }
    else{
      res.status(200).send(deletedPost);
    }

  });
})
app.listen(3001, function() {
  console.log('Server is running at port 3001....')
})