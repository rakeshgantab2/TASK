const UserModel = require('../models/user.model');
const { v5: uuidv5 } = require('uuid');

const getAllUsers = async (req, res) => {
  try {
    const hostName = req.get('host');
    let pageNumber = parseInt(req.query.pageNumber);
    let sortingOrder = req.query.sortOrder;
    let pageSize = parseInt(req.query.pageSize);

    if (pageNumber <= 0) {
      return res.json({Success: false,code: 404,msg: 'Page numbers starts with 1'});
    }
    if (pageSize <= 0) {
      return res.json({Success: false,code: 404,msg: 'Page Size should be greater than zero'});
    }
    if (!pageNumber) {
      pageNumber = 1;
    }
    if (!pageSize) {
      pageSize = 10;
    }
    if (!sortingOrder) {
      sortingOrder = 'asc';
    }
    if (sortingOrder !== 'asc' && sortingOrder !== 'desc') {
      return res.json({Success: false,code: 404,msg: 'sortOrder should be either asc or desc'});
    }

    let docsToSkip = (pageNumber - 1) * pageSize;
    const totalNumberOfUsers = await UserModel.count();
    const totalPages = Math.ceil(totalNumberOfUsers / pageSize);
    if ((pageNumber - 1) * pageSize > totalNumberOfUsers) {
      return res.json({Success: false,code: 404,msg: "Page number you entered doesn't exist"});
    }

    const users = await UserModel.find().sort({ age: sortingOrder }).skip(docsToSkip).limit(pageSize);
    const userToSend = [];
    users?.map((user) => {
      userToSend.push({
        userId: user.userId,
        name: user.name,
        age: user.age
      });
    });
    let links;
    if ((pageNumber * pageSize) >= totalNumberOfUsers && pageNumber==1) {
      links = {};
    } else if (pageNumber === 1) {
      const next =hostName +`/users/get-all-users?pageNumber=${pageNumber + 1}&pageSize=${pageSize}&sortOrder=${sortingOrder}`;
      links = {
        next: next
      };
    } else if (((pageNumber+1) * pageSize) > totalNumberOfUsers) {
      const previous =hostName +`/users/get-all-users?pageNumber=${pageNumber - 1}&pageSize=${pageSize}&sortOrder=${sortingOrder}`;
      links = {
        previous: previous
      };
    } else {
      const next = hostName +`/users/get-all-users?pageNumber=${pageNumber + 1}&pageSize=${pageSize}&sortOrder=${sortingOrder}`;
      const previous =hostName +`/users/get-all-users?pageNumber=${pageNumber - 1}&pageSize=${pageSize}&sortOrder=${sortingOrder}`;
      links = {
        next: next,
        previous: previous
      };
    }
    return res.json({Success: true,code: 200,data: {totalNoOfUsers:totalNumberOfUsers ,totalPages: totalPages, currentPage: pageNumber,
        pageSize:pageSize,users: userToSend,links: links}
    });
  } catch (error) {
    console.log(error);
    return res.json({ Success: false, code: 500, error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const userName = req.params.name;
    //console.log(userName);
    if (!userName) {
      return res.json({ Success: false,code: 400,Message: 'Username is not provided'});
    }
    const user = await UserModel.find({ name: userName });
    console.log(user);
    if (!user.length > 0) {
      return res.json({ Success: true,code: 200,msg: `User doesn't exist with mentioned username:${userName}`});
    }
    const userToSend = [];
    user?.map((user) => {
      userToSend.push({
        userId: user.userId,
        name: user.name,
        age: user.age
      });
    });
    return res.json({ Success: true, code: 200, data: userToSend });
  } catch (error) {
    console.log(error);
    return res.json({ Success: false, code: 500, error: error.message });
  }
};

const createUser = async (req, res) => {
  console.log(req.body);
  try {
    const { name, age } = req.body;
    console.log(typeof name, typeof age);
    if (!name || name==="") {
      return res.json({ Success: false,code: 400,Message: 'Bad Request:Name is not provided'});
    }
    if (typeof name !== 'string') {
      return res.json({Success: false,code: 400,Message: 'Bad Request:Name should be of type string'});
    }
    if (!age) {
      return res.json({Success: false,code: 400,Message: 'Bad Request:Either Age is zero or not provided'});
    }
    if (typeof age !== 'number') {
      return res.json({Success: false,code: 400,Message: 'Bad Request:Age should be of type number'});
    }
    if (age <= 0) {
      return res.json({Success: false,code: 400,Message: 'Bad Request:Age should be greater than zero'});
    }
    const userId = uuidv5(name + age, '38708290-0c88-45d9-9720-364aef799fb1');
    const inputBody = {
      userId: userId,
      name: name,
      age: age
    };
    const Response = await UserModel.create(inputBody);
    console.log(Response);
    return res.json({Success: true,code: 200,message: 'User created successfully'});
  } catch (error) {
    console.log(error);
    let errorMessage = error.message;
    if (error.code === 11000) {
      errorMessage = 'User with the age mentioned already exists';
      return res.json({ Success: false, code: 400, error: errorMessage });
    } else {
      return res.json({ Success: false, code: 500, error: errorMessage });
    }
  }
};

module.exports = { getAllUsers, createUser, getUserById };
