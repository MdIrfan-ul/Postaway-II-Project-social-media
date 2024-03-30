import UserRepository from "./user.repository.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default class UserController{
    constructor(){
        this.userRepository = new UserRepository();
    }
    async register(req,res){
        try {
            let {name,email,password,gender} = req.body;
            password = await bcrypt.hash(password,12);
            const newUser = {name,email,password,gender}
            await this.userRepository.register(newUser);
          res.status(201).send(newUser);

        } catch (error) {
            res.status(400).send(error.message)
        }
    }
    async login(req,res,next){
        try {
            const email = req.body.email;
            const password = req.body.password;
            const user = await this.userRepository.findByEmail(email);
            if(!user){
                return res.status(400).send("Invalid Credentials");
            }
            else{
                const passwordMatch = await bcrypt.compare(password,user.password);
                console.log("PasswordMatch Result:",passwordMatch);
                if(passwordMatch){
                    const token = jwt.sign({userID:user._id,userEmail:user.email},process.env.JWT_SECRET_KEY,{expiresIn:'1h'});
                    const validUser = await this.userRepository.login(email,token);
                return res.status(200).send(validUser);}else{
                    return res.status(400).send("Invalid Credentials");
                }
            }
        } catch (error) {
           next(error)
        }
    }
    async logout(req,res){
        try {
            const userId = req.userId;
            console.log(userId);
            const token = req.token;
            console.log(token);
            await this.userRepository.logout(userId,token);
            res.status(200).send("Logged out successfully.");
        } catch (error) {
            console.error(error);
            res.status(error.code).send(error.message);
        }
    }
    async logoutAll(req,res){
        try {
            const userId = req.userId;
            await this.userRepository.logoutAll(userId);
            res.status(200).send("Logged out from all devices")
        } catch (error) {
            console.error(error);
            res.status(error.code).send(error.message);
        }
    }
    async getUser(req,res){try {
        
    } catch (error) {
        
    }}
    async getAllUser(req,res){try {
        
    } catch (error) {
        
    }}
    async updateUser(req,res){try {
        
    } catch (error) {
        
    }}
}