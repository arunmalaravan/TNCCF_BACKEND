const express = require('express');
const cors = require('cors');
const { checkConnection } = require('./config/db.js');
const userRouter = require('./routes/userRoutes.js');
const districtRouter = require('./routes/districtRoutes.js');
const companyRouter = require('./routes/companyRoutes.js');
const amountRouter = require('./routes/amountRoutes.js');
const schemeRouter = require('./routes/schemeRoutes.js');
const companyDistrictMappingRouter = require('./routes/companyDistrictMappingRoutes.js');

const app = express();

app.use(express.json());
app.use(cors());

// Set up routes
app.use('/user', userRouter);
app.use('/district', districtRouter);
app.use('/company', companyRouter);
app.use('/amount', amountRouter);
app.use('/scheme', schemeRouter);
app.use('/company-district-mapping', companyDistrictMappingRouter); // Add the new route here

// Start the server
const port = 3000;
app.listen(port, () => {
    checkConnection();
    console.log(`Server is running on http://localhost:${port}`);
});

