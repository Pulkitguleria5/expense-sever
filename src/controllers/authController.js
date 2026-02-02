const users = require("../dao/userDb");
const userDao = require("../dao/userDao");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {OAuth2Client} = require("google-auth-library");
const emailService = require("../services/emailservice");
const {validationResult} = require("express-validator");


const authController = {

googleSso : async (request, response) => {
  try{
  const { idToken } = request.body;

  if (!idToken) {
    return response.status(400).json({
      message: "Token ID is required",
    });
  }

  const googleclient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  const googleResponse = await googleclient.verifyIdToken({
    idToken: idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { sub: googleId, email, name } = googleResponse.getPayload();

  let user = await userDao.findByEmail(email);

  if (!user) {
    user = await userDao.create({
      name: name,
      email: email,
      googleId: googleId,
    });
  }

  const token = jwt.sign(
    {
      name: user.name,
      email: user.email,
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );


  response.cookie("jwtToken", token, {
    httpOnly: true,
    secure: false,
    domain: "localhost",
    path: "/",
  });

  return response.status(200).json({
    message: "User authenticated via Google SSO",
    user: user,
  });
}
catch (error) {
  console.log(error);
  return response.status(500).json({
    message: "Internal server error",
  });
}
},


login: async (request, response) => {
    const { email, password } = request.body;

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    // if (!email || !password) {
    //   return response.status(400).json({
    //     message: "Email and Password are required",
    //   });
    // }

    const user = await userDao.findByEmail(email);
    //   const user = users.find(
    //     u => u.email === email && u.password === password
    //   );


    if (!user) {
      return response.status(400).json({
        message: "Invalid email or password",
      });
    }
    
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (user && isPasswordMatched) {
      const token = jwt.sign(
        {
          name: user.name,
          email: user.email,
          id: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
      );

      // For local development you usually do NOT want secure:true
      // because you’re using http, not https.
      response.cookie("jwtToken", token, {
        httpOnly: true,
        secure: false,
        domain: "localhost",
        path: "/",
      });

      return response.status(200).json({
        message: "User authenticated",
        user: user,
      });
    }
    //   if (user) {
    //     return response.status(200).json({
    //       message: 'User authenticated',
    //       user: user
    //     });
    // }


    else {
      return response.status(400).json({
        message: "Invalid email or password",
      });
    }
  },

  register: async (request, response) => {
    const { name, email, password } = request.body;
    // console.log(request.body);

    if (!name || !email || !password) {
      return response.status(400).json({
        message: "Name, Email, Password are required",
      });
    }
    // console.log("passess validation");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const user = await userDao.create({
        name: name,
        email: email,
        password: hashedPassword,
      });

      await emailService.send(
        user.email,
        'Welcome to Expense Tracker App',
        `Hello ${user.name},\n\nThank you for registering at our Expense Tracker App! We're excited to have you on board.\n\nBest regards,\nExpense Tracker Team`
      );
      
      return response.status(200).json({
        message: "User registered",
        user: { id: user._id },
      });
    } catch (error) {
      if (error.code === "USER_EXIST") {
        return response.status(400).json({
          message: "User with the email already exist",
        });
      } else {
        return response.status(500).json({
          message: "Internal server error",
        });
      }
    }

  },

    isUserLoggedIn: async (request, response) => {
      try{
        const token = request.cookies.jwtToken;
        if (!token) {
          return response.status(401).json({
            message: "Unauthorized  access - No token provided",
          });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
          if (err) {
            return response.status(401).json({
              message: "Forbidden - Invalid token",
            });
          }
          else {
            return response.status(200).json({
              message: "User is logged in",
              user: user,
            });
          }
        });

      } catch (error) {
        console.log(error);
        return response.status(500).json({
          message: "Internal server error",
        });

      }
    },

  logout: (request, response) => {
    try {
      response.clearCookie("jwtToken");
      return response.status(200).json({  
        message: "User logged out successfully",
      });
    }
    catch (error) {
      return response.status(500).json({
        message: "Internal server error",
      });
    } 
  },

 };




  //   const user = users.find(u => u.email === email);
  //   if (user) {
  //     return response.status(400).json({
  //       message: `User already exist with email: ${email}`
  //     });
  //   }

  //   const newUser = {
  //     id: users.length + 1,
  //     name,
  //     email,
  //     password
  //   };

  //   users.push(newUser);

  //   return response.status(200).json({
  //     message: 'User registered',
  //     user: { id: newUser.id }
  //   });


module.exports = authController;
