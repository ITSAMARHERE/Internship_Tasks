const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');



const registerUser = async (req, res) => {
    const {userName, email, password} = req.body;

    try {

        const checkUser = await User.findOne({email});
        if(checkUser) return res.json({success : false, message: 'User Already exits' })
        
        const hashpassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            userName, email, password: hashpassword,
        });

        await newUser.save()
        res.status(200).json({
            success : true,
            message: "Registeration successful",
        });

    } catch (e) {
        console.log(e),
        res.status(500).json({
            success : false,
            message: "Some error occured"})
        
    }
};



const loginUser = async (req,res) => {
    const {email, password} = req.body;

    try {
        
        const checkUser = await User.findOne({email});
        if(!checkUser) return res.json({
            success : false,
            message : "User doesn't exists! Please register first"
        });

        const checkPasswordMatch =await bcrypt.compare(password, checkUser.password);
        if(!checkPasswordMatch) return res.json({
            success : false,
            message : "Incorrect password! Please try again",
        });

        const token = jwt.sign({
            id : checkUser._id, role: checkUser.role, email : checkUser.email, userName : checkUser.userName,
        }, 'CLIENT_SECRET_KEY', {expiresIn: '60m'})

    //     res.cookie('token', token, {httpOnly: true, secure : true}).json({
    //     success : true,
    //     message : 'Logged in successfully',
    //     user: {
    //         email : checkUser.email,
    //         role : checkUser.role,
    //         id : checkUser._id,
    //         userName : checkUser.userName
    //     }
    // })

    res.status(200).json({
        success : true,
        message : 'Logged in successfully',
        token,
        user: {
                    email : checkUser.email,
                    role : checkUser.role,
                    id : checkUser._id,
                    userName : checkUser.userName
                } 
    })


    } catch (e) {
        console.log(e),
        res.status(500).json({
            success : false,
            message: "Some error occured"
        })
            
        }
    }
//logout

const logoutUser = (req, res) => {
    res.clearCookie("token").json({
        success: true,
        message : "Logged out successfullu",
    })
}


// const authMiddleware = async (req,res,next) => {
//     const token = req.cookies.token;
//     if(!token) return res.status(401).json({
//         success : false,
//         message : 'Unauthorised user!'
//     });

//     try {
//         const decoded = jwt.verify(token, 'CLIENT_SECRET_KEY');
//         req.user = decoded;
//         next()
//     } catch (error) {
//         res.status(401).json({
//             success : false,
//             message : 'Unauthorised user!'
//         });
    
//     }
// }
const authMiddleware = async (req,res,next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) 
        return res.status(401).json({
        success : false,
        message : 'Unauthorised user!'
    });

    try {
        const decoded = jwt.verify(token, 'CLIENT_SECRET_KEY');
        req.user = decoded;
        next()
    } catch (error) {
        res.status(401).json({
            success : false,
            message : 'Unauthorised user!'
        });
    
    }
}




module.exports = {registerUser, loginUser, logoutUser, authMiddleware};



