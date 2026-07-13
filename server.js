const app = require('./src/app')
const mongoDb = require('./src/config/db')

app.listen(3000, () => {
  console.log('Server listen by port 3000')
})
mongoDb()
