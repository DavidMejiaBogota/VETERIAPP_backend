import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {
    const { email, nombre } = req.body;

    //Prevenir usuarios duplicados
    const existeUsuario = await Veterinario.findOne ({email}); //perminte buscar por los difirentes atributos de cada registro/documento.
    if (existeUsuario) { //si el usuario existe ejecuta el siguietne código
      const error = new Error("Usuario ya registrado"); // para que se almacen en el variable error el error :-). 
      return res.status(400).json({msg: error.message}); //mensaje para poder acceder a él en el front-end. 
    }

    try {
        //Guardar un nuevo veterinario
        const veterinario = new Veterinario(req.body);//se crea una instancia del modelo
        const veterinarioGuardado = await veterinario.save();//se guarda la info genenerada en la instancia
        
        //Enviar email de registros del veterinario
        emailRegistro({ //se manda a llamar la función de email registro
            email,
            nombre,
            token: veterinarioGuardado.token,
        }); 
        res.json(veterinarioGuardado);
    } catch (error) {
        console.error(error)
    }
};

const perfil = (req, res) => {
  const { veterinario } = req;
  res.json(veterinario);
};

const confirmar = async (req, res) => {
    const { token } = req.params; //para poder leer  el routing dinamico "token".

    const usuarioConfirmar = await Veterinario.findOne({token});//para que busque el usuario por su token.

    if(!usuarioConfirmar) {
        const error = new Error("Token no válido");
        return res.status(404).json({msg: error.message });
    }

    try {
        usuarioConfirmar.token = null; //se busca el usuario por token
        usuarioConfirmar.confirmado = true; // se modifica el usuario por token
        await usuarioConfirmar.save();// se guardan los datos del usuario buscado, válidado por token.
        res.json({ msg: "Usuario Confirmado Correctamente"}); //mensaje de cara al usuario.        
    } catch (error) {
        console.log(error);
    }
};

const autenticar = async (req, res) => {
    const { email, password } = req.body;

    //Comprobar si el veterinario existe.
    const usuario = await Veterinario.findOne({email});
    if(!usuario) {
        const error = new Error("El veterinario no existe.");
        return res.status(404).json({msg: error.message});
    }

    //Confirmar si el veterinario está confirmado o no.
    if (!usuario.confirmado) {
        const error = new Error("Tu cuenta no ha sido confirmada");
        return res.status(403).json({msg: error.message});
    }
    //Revisar el password.
    if (await usuario.comprobarPassword(password)) {
        //Autenticar el veterinario.
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id),
            telefono: usuario.telefono,
            web: usuario.web,
        });
    } else {
        const error = new Error("El password es incorecto.");
        return res.status(403).json({msg: error.message});
    }
};

const olvidePassword = async (req, res) => {
  const { email } = req.body; //se extrae el email del body/cuerpo de requerimiento.

  const existeVeterinario = await Veterinario.findOne({email}); //luebo buscamos a los veterinario por el email de ese usuario 
  if (!existeVeterinario) {
    const error = new Error("El veterinario no existe.");
    return res.status(400).json({msg: error.message});
  }

  try {
    existeVeterinario.token = generarId();
    await existeVeterinario.save();
    //Enviar email con instrucciones
    emailOlvidePassword({
        email,
        nombre: existeVeterinario.nombre,
        token: existeVeterinario.token
    })
    res.json({msg: "Hemos enviado un email con las instrucciones."});
  } catch (error) {
    console.log(error);
  }
};

const comprobarToken = async (req, res) => {
    const {token} = req.params;//para leer la información de la url.
    const tokenValido = await Veterinario.findOne({token})//buscamos en los veterinarios y validamos por token.
    if(tokenValido) {
        //El token es válido, el usuario existe.
        res.json({msg: "Token válido y el usuario existe"});
    } else {
        const error = new Error("Token no válido.");
        return res.status(400).json({message: error.message});
    }
};

const nuevoPassword = async (req, res) => {

    const {token} = req.params;//se solicita el parametro token para leer la información de la url.
    const {password} = req.body;//se solicita el parametro password para leer desde la información desde el body/cuerpo de la petición.

    const veterinario = await Veterinario.findOne({token});
    if(!veterinario) {
        const error = new Error("Hubo un error");
        return res.status(400).json({msg: error.message});
    }

    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({msg: "Password modificado correctamente"});
    } catch (error) {
        console.log(error);  
    }
};

const actualizarPerfil = async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id);
    if(!veterinario) { 
        const error = new Error('Hubo un error');
        return res.status(400).json({msg : error.message});
    }

    const {email} = req.body
    if(veterinario.email !== req.body.email) {
        const existeEmail = await Veterinario.findOne({email})
        if(existeEmail) {
            const error = new Error('Ese emaiL ya está en uso');
            return res.status(400).json({msg : error.message});
        }
    }

    try {
        veterinario.nombre = req.body.nombre;
        veterinario.email = req.body.email;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;

        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado);
    } catch (error) {
        console.log(error);
    }
};

const actualizarPassword = async (req, res) => {
    //leer los datos
    const {id} = req.veterinario;
    const {pwd_actual, pwd_nuevo} = req.body;


    // comprobar que el veterinario exista
    const veterinario = await Veterinario.findById(id);
    if(!veterinario) { 
        const error = new Error('Hubo un error');
        return res.status(400).json({msg : error.message});
    }

    // comprobar su passwowrd

    if(await veterinario.comprobarPassword(pwd_actual)) {
    // almacenar su nuevo password
        veterinario.password = pwd_nuevo;
        await veterinario.save();
        res.json({msg : 'Password Almacenado Correctamente'});
    } else {
        const error = new Error('El Password Actual es Incorrecto');
        return res.status(400).json({msg : error.message});
    }


    
}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
};