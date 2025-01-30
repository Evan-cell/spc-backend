import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields (username, email, password) are required." });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Hashed Password:", hashedPassword);

    // Create a new user in the database
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    console.log("New User:", newUser);

    // Respond to the client
    res.status(201).json({ message: "User created successfully", user: { id: newUser.id, username: newUser.username, email: newUser.email } });
  } catch (err) {
    console.error("Error creating user:", err);

    // Handle specific Prisma errors (e.g., unique constraint violation)
    if (err.code === "P2002") {
      return res.status(409).json({ message: "Email or username already exists." });
    }

    res.status(500).json({ message: "Failed to create user!" });
  }
};

export const login = async (req, res) => {
  const {username,password} = req.body;

  try{
    // check if the user exists
    const user = await prisma.user.findUnique({
      where:{username}
    })
    if(!user) return res.status(401).json({message:"invalid cridentials!"})

    // check if the password is correct
    const isPasswordValid = await bcrypt.compare(password,user.password)
    if(!isPasswordValid) return res.status(401).json({message:"invalid cridentials!"})

    // generate cookie token and send to the user
    const age = 1000 * 60 * 60 * 24 * 7;
    const token = jwt.sign({
      id:user.id,
      isAdmin:true
    }, process.env.JWT_SECRET_KEY,
  {expiresIn:age})

  const {password:userPassword, ...userInfo} = user


    
    res.cookie("token",token,{
      httpOnly:true,
      // secure:true
      maxAge:age
    })
    .status(200)
    .json(userInfo)


  }catch(err){
    console.log(err)
    res.status(500).json({ message: "failed to log in." });
  }

};

export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout succesfull." });
};
