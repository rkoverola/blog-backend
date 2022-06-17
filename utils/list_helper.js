const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs.map(b => b.likes)
  const sum = likes.reduce((previous, current) => previous + current, 0)
  return sum
}

const listHelper = { dummy, totalLikes }
module.exports = listHelper