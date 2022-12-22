const generarId = () => {
    return Date.now().toString(32) + Math.random().toString(32).substring(2); //para generar un id único y complejo de díficil acceso/deducción.
};

export default generarId;