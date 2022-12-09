const slugify = require('slugify')

const createSlugify = value => {
  return slugify(value)
}

module.exports = createSlugify
