const express = require('express');

// importing routers from routers folder

const userRouter = require('../routes/user.router');

module.exports = function (app) {
  app.use(express.json({ limit: '50mb' }));
  app.get('', (req, res) => {
    return res.send('Welcome To Test Project');
  });
  app.use('/users', userRouter);
};
