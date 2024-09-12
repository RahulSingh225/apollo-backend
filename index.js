const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const { Pool } = require('pg');
const Campaigns = require('./src/datasource/campaignMaster');
const Engagement = require('./src/datasource/Engagement');
const  userRoute = require('./src/routes/UserRoutes');
const  campaignRoute  = require('./src/routes/CampaignRoutes');
const   engagmentRouter  = require('./src/routes/EngagementRoute');
const activityRouter = require('./src/routes/RunningActivites')
const app = express();
const port = 5008;



app.use(bodyParser.json());

// six-digit OTP


app.use('/api',cors(),userRoute);
app.use('/api',cors(),campaignRoute);
app.use('/api',cors(),engagmentRouter);
app.use('/api',cors(),activityRouter)


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
