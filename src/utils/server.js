export default class Server {
    #app
    #server
    constructor(app) {
        this.#app = app
    }
    async conectar({ puerto = 0 }) {
        this.#server = this.#app.listen(puerto, () => {
        })
        this.#server.on('error', error => {
            console.log(error)
        })
    }
    async desconectar() {
        this.#server.close(error => {
            if (error) {
                console.log(error)
            } else {
                console.log("Desconectado")
            }
        })
    }
}