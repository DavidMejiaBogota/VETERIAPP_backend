import express from "express";
const router = express.Router();
import { 
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword,
} from "../controllers/veterinarioController.js"; //exportar las funciones de VeterinarioRoutes.js
import checkAuth from "../middleware/authMiddleware.js";

//Área pública.
router.post("/", registrar);//routing para registar el veterinario.
router.get("/confirmar/:token", confirmar); //routing para confimrar el veterinario con parametro dínamico.
router.post("/login", autenticar); //routing para la autenticación del veterinario.
router.post("/olvide-password", olvidePassword);//routing para la resetear el password.
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);//get routing para enviar un token al veterinario que lo va a leer desde la url; post rotuing para que el veterinario agregue el nuevo password.


//Área privada.
router.get("/perfil", checkAuth, perfil);//routing para acceder al perfil.
router.put('/perfil/:id', checkAuth, actualizarPerfil)//routing para actualizar al perfil.
router.put('/actualizar-password', checkAuth, actualizarPassword)//routing para actualizar password

export default router;
