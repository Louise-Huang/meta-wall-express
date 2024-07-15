const express = require('express')
const router = express.Router()
const Post = require('../models/post')
const User = require('../models/user')

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const timeSort = req.query.timeSort === 'asc' ? 'createdAt' : '-createdAt'
  const q = req.query.q !== undefined ? { 'content': new RegExp(req.query.q) } : {}
  const posts = await Post.find(q).populate({
    path: 'user',
    select: 'name photo'
  }).sort(timeSort)
  // asc 遞增(由小到大，由舊到新) createdAt
  // desc 遞減(由大到小、由新到舊) '-createdAt'
  res.status(200).json({
    posts
  })
})

router.post('/', async function(req, res, next) {
  const newPost = await Post.create(req.body)
  res.status(201).json({
    "message": "新增成功",
    posts: newPost
  })
})

router.delete('/', async function(req, res, next) {
  await Post.deleteMany({})
  res.status(200).json({
    "message": "刪除全部成功"
  })
})

router.delete('/:id', async function(req, res, next) {
  try {
    const deleteId = req.params.id
    await Post.findByIdAndDelete(deleteId)
    res.status(200).json({
      "message": "刪除成功"
    })
  } catch (error) {
    res.status(400).json({
      "message": "此 id 不存在"
    })
  }
})

router.patch('/:id', async function(req, res, next) {
  try {
    const patchId = req.params.id
    await Post.findByIdAndUpdate(patchId, req.body)
    const updatePost = await Post.find({ "_id": patchId })
    res.status(200).json({
      "message": "修改成功",
      posts: updatePost
    })
  } catch (error) {
    res.status(400).json({
      "message": "此 id 不存在"
    })
  }
})

module.exports = router;
