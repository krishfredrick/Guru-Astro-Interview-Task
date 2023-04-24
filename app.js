require('dotenv').config();
require('express-async-errors');

const express = require('express');


// EXTRA Security package
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');


/** ROUTES ------------------------------------------> */
const authRouter = require('./Routers/auth');
const TaskRouter = require('./Routers/task');


/** LOCAL FILE -------------------------------------> */
const app = express();
const connectDB = require('./db');
const authenticateUser = require('./Middleware/authentication');
// const cron_schedular = require('./Utils/cron-schedular');

/** ERROR HANDLER ----------------------------------> */
const not_found_middleware = require('./Middleware/not-found')
const error_handler_middleware = require('./Middleware/error-handler')


/**Setting RATE LIMITER ----------------------------> */
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 200,
    legacyHeaders: false
  })
)

/** SYSTEM MIDDLEWARE -----------------------------> */
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(helmet());
app.use(cors());
app.use(xss());

/** Routes -----------------------------------------> */
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/task', authenticateUser, TaskRouter)

app.use(not_found_middleware);
app.use(error_handler_middleware);

// Port listening ------------------------>
const port =  process.env.PORT || 8080;
const start = async()=>{
  try {
    await connectDB(process.env.DB_TOKEN);
    app.listen(port,()=>{
      console.log('Server is running..')
      console.log(`http://localhost:${port}`)
    })

  } catch (err) {
    console.log(">>>",err)
  }
}
start();