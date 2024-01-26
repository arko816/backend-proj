const cron = require('node-cron');
const Task = require('../models/task');
const User = require('../models/user');
const Twilio = require('twilio'); // Assuming you have installed the 'twilio' package

// Twilio configuration
const accountSid = 'twilio_account_sid';
const authToken = 'twilio_auth_token';
const twilioClient = new Twilio(accountSid, authToken);

// Cron logic for changing priority of task based on due_date
cron.schedule('0 0 * * *', async () => {
  try {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);

    // Update priority based on due_date
    await Task.update(
      { priority: 0 },
      { where: { due_date: { $lt: tomorrow } } }
    );

    await Task.update(
      { priority: 1 },
      { where: { due_date: { $gte: tomorrow, $lt: dayAfterTomorrow } } }
    );

    await Task.update(
      { priority: 2 },
      { where: { due_date: { $gte: dayAfterTomorrow } } }
    );

    console.log('Task priorities updated successfully.');
  } catch (error) {
    console.error('Error updating task priorities:', error);
  }
});

// Cron logic for voice calling using Twilio
cron.schedule('0 0 * * *', async () => {
  try {
    // Fetch users with priority 0, 1, 2 in that order
    const users = await User.findAll({ order: [['priority', 'ASC']] });

    for (const user of users) {
      const overdueTasks = await Task.findAll({
        where: {
          status: 'TODO',
          due_date: { $lt: new Date() },
        },
        order: [['due_date', 'ASC']],
        include: [
          {
            model: SubTask,
            where: { status: 0 },
          },
        ],
      });

      if (overdueTasks.length > 0) {
        // Make Twilio voice call to the user
        const message = `Hello, this is a reminder for your overdue tasks. Please check your task list.`;
        await twilioClient.calls.create({
          twiml: `<Response><Say>${message}</Say></Response>`,
          to: user.phone_number,
          from: 'twilio_phone_number',
        });

        console.log(`Voice call made to user with priority ${user.priority}`);
        break; // Break after successfully calling the user
      }
    }

    console.log('Voice calls completed.');
  } catch (error) {
    console.error('Error making voice calls:', error);
  }
});
