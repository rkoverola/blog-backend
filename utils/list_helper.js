const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs.map(b => b.likes)
  const sum = likes.reduce((previous, current) => previous + current, 0)
  return sum
}

const favoriteBlog = (blogs) => {
  if(blogs.length === 0) {
    throw new TypeError('Cannot find favorite in empty list')
  }
  let blogCopy = [...blogs]
  blogCopy.sort((a, b) => b.likes - a.likes)
  return blogCopy[0]
}

const listHelper = { dummy, totalLikes, favoriteBlog }
module.exports = listHelper