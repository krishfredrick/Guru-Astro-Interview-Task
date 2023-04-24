const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Task = require('../Models/Task')

// create nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  auth: {
    user: 'Rajesh Kannan',
    pass: 'krish_fred'
  }
});

// schedule cron job to run every hour
cron.schedule('0 * * * *', async () => {

  // check for tasks that passed 24 hours
  const unfinishedTasks = await checkUnfinishedTasks();

  // loop through unfinished tasks and check if they are overdue
  for (let task of unfinishedTasks) {
    const hoursPassed = calculateHoursPassed(task.createdAt);

    // if task is overdue, mark it as unfinished and send email notification
    if (hoursPassed > 24) {
      task.status = 'unfinished';
      await sendEmailNotification(task.email, task.todo);
    }
  }
});

// function to check for unfinished tasks
async function checkUnfinishedTasks() {
  // query database to get all unfinished tasks
  const tasks = await Task.find({ status: 'unfinished' });

  return tasks;
}

// function to calculate hours passed since a date
function calculateHoursPassed(date) {
  const hours = Math.abs(new Date() - new Date(date)) / 36e5;
  return hours;
}

// function to send email notification
async function sendEmailNotification(userEmail, taskTitle) {
  try {
    await transporter.sendMail({
      from: 'krishfredrick11@gmail.com',
      to: userEmail,
      subject: `Task "${taskTitle}" is overdue`,
      text: `The task "${taskTitle}" is marked as unfinished because it has passed 24 hours since its due date.`
    });
    console.log(`Email notification sent to ${userEmail}`);
  } catch (error) {
    console.error(`Error sending email notification: ${error}`);
  }
}
