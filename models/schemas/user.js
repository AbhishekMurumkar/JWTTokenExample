const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require('bcrypt');
const {saltRounds}=require("../../config/config.json");
const { Schema } = mongoose;

const UserSchema = new Schema({
    firstName:{
        type:String,
        required:true,
        validate:{
           validator:(v)=>(v.length>5),
           message:"Firstname should have atleast 5 characters"
        }
    },
    lastName:{
        type:String,
        required:true,
        validate:{
            validator:(v)=>(v.length>5),
            message:"Firstname should have atleast 5 characters"
        }
    },
    email:{
        type:String,
        required:true,
        validate:{
            validator:(v)=>validator.isEmail(v),
            message:`Invalid Email address`,
        }
    },
    alternateEmail:{
        type:String,
        required:false,
        validate:{
            validator:(v)=>validator.isEmail(v),
            message:"Invalid Secondary Email address",
        }
    },
    dateOfBirth:{
        type:Date,
        required:true,
        validate:{
            validator:(v)=>validator.isDate(v)
        }
    },
    mobilePrimary:{
        type:String,
        required:true,
        validate:{
            validator:(v)=>validator.isMobilePhone(v),
            message:'Input format for mobile:91XXXXXXXXXX',
        }
    },
    mobileSecondary:{
        type:String,
        required:false,
        validate:{
            validator:(v)=>validator.isMobilePhone(v),
            message:'Input format for mobile:91XXXXXXXXXX',
        }
    },
    address:{
        type:String,
        required:false,
    },
    age:{
        type:Number,
        require:false,
        validate:{
            validator:(v)=>v>5,
            message:'Minimum age is 6',
        }
    },
    gender:{
        type:String,
        required:true,
        enum:['Male','Female','Other','not disclosed'],
        default:'not disclosed',
        validate:{
            validator:(v)=>['Male','Female','Other','not disclosed'].includes(v),
            message:'Allowed Values are Male/Female/Other.',
        }
    },
    password:{
        required:true,
        type:String,
        validate:{
            validator:(v)=>validator.isStrongPassword(v),
            message:`Got a weak or invalid Password.Criteria for acceptable password are
            1. minimum length  - 8
            2. least lowercase - 1
            3. least uppercase - 1
            4. least symbols   - 1
        `,
        }
    },
    active:{
        required:true,
        type:Boolean,
        default:false
    }
});

UserSchema.pre("save",function(next){
    if (!this.isModified('password')) return next();
    let user =this;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(user.password, salt);
    user.password=hash;
    next();
});

UserSchema.methods.comparePassword=function(formpass,dbpass){
    return bcrypt.compareSync(formpass,dbpass)
}
let UserModal = mongoose.model('User',UserSchema,"Users");
module.exports= UserModal;