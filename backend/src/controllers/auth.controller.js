import { register, loginUser } from "../services/auth.service.js";

const create = async (req, res, next) => {
try {

    const {email,password,role} = req.body

    if(!email || !password || !role){
         const error = new Error("Tous les champs n'ont pas été renseignés")
        error.statusCode = 400
        throw error
    }

    const user = await register(req.body)
    if(!user){
        const error = new Error("Erreur lors de la création du nouvel utilisateur")
        error.statusCode = 500
        throw error
    }

    return  res.status(201).json({
        message: "Compte créér avec succès ✅✅",
        user
    })
} catch (error) {

    next(error)
    
}

}

const login = async (req,res,next)=>{

    try {
        console.log(req.body);
        const {email, password} = req.body

    //Si rien est envoyé depuis le front
    if(!email || !password){
        const err = new Error("email and password required")
        err.statusCode = 400 
        throw err
    }

    const loginData = await loginUser({email,password}) 
        req.user = loginData.user

        res.status(200).json({message: "connexion réussie",loginData})

        
    } catch (error) {
        next(error)
    }
        
}

export {
    create,
    login
}
