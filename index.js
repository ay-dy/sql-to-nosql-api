const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const mysqlRoutes = require('./routes/mysql.routes');
const mongodbRoutes = require('./routes/mongodb.routes');
const convertRoutes = require('./routes/convert.routes');

const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/mysql', mysqlRoutes);
app.use('/api/mongodb', mongodbRoutes);
app.use('/api/convert', convertRoutes);

app.listen(port, () => console.log(`Server listening on port ${port}`));
