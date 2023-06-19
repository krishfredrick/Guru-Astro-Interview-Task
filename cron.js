const cron = require('node-cron');
const Task = require('./Models/Task');


function Schedular(){

  cron.schedule("* * 23 * * *", async()=>{
    
    const notification = await Task.find({$match: { status : 'Pending'}});


  });

  if(notification.lenght>0){
    notification.forEach(async(todo)=>{
      const last_hour_task = new Date(todo.notification).getTime();
      const current_date_time = Date.now();
      
      const diff = (current_date_time - last_hour_task)/(1000*60*60);
      if(diff>=24){
        await Task.findOneAndUpdate({_id:todo._id})
      }
    })
  }
}